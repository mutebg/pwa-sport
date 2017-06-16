import { h, Component } from 'preact';
import style from './style';
import Records from '../../lib/records';

export default class Details extends Component {
	componentWillMount() {
		this.setState({
			record: Records.get(this.props.id)
		});
	}

	render(props, { record }) {
		console.log(props, this.state);
		return (
			<div class={style.details}>
				<h1>Details</h1>
				{JSON.stringify(record)}
			</div>
		);
	}
}
