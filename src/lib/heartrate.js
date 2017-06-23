const DEVICE_SERVICES = ['heart_rate'];
const DEVICE_CHAR = 'heart_rate_measurement';

export function fundHRensor() {
	//log('Requesting Bluetooth Device...');
	return navigator.bluetooth
		.requestDevice({
			filters: [{ services: DEVICE_SERVICES }]
		})
		.then(device => device.gatt.connect())
		.then(server => server.getPrimaryService('heart_rate'))
		.then(service => service.getCharacteristic(DEVICE_CHAR));
}

export function startNotificationsHR(characteristic) {
	return characteristic.startNotifications();
}

export function stopNotificationsHR(characteristic) {
	return characteristic.stopNotifications();
}

export const parseHeartRate = value => {
	// In Chrome 50+, a DataView is returned instead of an ArrayBuffer.
	value = value.buffer ? value : new DataView(value);
	let flags = value.getUint8(0);
	let rate16Bits = flags & 0x1;
	let result = {};
	let index = 1;
	if (rate16Bits) {
		result.heartRate = value.getUint16(index, /*littleEndian=*/ true);
		index += 2;
	}
	else {
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
