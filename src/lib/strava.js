import Records from './records';
import { reportError } from './reporter';
import { API_URL } from '../config';

export class Strava {
	storeName = 'strava_token';

	getToken() {
		return localStorage.getItem(this.storeName);
	}

	isLogged() {
		return !!this.getToken();
	}

	logIn(token) {
		localStorage.setItem(this.storeName, token);
	}

	async sync(id) {
		try {
			const record = Records.get(id);
			if (this.isLogged() && record) {
				const response = await fetch(API_URL + 'stravaUpload', {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						token: this.getToken(),
						record: record.records
					})
				});
				Records.update(id, { sync: true });
				return response;
			}
			throw 'No logged user';
		}
		catch (err) {
			reportError(err);
		}
	}

	syncAll() {
		const records = Records.getAll();
		records.each(item => {
			if (item.sync === false) {
				this.sync(item.id);
			}
		});
	}
}

export default new Strava();
