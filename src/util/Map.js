import { IteratorMap } from './Iterator';
import { List } from './List';

/**
 * Map
 */
export class Map {

	constructor(object) {
		this.hashMap = object || {};
	}

	put(key, value) {
		this.hashMap[key] = value;
		return value;
	}

	putAll(objects) {
		Object.keys(objects).map((key) => this.put(key, objects[key]));
	}

	getByIndex(index) {
		return this.hashMap[Object.keys(this.hashMap)[index]];
	}

	getValue(key) {
		return this.hashMap[key];
	}

	get(key) {
		return this.getValue(key);
	}

	getOrDefault(key, defaultValue) {
		const value = new List();
		return this.contains(key) ?
			defaultValue instanceof List && !(this.getValue(key) instanceof List)
				? new List([this.getValue(key)]) : this.getValue(key)
			: defaultValue;
	}

	values() {
		const iterator = this.keySet();
		const list = new List();
		while (iterator.hasNext()) {
			list.add(iterator.getValue());
			iterator.next()
		}
		return list;
	}

	size() {
		return Object.keys(this.hashMap).length;
	}

	isEmpty() {
		return Object.keys(this.hashMap).length === 0;
	}

	removeByIndex(index) {
		const value = this.hashMap[Object.keys(this.hashMap)[index]];
		delete this.hashMap[Object.keys(this.hashMap)[index]];
		return value;
	}

	remove(key) {
		const value = this.hashMap[key];
		delete this.hashMap[key];
		return value;
	}

	forEach(callback) {
		const iterator = this.keySet();
		while (iterator.hasNext()) {
			callback(iterator);
			iterator.next();
		}
	}

	contains(key) {
		return !this.isEmpty() && key in this.hashMap;
	}

	containsKey(key) {
		return this.contains(key);
	}

	keySet() {
		return new IteratorMap(this.hashMap);
	}

	getKeys() {
		const iterator = this.keySet();
		const list = new List();
		while (iterator.hasNext()) {
			list.add(iterator.getKey());
			iterator.next()
		}
		return list;
	}

	map(callback) {
		const iterator = this.keySet();
		const list = new List();
		while (iterator.hasNext()) {
			list.add(callback(iterator));
			iterator.next();
		}
		return list;
	}

	compute(key, remappingFunction) {
		let oldValue = this.get(key);

		let newValue = remappingFunction(key, oldValue);
		if (newValue == null) {
			// delete mapping
			if (oldValue !== null || this.containsKey(key)) {
				// something to remove
				this.remove(key);
				return null;
			} else {
				// nothing to do. Leave things as they were.
				return null;
			}
		} else {
			// add or replace old mapping
			this.put(key, newValue);
			return newValue;
		}
	}

	clone() {
		const clone = new Map();
		const iterator = this.keySet();
		while (iterator.hasNext()) {
			clone.put(iterator.getKey(), iterator.getValue());
			iterator.next();
		}
		return clone();
	}

	clear() {
		this.hashMap = {};
	}

	toString() {
		const i = this.keySet();
		if (!i.hasNext())
			return "{}";

		const sb = [];
		sb.push('{');
		for (; ;) {
			const key = i.getKey();
			const value = i.getValue();
			sb.push(key === this ? "(this Map)" : key.toString());
			sb.push('=');
			sb.push(value === this ? "(this Map)" : value.toString());
			i.next();
			if (!i.hasNext()) {
				sb.push('}');
				return sb.join('');
			}
			sb.push(', ');
		}
	}
}
