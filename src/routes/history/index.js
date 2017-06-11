import { h, Component } from 'preact';
import style from './style';
import Records from '../../lib/records';

export default class History extends Component {
	state = {
		records: []
	};

	componentWillMount() {
		this.setState({
			records: Records.getAll()
		});
	}

	render(props, state) {
		return (
			<div class={style.history}>
				<h1>Activities</h1>
				{!!state.records && <p>YOUR DON'T HAVE ANYTHIN YET</p>}
				{state.records.map(({ id }) => <div>{id}</div>)}

			</div>
		);
	}
}
