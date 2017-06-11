import { h, Component } from 'preact';
import style from './style';
import Btn from '../../components/btn';
import Icon from '../../components/icon';
import { route } from 'preact-router';
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

	componentDidMount() {
		this.timeInterval = setInterval(() => {
			if (this.state.isRecording && this.lastHR && this.lastGPS) {
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
		}, 1000);
	}

	renderWaitingScreen(props, state) {
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

		const className =
			style.waiting +
			' ' +
			(!state.hasHR || !state.hasGPS ? style.waitingShow : '');

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

	renderReadyScreen(props, state) {
		const className =
			style.running +
			' ' +
			(state.hasHR && state.hasGPS ? style.runningShow : '');

		return (
			<div class={className}>
				<p class={style.hrlabel}><Icon name="heart" /> 120 Heartrate</p>

				<div class={style.runbtn}>
					{state.isRecording &&
						<Btn large onClick={this.onClickStopRecording}>
							<Icon name="pause" size="80px" />
							press to finish<br />your run
						</Btn>}

					{state.hasHR &&
						state.hasGPS &&
						!state.isRecording &&
						<Btn large onClick={this.onClickStartRecording}>
							press to start your run
						</Btn>}
				</div>

				<div class={style.grid}>
					<div>
						Av. speed<br />
						<span>8.92</span> km/h
					</div>
					<div>
						Pace<br />
						<span>8.92</span> km/h
					</div>
					<div>
						Time<br />
						<span>42:32</span> min
					</div>
					<div>
						Distance<br />
						<span>7:23</span> km
					</div>
				</div>
			</div>
		);
	}

	render(props, state) {
		return (
			<div class={style.home}>
				{this.renderWaitingScreen(props, state)}
				{this.renderReadyScreen(props, state)}
			</div>
		);
	}
}
