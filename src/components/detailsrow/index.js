import { h } from 'preact';
import style from './style';
import Icon from '../icon';

export default function DetailsRow({ icon, label, value }) {
	return (
		<div class={style.row}>
			<Icon name={icon} /> {label}: <span>{value}</span>
		</div>
	);
}
