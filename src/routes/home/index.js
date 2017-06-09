import { h, Component } from 'preact';
import style from './style';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/publish';

import {
	findHRensor,
	startNotificationsHR,
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
	lastHR = null;
	lastGPS = null;

	componentDidMount() {
		const HRBtnStart$ = Observable.fromEvent(this.btnFindHR, 'click');
		const GPSBtnStart$ = Observable.fromEvent(this.btnFindGPS, 'click');
		const btnStop$ = Observable.fromEvent(this.btnStop, 'click');

		HRBtnStart$.mergeMap(() =>
			Observable.fromPromise(findHRensor())
				.mergeMap(characteristic =>
					Observable.fromPromise(startNotificationsHR(characteristic))
				)
				.mergeMap(heartRateMeasurement =>
					Observable.fromEvent(
						heartRateMeasurement,
						'characteristicvaluechanged'
					).takeUntil(btnStop$)
				)
				.map(event => parseHeartRate(event.target.value))
		).subscribe(
			next => {
				this.lastHR = next.heartRate;
				this.setState({ hasHR: true });
			},
			error => console.log(error),
			complete => console.log('complete')
		);

		GPSBtnStart$.mergeMap(() =>
			Observable.create(observer => {
				const watchId = navigator.geolocation.watchPosition(
					loc => observer.next(loc),
					err => observer.error(err),
					{
						enableHighAccuracy: true,
						maximumAge: 30000,
						timeout: 27000
					}
				);

				return () => navigator.geolocation.clearWatch(watchId);
			})
				.takeUntil(btnStop$)
				.publish()
				.refCount()
		).subscribe(
			next => {
				this.lastGPS = {
					lat: next.coords.latitude,
					lng: next.coords.longitude
				};
				this.setState({ hasGPS: true });
			},
			error => console.log(error),
			complete => console.log('complete')
		);

		this.timeInterval = setInterval(() => {
			if (this.lastHR && this.lastGPS) {
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

			//console.log('grab latest values and save it in array');
		}, 1000);
	}

	render() {
		return (
			<div class={style.home}>
				<h1>Home</h1>
				<p>This is the Home component.</p>
				<button
					ref={c => {
						this.btnFindHR = c;
					}}
				>
					find HR sensor
				</button>
				<button
					ref={c => {
						this.btnFindGPS = c;
					}}
				>
					find GPS signal
				</button>
				<button
					ref={c => {
						this.btnStop = c;
					}}
				>
					Stop record
				</button>
				{JSON.stringify(this.state.lastRecord)}
			</div>
		);
	}
}
