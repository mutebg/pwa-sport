class Records {
	storeName = 'records';

	add(item) {
		const all = this.getAll();
		// do some calculation / av speed / distance / etc
		item.id = Date.now();
		item.sync = false;
		all.push(item);
		localStorage.setItem(this.storeName, JSON.stringify(all));
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
