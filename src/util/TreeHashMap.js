import { List } from './List';
import { ConcurrentIterator } from './Iterator';
import { ConcurrentHashMap } from './ConcurrentHashMap';

/**
 * Map
 */
export class TreeHashMap extends ConcurrentHashMap {

	constructor(list) {
		super(list)
	}

	keySet() {
		const table = [];
		this.list.map((bucket) => {
			bucket.map((kv) => table.push(kv));
		});
		return new ConcurrentIterator(table);
	}

	values() {
		const list = new List();
		this.list.map((bucket) => {
			bucket.map((kv) => list.add(kv.value));
		});
		return list;
	}

}