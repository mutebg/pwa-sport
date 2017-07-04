import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from './header';
import Home from '../routes/home';
import History from '../routes/history';
import Details from '../routes/details';
import Token from '../routes/token';

export default class App extends Component {

	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
		return (
			<div id="app">
				<Header />
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<History path="/history" />
					<Details path="/details/:id" />
					<Token path="/token/" />
				</Router>

				<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0">
					<defs>
						<linearGradient id="gr">
							<stop stop-color="#007aff" offset="0%" />
							<stop stop-color="#bd15f9" offset="100%" />
						</linearGradient>
					</defs>
					<symbol id="date" viewBox="0 0 24 24">
						<path
							fill="url(#gr)"
							d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"
						/>
						<path d="M0 0h24v24H0z" fill="none" />
					</symbol>
					<symbol id="fire" viewBox="0 0 24 24">
						<path
							fill="url(#gr)"
							d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"
						/>
						<path d="M0 0h24v24H0z" fill="none" />
					</symbol>
					<symbol id="heart" viewBox="0 0 24 24">
						<path d="M0 0h24v24H0z" fill="none" />
						<path
							fill="url(#gr)"
							d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
						/>
					</symbol>
					<symbol id="location" viewBox="0 0 24 24">
						<path d="M0 0h24v24H0z" fill="none" />
						<path
							fill="url(#gr)"
							d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
						/>
					</symbol>
					<symbol id="pause" viewBox="0 0 24 24">
						<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="#fff" />
						<path d="M0 0h24v24H0z" fill="none" />
					</symbol>
					<symbol id="run" viewBox="0 0 24 24">
						<path d="M0 0h24v24H0z" fill="none" />
						<path
							fill="url(#gr)"
							d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"
						/>
					</symbol>
					<symbol id="start" viewBox="0 0 24 24">
						<path d="M8 5v14l11-7z" fill="#fff" />
						<path d="M0 0h24v24H0z" fill="none" />
					</symbol>
					<symbol id="time" viewBox="0 0 24 24">
						<path d="M0 0h24v24H0z" fill="none" />
						<path
							fill="url(#gr)"
							d="M16.24 7.76C15.07 6.59 13.54 6 12 6v6l-4.24 4.24c2.34 2.34 6.14 2.34 8.49 0 2.34-2.34 2.34-6.14-.01-8.48zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
						/>
					</symbol>
					<symbol id="timer" viewBox="0 0 24 24">
						<path d="M0 0h24v24H0z" fill="none" />
						<path
							fill="url(#gr)"
							d="M11 17c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1-1 .45-1 1zm0-14v4h2V5.08c3.39.49 6 3.39 6 6.92 0 3.87-3.13 7-7 7s-7-3.13-7-7c0-1.68.59-3.22 1.58-4.42L12 13l1.41-1.41-6.8-6.8v.02C4.42 6.45 3 9.05 3 12c0 4.97 4.02 9 9 9 4.97 0 9-4.03 9-9s-4.03-9-9-9h-1zm7 9c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1zM6 12c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1-1 .45-1 1z"
						/>
					</symbol>
				</svg>
			</div>
		);
	}
}
