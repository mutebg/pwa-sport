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
		all.unshift(item);
		localStorage.setItem(this.storeName, JSON.stringify(all));

		return item.id;
	}

	get(id) {
		id = Number(id);
		const items = this.getAll().filter(item => item.id === id);
		return items ? items[0] : null;
	}

	update(id, map) {
		id = Number(id);
		const items = this.getAll().map(item => {
			if (item.id === id) {
				return Object.assign({}, item, map);
			}
			return item;
		});
		localStorage.setItem(this.storeName, JSON.stringify(items));
	}

	getAll() {
		const items = JSON.parse(localStorage.getItem(this.storeName));
		if (!items) {
			return [];
		}
		return items;
	}
}

export default new Records();
