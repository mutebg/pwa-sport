import { h, Component } from 'preact';
import style from './style';
import Records from '../../lib/records';
import { convertSecToMin } from '../../lib/run';

export default class Details extends Component {
	componentWillMount() {
		this.setState({
			record: Records.get(this.props.id)
		});
	}

	render(props, { record }) {
		const { id, distance, duration, av_hr, av_speed, sync } = record;

		return (
			<div class={style.details}>
				<h1>Details</h1>
				Date/Time: {new Date(id).toLocaleString()}<br />
				Distance: <span>{distance.toFixed(2)}</span> km<br />
				Duration: {convertSecToMin(duration)}<br />
				Av. speed: {av_speed} km/h<br />
				Energy: ---<br />
				Av. heart rate: {av_hr} <br />

			</div>
		);
	}
}
