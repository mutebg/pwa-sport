class Records {
	storeName = 'records';

	add(records) {
		const all = this.getAll();
		console.log({ all });
		// do some calculation / av speed / distance / etc
		const item = {
			id: Date.now(),
			sync: false,
			av_speed: 10,
			duration: records.length,
			distance: 7,
			records
		};
		console.log(item);
		all.push(item);
		localStorage.setItem(this.storeName, JSON.stringify(all));

		return item.id;
	}

	get(id) {
		const items = this.getAll().filter(item => item.id === id);
		return items ? items[0] : null;
	}

	getAll() {
		const items = JSON.parse(localStorage.getItem(this.storeName));
		if (!items) {
			return [];
		}
		return items;
	}

	sync() {
		// TODO: sync with strava
	}
}

export default new Records();
