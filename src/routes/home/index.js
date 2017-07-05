import { h, Component } from 'preact';
import style from './style';
import Btn from '../../components/btn';
import Icon from '../../components/icon';
import { route } from 'preact-router';
import { speak } from '../../lib/speach';
import {
	fundHRensor,
	startNotificationsHR,
	stopNotificationsHR,
	parseHeartRate
} from '../../lib/heartrate';
import Records from '../../lib/records';
import {
	convertSecToMin,
	getDistanceFromLatLonInKm,
	convertKmPerHour
} from '../../lib/run';

export default class Home extends Component {
	state = {
		isCompatible: true,
		hasGPS: false,
		hasHR: false,
		records: [],
		lastRecord: null,
		isRecording: false,
		distance: 0
	};

	timeInterval = null;
	heartRateMeasurement = null;
	navigationWatch = null;
	lastHR = null;
	lastGPS = null;

	onHeartRateChange = event => {
		const hr = parseHeartRate(event.target.value);
		this.setState({ hasHR: true });
		this.lastHR = hr.heartRate;
	};

	onClickStartHR = async () => {
		const characteristic = await fundHRensor();
		const heartRateMeasurement = await startNotificationsHR(characteristic);
		this.heartRateMeasurement = heartRateMeasurement;
		this.heartRateMeasurement.addEventListener(
			'characteristicvaluechanged',
			this.onHeartRateChange
		);
	};

	onClickStartGPS = () => {
		this.navigationWatch = navigator.geolocation.watchPosition(
			location => {
				this.setState({ hasGPS: true });
				this.lastGPS = {
					lat: location.coords.latitude,
					lng: location.coords.longitude
				};
			},
			error => error,
			{
				enableHighAccuracy: true,
				maximumAge: 30000,
				timeout: 27000
			}
		);
	};

	onClickStopRecording = () => {
		// stop watching for HR change
		if (this.heartRateMeasurement) {
			this.heartRateMeasurement.removeEventListener(
				'characteristicvaluechanged',
				this.onHeartRateChange
			);
			stopNotificationsHR(this.heartRateMeasurement);
		}
		// stop watching for GPS position
		if (this.navigationWatch) {
			navigator.geolocation.clearWatch(this.navigationWatch);
		}
		// stop saving data every second
		if (this.timeInterval) {
			clearInterval(this.timeInterval);
		}

		if (this.state.records.length && this.state.isRecording) {
			const id = Records.add(this.state.records);
			route('details/' + id);
		}

		this.setState({
			hasHR: false,
			hasGPS: false,
			isRecording: false,
			records: [],
			lastRecord: null
		});
	};

	onClickStartRecording = () => {
		this.setState({
			isRecording: true
		});
	};

	comonentWillUnmount() {
		this.onClickStopRecording();
	}

	componentWillMount() {
		if (!navigator.bluetooth) {
			this.setState({
				isCompatible: false
			});
		}
	}

	componentDidMount() {
		this.timeInterval = setInterval(() => {
			if (this.state.isRecording && this.lastHR && this.lastGPS) {
				const lastRecord = {
					heartRate: this.lastHR,
					gps: this.lastGPS,
					time: Date.now()
				};
				const records = this.state.records;

				// calculate current distance
				let distance = 0;
				if (this.state.lastRecord) {
					distance = getDistanceFromLatLonInKm(
						this.state.lastRecord.gps.lat,
						this.state.lastRecord.gps.lng,
						lastRecord.gps.lat,
						lastRecord.gps.lng
					);
				}

				const totalDistance = this.state.distance + distance;
				// speak on ever new kilometer
				if (parseInt(totalDistance, 10) !== parseInt(this.state.distance, 10)) {
					speak(`Distance ${parseInt(totalDistance, 10)} km`);
				}

				//update state every second
				records.push(lastRecord);
				this.setState({
					lastRecord,
					records,
					distance: totalDistance
				});
			}
		}, 1000);
	}

	renderWaitingScreen(props, { isRecording, hasHR, hasGPS }) {
		const btnFinHR = !isRecording
			? (<Btn disabled={hasHR} onClick={this.onClickStartHR}>
					<Icon name="heart" size={hasHR ? '42px' : '28px'} pulse={hasHR} />
					{!hasHR && 'find HR sensor'}
				</Btn>)
			: null;

		const btnFindGPS = !isRecording
			? (<Btn disabled={hasGPS} onClick={this.onClickStartGPS}>
					<Icon
						name="location"
						size={hasGPS ? '42px' : '28px'}
						pulse={hasGPS}
					/>
					{!hasGPS && 'find GPS signal'}
				</Btn>)
			: null;

		const className =
			style.waiting + ' ' + (!hasHR || !hasGPS ? style.waitingShow : '');

		return (
			<div class={className}>
				<div class={style.waitingLabel}>
					Before start your run, you need to connect to Heart Rate sensor and
					find GPS signal
				</div>
				<div class={style.waitingBtns}>
					{btnFinHR}
					{btnFindGPS}
				</div>
			</div>
		);
	}

	renderReadyScreen(
		props,
		{ hasHR, hasGPS, lastRecord, isRecording, records, distance }
	) {
		const className =
			style.running + ' ' + (hasHR && hasGPS ? style.runningShow : '');

		const heartRate = (lastRecord && lastRecord.heartRate) || '--';
		const seconds = records.length;
		const totalTime = convertSecToMin(seconds);

		return (
			<div class={className}>
				<p class={style.hrlabel}>
					<Icon name="heart" /> {heartRate} Heartrate
				</p>

				<div class={style.runbtn}>
					{isRecording &&
						<Btn large onClick={this.onClickStopRecording}>
							<Icon name="pause" size="80px" />
							press to finish<br />your run
						</Btn>}

					{hasHR &&
						hasGPS &&
						!isRecording &&
						<Btn large onClick={this.onClickStartRecording}>
							<Icon name="start" size="80px" />
							press to start<br /> your run
						</Btn>}
				</div>

				<div class={style.grid}>
					<div>
						Av. speed<br />
						<span>{convertKmPerHour(distance, seconds)}</span> km/h
					</div>
					<div>
						Pace<br />
						<span>-.--</span> km/h
					</div>
					<div>
						Time<br />
						<span>{totalTime}</span> min
					</div>
					<div>
						Distance<br />
						<span>{distance.toFixed(2)}</span> km
					</div>
				</div>
			</div>
		);
	}

	render(props, state) {
		if (!state.isCompatible) {
			return (
				<div class="alert">Your browser doesn't support Web Bluetooth API</div>
			);
		}

		return (
			<div class={style.home}>
				{this.renderWaitingScreen(props, state)}
				{this.renderReadyScreen(props, state)}
			</div>
		);
	}
}
