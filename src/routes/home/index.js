import { h, Component } from 'preact';
import style from './style';

import {
	fundHRensor,
	startNotificationsHR,
	stopNotificationsHR,
	parseHeartRate
} from '../../lib/heartrate';

export default class Home extends Component {
	state = {
		hasGPS: false,
		hasHR: false,
		records: [],
		lastRecord: null
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

	onClickStartHR = () => {
		fundHRensor().then(characteristic => {
			startNotificationsHR(characteristic).then(heartRateMeasurement => {
				this.heartRateMeasurement = heartRateMeasurement;
				this.heartRateMeasurement.addEventListener(
					'characteristicvaluechanged',
					this.onHeartRateChange
				);
			});
		});
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

		this.setState({
			hasHR: false,
			hasGPS: false
		});

		// SAVE DATA TO LOCAL STORAGE
	};

	componentDidMount(props, state) {
		this.timeInterval = setInterval(() => {
			if (this.lastHR && this.lastGPS) {
				if (
					!this.state.lastRecord ||
					this.state.lastRecord.heartRate !== this.lastHR ||
					this.state.lastRecord.gps !== this.lastGPS
				) {
					const lastRecord = {
						heartRate: this.lastHR,
						gps: this.lastGPS,
						time: Date.now()
					};
					const records = this.state.records;
					records.push(lastRecord);
					this.setState({
						lastRecord,
						records
					});
				}
			}
		}, 1000);
	}

	render(props, state) {
		return (
			<div class={style.home}>
				<h1>Home</h1>
				<p>This is the Home component.</p>
				<button disabled={state.hasHR} onClick={this.onClickStartHR}>
					find HR sensor
				</button>
				<button disabled={state.hasGPS} onClick={this.onClickStartGPS}>
					find GPS signal
				</button>
				<button
					disabled={!state.hasGPS || !state.hasHR}
					onClick={this.onClickStopRecording}
				>
					Stop record
				</button>
				{JSON.stringify(this.state.lastRecord)}
			</div>
		);
	}
}
