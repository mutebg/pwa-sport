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
			next => console.log(next),
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
			next => console.log(next),
			error => console.log(error),
			complete => console.log('complete')
		);
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

			</div>
		);
	}
}
