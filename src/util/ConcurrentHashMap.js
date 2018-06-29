import { IteratorMap, ConcurrentIterator } from './Iterator';
import { List } from './List';
import { HashMap } from './HashMap';

/**
 * Map
 */
export class ConcurrentHashMap extends HashMap{

	constructor(list) {
		super(list)
	}

	putAll(objects){
		Object.keys(objects).map((key) => this.put(key, objects[key]));
	}

	getOrDefault(key, defaultValue) {
		const value = this.getValue(key);
		if(value === null) return defaultValue;
		return defaultValue instanceof List && !(value instanceof List)
				? new List([value]) : value;
	}

	size() {
		return this._count;
	}

	isEmpty() {
		return this.size() === 0;
	}

	containsKey(o) {
		return this.getValue(o) !== null;
	}

	contains(o) {
		return this.containsKey(o);
	}

	keys(){
		const list = new List();
		this.list.map((bucket) => {
			bucket.map((kv) => list.add(kv.key));
		});
		return list;
	}

	keySet(){
		return new ConcurrentIterator(this._table);
	}

	getFirst(){
		return this._table[0].value;
	}

	getLast(){
		return this._table[this.size() - 1];
	}

}

