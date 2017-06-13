import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import style from './style';
import Icon from '../icon';

export default class ListItem extends Component {
	render({ id, distance, duration, hr }) {
		return (
			<Link href={`/details/${id}`} class={style.item}>
				<Icon class={style.icon} name="run" />
				<span class={style.distance}>{distance}</span>
				<span class={style.duration}>{duration}</span>
				<span class={style.hr}>{hr}</span>
				<span class={style.id}>{id}</span>
			</Link>
		);
	}
}
