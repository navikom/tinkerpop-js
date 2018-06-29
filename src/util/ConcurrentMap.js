import { IteratorMap, ConcurrentIterator } from './Iterator';
import { List } from './List';

/**
 * Map
 */
export class ConcurrentMap {

	constructor(list) {
		this.list = list || [];
	}

	// todo add hash table
	put(key, value) {
		this.list.push({ key: key, value: value });
		return value;
	}

	putAll(objects){
		Object.keys(objects).map((key) => this.put(key, objects[key]));
	}


	getValue(key) {
		for (let i = 0; i < this.list.length; i++) {
			const item = this.list[i];
			if (item.key === key)
				return item.value;
		}

		return undefined;
	}

	getOrDefault(key, defaultValue) {
		return this.contains(key) ?
			defaultValue instanceof List && !(this.getValue(key) instanceof List)
				? new List([this.getValue(key)]) : this.getValue(key)
			: defaultValue;
	}

	size() {
		return this.list.length;
	}

	isEmpty() {
		return this.list.length === 0;
	}

	containsKey(o) {
		for (let i = 0; i < this.list.length; i++) {
			const item = this.list[i];
			if (item.key === o)
				return true;
		}
		return false;
	}

	contains(o) {
		return this.containsKey(o);
	}

	containsValue(o) {
		for (let i = 0; i < this.list.length; i++) {
			const item = this.list[i];
			if (item.value.contains(o))
				return true;
		}
		return false;
	}

	filter(callback){
		const list = new List();
		for (let i = 0; i < this.list.length; i++) {
			const item = this.list[i];
			if (callback(item.key) || callback(item.value))
				return list.add(item);
		}

		return list;
	}

	remove(o) {
		if(this.size() === 0) return;
		if(o){
			for (let i = 0; i < this.list.length; i++) {
				const item = this.list[i];
				if (item.key === o){
					return this.list.splice(i, 1);
				}
			}
		} else {
			const last = this.getLast().value;
			this.clear();
			return last;
		}

	}

	keys(){
		const list = new List();
		this.list.map((kv) => list.add(kv.key));
		return list;
	}

	keySet(){
		return new ConcurrentIterator(this.list);
	}

	getFirst(){
		return this.list[0].value;
	}

	getLast(){
		return this.list[this.size() - 1];
	}

	/**
	 * Removes all of the elements from this set.
	 * The set will be empty after this call returns.
	 */
	clear() {
		this.list = [];
	}
}

