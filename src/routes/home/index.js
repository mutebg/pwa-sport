import { h, Component } from 'preact';
import style from './style';
import Btn from '../../components/btn';
import Icon from '../../components/icon';
import {
	fundHRensor,
	startNotificationsHR,
	stopNotificationsHR,
	parseHeartRate
} from '../../lib/heartrate';
import Records from '../../lib/records';

export default class Home extends Component {
	state = {
		hasGPS: false,
		hasHR: false,
		records: [],
		lastRecord: null,
		isRecording: false
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

		if (this.state.records.length && this.state.isRecording) {
			// TODO
			// SAVE DATA TO LOCAL STORAGE
			Records.add(this.store.records);
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

	componentDidMount() {
		this.timeInterval = setInterval(() => {
			if (this.state.isRecording && this.lastHR && this.lastGPS) {
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
		const btnFinHR = !state.isRecording
			? (<Btn disabled={state.hasHR} onClick={this.onClickStartHR}>
					<Icon
						name="heart"
						size={state.hasHR ? '42px' : '28px'}
						pulse={state.hasHR}
					/>
					{!state.hasHR && 'find HR sensor'}
				</Btn>)
			: null;

		const btnFindGPS = !state.isRecording
			? (<Btn disabled={state.hasGPS} onClick={this.onClickStartGPS}>
					<Icon
						name="location"
						size={state.hasGPS ? '42px' : '28px'}
						pulse={state.hasGPS}
					/>
					{!state.hasGPS && 'find GPS signal'}
				</Btn>)
			: null;

		return (
			<div class={style.home}>
				<div class={style.btnWrapper}>
					{btnFinHR}
					{btnFindGPS}
				</div>

				{state.isRecording &&
					<Btn large onClick={this.onClickStopRecording}>
						Stop record
					</Btn>}

				{state.hasHR &&
					state.hasGPS &&
					!state.isRecording &&
					<Btn large onClick={this.onClickStartRecording}>
						Start record
					</Btn>}

				{JSON.stringify(this.state.lastRecord)}
			</div>
		);
	}
}
