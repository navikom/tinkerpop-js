import { List } from './List';
import { Iterator } from './Iterator';

class ObjectQueueMap {

	constructor(objects) {
		this._objects = objects || new WeakMap();
		this._table = [];
	}

	/**
	 * Returns an iterator over the elements in this set.  The elements
	 * are returned in no particular order.
	 *
	 * @return an Iterator over the elements in this set
	 * @see ConcurrentModificationException
	 */
	iterator() {
		return this.values().iterator();
	}

	/**
	 * Returns the number of elements in this set (its cardinality).
	 *
	 * @return the number of elements in this set (its cardinality)
	 */
	size() {
		return this._table.length;
	}

	/**
	 * Returns <tt>true</tt> if this set contains no elements.
	 *
	 * @return <tt>true</tt> if this set contains no elements
	 */
	isEmpty() {
		return this.size() === 0;
	}

	filter(callback) {
		const list = new List();
		for (let i = 0; i < this._table.length; i++) {
			const item = this._table[i];
			if (callback(item))
				return list.add(item);
		}

		return list;
	}

	getValue(key) {
		key = typeof key === 'object' ? key : {key};
		return this._objects.get(key) || null;
	}

	value(key) {
		return this.getValue(key);
	}

	values() {
		return new List(this._table.slice());
	}

	contains(key){
		return this._objects.has(key);
	}

	put(key, value) {
		this._objects.set(key, value);

		const existing = this._table.indexOf(value);
		if(existing > -1)
			this._table[existing] = value;
		else
			this._table.push(value);
		return this;
	}

	remove(key, cursor) {
		const object = this._objects.get(key);
		this._objects.delete(key);
		this._table.splice(cursor, 1);
		return object;
	};

	/**
	 * Removes all of the elements from this set.
	 * The set will be empty after this call returns.
	 */
	clear() {
		this._objects = new WeakMap();
		this._table = [];
	}
}


export { ObjectQueueMap }
