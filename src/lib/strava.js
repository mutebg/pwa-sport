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
		return new Promise((resolve, reject) => {
			const record = Records.get(id);
			if (this.isLogged() && record) {
				fetch(
					'http://localhost:5002/pwa-sport-d9de2/us-central1/stravaUpload',
					{
						method: 'POST',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							token: this.getToken(),
							record: record.records
						})
					}
				)
					.then(response => {
						Records.update(id, { sync: true });
						resolve(response);
					})
					.catch(error => reject(error));
			}
			else {
				reject('No logged user');
			}
		});
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
