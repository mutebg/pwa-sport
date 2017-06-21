import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import style from './style';
import Icon from '../icon';
import { convertSecToMin } from '../../lib/run';
import { humanDateFromTS } from '../../lib/date';

export default class ListItem extends Component {
	render({ id, distance, duration, av_hr, av_speed, sync }) {
		return (
			<Link href={`/details/${id}`} class={style.item}>
				<span class={style.distance}>
					<Icon class={style.icon} name="run" />
					{distance.toFixed(2)} km
				</span>
				<span class={style.duration}>
					<Icon name="timer" class={style.icon} />
					{convertSecToMin(duration)}
				</span>
				<span class={style.date}>
					<Icon name="date" class={style.icon} />
					{humanDateFromTS(id)}
				</span>
			</Link>
		);
	}
}
