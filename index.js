const DEVICE_SERVICES = ["heart_rate"];
const DEVICE_CHAR = "heart_rate_measurement";

const log = e => console.log(e);

async function fundHRensor() {
  try {
    log("Requesting Bluetooth Device...");
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: DEVICE_SERVICES }]
    });

    log("Connecting to GATT Server...");
    const server = await device.gatt.connect();

    log("Getting Heart Rate Service...");
    const service = await server.getPrimaryService("heart_rate");

    log("Getting Heart Rate heart_rate_measurement Characteristic...");
    const characteristic = await service.getCharacteristic(DEVICE_CHAR);
    return characteristic;
  } catch (error) {
    log("Argh! " + error);
    return false;
  }
}

async function startNotificationsHR(characteristic) {
  return await characteristic.startNotifications();
}

async function stopNotificationsHR(characteristic) {
  return await characteristic.stopNotifications();
}

const parseHeartRate = value => {
  // In Chrome 50+, a DataView is returned instead of an ArrayBuffer.
  value = value.buffer ? value : new DataView(value);
  let flags = value.getUint8(0);
  let rate16Bits = flags & 0x1;
  let result = {};
  let index = 1;
  if (rate16Bits) {
    result.heartRate = value.getUint16(index, /*littleEndian=*/ true);
    index += 2;
  } else {
    result.heartRate = value.getUint8(index);
    index += 1;
  }
  let contactDetected = flags & 0x2;
  let contactSensorPresent = flags & 0x4;
  if (contactSensorPresent) {
    result.contactDetected = !!contactDetected;
  }
  let energyPresent = flags & 0x8;
  if (energyPresent) {
    result.energyExpended = value.getUint16(index, /*littleEndian=*/ true);
    index += 2;
  }
  let rrIntervalPresent = flags & 0x10;
  if (rrIntervalPresent) {
    let rrIntervals = [];
    for (; index + 1 < value.byteLength; index += 2) {
      rrIntervals.push(value.getUint16(index, /*littleEndian=*/ true));
    }
    result.rrIntervals = rrIntervals;
  }
  return result;
};

const btnFindHR = document.getElementById("find-hr");
const btnFindGPS = document.getElementById("find-gps");
const btnStop = document.getElementById("stop");

const HRBtnStart$ = Rx.Observable.fromEvent(btnFindHR, "click");
const HRBtnStop$ = Rx.Observable.fromEvent(btnStop, "click");
const HRMeasurement$ = Rx.Observable.create(async function cr(observer) {
  const characteristic = await fundHRensor();
  const heartRateMeasurement = await startNotificationsHR(characteristic);
  const onChagne = event => {
    const heartRateMeasurement = parseHeartRate(event.target.value);
    observer.onNext(heartRateMeasurement);
  };

  heartRateMeasurement.addEventListener("characteristicvaluechanged", onChagne);

  return () => {
    stopNotificationsHR(characteristic);
    heartRateMeasurement.removeEventListener(
      "characteristicvaluechanged",
      onChagne
    );
  };
});

const HRvalues$ = HRBtnStart$.flatMap(() => HRMeasurement$.takeUntill(btnStop));

HRvalues$.subscribe(data => console.log(data));
// startWith
// takeUntill -> click End;
