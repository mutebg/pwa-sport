import { h, Component } from 'preact';
import style from './style';

export default class Btn extends Component {
	render({ children, large, ...rest }) {
		const mainClassName = large
			? style.wraper + ' ' + style.large
			: style.wraper;

		return (
			<button class={mainClassName} {...rest}>
				<span class={style.inside}>{children}</span>
			</button>
		);
	}
}
