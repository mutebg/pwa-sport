import { h, Component } from 'preact';
import style from './style.less';

export default class Icon extends Component {
	render({ name, size = '24px', pulse = false }) {
		const className = pulse ? style.pulse + ' icon' : 'icon';
		return (
			<svg
				class={className}
				style={{ verticalAlign: 'middle', width: size, height: size }}
			>
				<use xlinkHref={`#${name}`} />
			</svg>
		);
	}
}
