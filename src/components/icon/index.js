import { h, Component } from 'preact';
import heart from '../../assets/heart.svg';
import location from '../../assets/location.svg';
import run from '../../assets/run.svg';
import time from '../../assets/time.svg';
import timer from '../../assets/timer.svg';
import start from '../../assets/start.svg';
import pause from '../../assets/pause.svg';
import date from '../../assets/date.svg';
import fire from '../../assets/fire.svg';
import style from './style.less';

export default class Icon extends Component {
	render({ name, size = '24px', pulse = false }) {
		let svg = null;
		switch (name) {
			case 'heart':
				svg = heart;
				break;

			case 'location':
				svg = location;
				break;

			case 'run':
				svg = run;
				break;

			case 'timer':
				svg = timer;
				break;

			case 'time':
				svg = time;
				break;

			case 'start':
				svg = start;
				break;

			case 'pause':
				svg = pause;
				break;

			case 'date':
				svg = date;
				break;

			case 'fire':
				svg = fire;
				break;
		}

		const className = pulse ? style.pulse : null;

		return (
			<img
				src={svg}
				class={className}
				style={{ verticalAlign: 'middle', width: size, height: size }}
			/>
		);
	}
}
