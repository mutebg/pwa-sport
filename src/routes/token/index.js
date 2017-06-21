import { h, Component } from 'preact';
import { route } from 'preact-router';
import Strava from '../../lib/strava';

// Retrieve a token and redirect to sertain details page
export default class Token extends Component {
	componentWillMount() {
		const { token, state } = this.props;
		if (token) {
			Strava.logIn(token);
		}
		if (state) {
			route('details/' + state);
		}
		else {
			route('history/');
		}
	}

	render(props, state) {
		return (
			<div>
				<h1 style={{ margin: '4em 0' }}>Loading</h1>
			</div>
		);
	}
}
