import { List } from './List';
import { Iterator } from './Iterator';

/**
 * Map
 */
export class ObjectMap {

	constructor(object) {
		this._weakMap = new WeakMap(object);
		this._keys = [];
		this._values = [];
		this._objectType = true;
	}

	put(key, value) {
		if(typeof key === 'object'){
			this._weakMap.set(key, value);
		} else {
			this._objectType = false;
			if(this._weakMap instanceof WeakMap) {
				this._weakMap = {};
			}
			this._weakMap[key] = value;
		}

		if(!this._keys.includes(key)){
			this._keys.push(key);
			this._values.push(value);
		} else {
			this._values[this._keys.indexOf(key)] = value;
		}
		return value;
	}

	putAll(objects){
		Object.keys(objects).map((key) => this.put(key, objects[key]));
	}

	getValue(key) {
		return this._objectType ? this._weakMap.get(key) : this._weakMap[key];
	}

	get(key){
		return this.getValue(key);
	}

	getOrDefault(key, defaultValue) {
		return this.contains(key) ?
			defaultValue instanceof List && !(this.getValue(key) instanceof List)
				? new List([this.getValue(key)]) : this.getValue(key)
			: defaultValue;
	}

	values(){
		return new List(this._values.slice());
	}

	keys(){
		return new List(this._keys.slice());
	}

	size() {
		return this._keys.length;
	}

	isEmpty() {
		return this.size() === 0;
	}

	remove(key) {
		const value = this.get(key);
		if(this._objectType){
			this._weakMap.delete(key);
		} else {
			delete this._weakMap[key];
		}

		this._keys.splice(this._keys.indexOf(key), 1);
		this._values.splice(this._values.indexOf(value), 1);
		return value;
	}

	forEach(callback) {
		this._keys.map((k) => callback(k, this.get(k)));
	}

	contains(key) {
		return !this.isEmpty() && ((this._objectType && this._weakMap.has(key) || (!this._objectType && key in this._weakMap)));
	}

	containsKey(key) {
		return this.contains(key);
	}

	getKeys(){
		return this._keys;
	}

	map(callback) {
		const list = new List();
		this._keys.map((k) => list.add(callback(k, this.get(k))));
		return list;
	}

	clone() {
		const clone = new ObjectMap();
		clone._keys = this._keys.slice();
		clone._values = this._values.slice();
		clone._keys.map((k) => {
			clone.put(k, this.get(k));
		});
		return clone;
	}

	toString(){
		const  it = this.keys().iterator();
		if (!it.hasNext())
			return "[]";
		const sb = [];
		sb.push('[');
		for (;;) {
			let e = it.next();
			sb.push(e === this ? "(this Collection)" : e);
			if (! it.hasNext()){
				sb.push(']');
				return sb.join('');
			}
			sb.push(', ');
		}
	}

	clear() {
		this._weakMap = new WeakMap();
		this._keys = [];
		this._values = [];
		this._objectType = true;
	}
}

