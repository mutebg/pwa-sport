import Records from './records';

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

	sync(id) {
		const record = Records.get(id);
		if (this.isLogged() && record) {
			fetch('stravaLogin', {
				method: 'POSt',
				headers: {
					Accept: 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					token: this.getToken(),
					record: record.record
				})
			});
		}
		else {
			throw Error('no logged');
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
