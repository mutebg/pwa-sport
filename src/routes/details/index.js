import { h, Component } from 'preact';
import style from './style';
import Records from '../../lib/records';
import { convertSecToMin } from '../../lib/run';
import Strava from '../../lib/strava';
import DetailsRow from '../../components/detailsrow';
import { API_URL } from '../../config';
import { reportError } from '../../lib/reporter';
import { detailsPage } from '../../lib/animate';

export default class Details extends Component {
	syncStrava = () => {
		this.setState({ isSyncing: true }, () => {
			Strava.sync(this.props.id).then(() => {
				this.setState({
					record: Records.get(this.props.id),
					isSyncing: false
				});
			});
		});
	};

	loadMap = () => {
		import('../../components/map').then(Map => {
			this.setState({
				map: <Map.default points={this.state.record.records} />
			});
		});
	};

	constructor() {
		super();
		this.state = {
			map: null
		};
	}

	componentWillMount() {
		this.setState({
			record: Records.get(this.props.id),
			isSyncing: false
		});
	}

	componentDidMount() {
		detailsPage();
	}

	renderStravaBanner({ id }, { isSyncing, record }) {
		if (!record.sync) {
			if (!Strava.isLogged()) {
				return (
					<a
						href={`${API_URL}stravaLogin?state=${id}`}
						class="inline-btn inline-btn--strava"
					>
						Login to sync with Strava
					</a>
				);
			}
			const label = isSyncing ? 'Syncing...' : 'Sync with Strava';
			return (
				<button
					class="inline-btn inline-btn--strava"
					onClick={this.syncStrava}
					disabled={isSyncing}
				>
					{label}
				</button>
			);
		}
		return null; // <div>This run is synced with Strava</div>;
	}

	render(props, state) {
		const { id, distance, duration, av_hr, av_speed } = state.record;

		const data = [
			{
				icon: 'date',
				label: 'Date',
				value: new Date(id).toLocaleString()
			},
			{ icon: 'run', label: 'Distance', value: distance.toFixed(2) + 'km' },
			{ icon: 'timer', label: 'Duration', value: convertSecToMin(duration) },
			{ icon: 'time', label: 'Av. speed', value: av_speed + 'km/h' },
			{ icon: 'fire', label: 'Energy', value: '---' },
			{ icon: 'heart', label: 'Av. heart rate', value: av_hr }
		];

		return (
			<div class={style.details}>
				<div class="rows">
					{data.map(item => <DetailsRow {...item} />)}
				</div>

				{this.renderStravaBanner(props, state)}

				{state.map
					? state.map
					: <button class="inline-btn" onClick={this.loadMap}>
							Show map
						</button>}
			</div>
		);
	}
}
