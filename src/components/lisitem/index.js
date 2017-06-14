import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import style from './style';
import Icon from '../icon';
import { convertSecToMin } from '../../lib/run';

export default class ListItem extends Component {
	render({ id, distance, duration, av_hr, av_speed, sync }) {
		return (
			<Link href={`/details/${id}`} class={style.item}>
				<Icon class={style.icon} name="run" />
				<span class={style.distance}>{distance.toFixed(2)} km</span> |
				<span class={style.duration}>{convertSecToMin(duration)}</span> |
				<span class={style.av_hr}>{av_hr} hr</span> |
				<span class={style.av_speed}>{av_speed} km/h</span> |
			</Link>
		);
	}
}
