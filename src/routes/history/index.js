import { h, Component } from 'preact';
import style from './style';
import Records from '../../lib/records';
import { listAnimation } from '../../lib/animate';
import ListItem from '../../components/listitem';

export default class History extends Component {
	state = {
		records: []
	};

	componentWillMount() {
		this.setState({
			records: Records.getAll()
		});
	}

	componentDidMount() {
		listAnimation();
	}

	render(props, state) {
		return (
			<div class={style.history}>
				{!state.records && <p>YOUR DON'T HAVE ANY RUNS YET</p>}
				{state.records.map(item => <ListItem {...item} />)}
			</div>
		);
	}
}
