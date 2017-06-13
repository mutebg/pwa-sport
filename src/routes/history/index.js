import { h, Component } from 'preact';
import style from './style';
import Records from '../../lib/records';
import ListItem from '../../components/lisitem';

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
				{!state.records && <p>YOUR DON'T HAVE ANYTHIN YET</p>}
				{state.records.map((item) => <ListItem {...item} />)}

			</div>
		);
	}
}
