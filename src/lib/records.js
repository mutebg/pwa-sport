import { calcRunMetrics } from './run';

class Records {
	storeName = 'records';

	add(records) {
		const all = this.getAll();
		// do some calculation / av speed / distance / etc
		const { distance, av_speed, av_hr } = calcRunMetrics(records);

		const item = {
			id: Date.now(),
			sync: false,
			av_speed,
			av_hr,
			duration: records.length,
			distance,
			records
		};
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
