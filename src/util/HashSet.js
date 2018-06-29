import { List } from './List';
import { Iterator } from './Iterator';

export class HashSet {

	constructor(list) {
		this.list = list || [];
		this._limit = 8;
	}

	/**
	 * Returns an iterator over the elements in this set.  The elements
	 * are returned in no particular order.
	 *
	 * @return an Iterator over the elements in this set
	 * @see ConcurrentModificationException
	 */
	iterator() {
		return new Iterator(this.list);
	}

	/**
	 * Returns the number of elements in this set (its cardinality).
	 *
	 * @return the number of elements in this set (its cardinality)
	 */
	size() {
		return this.list.length;
	}

	/**
	 * Returns <tt>true</tt> if this set contains no elements.
	 *
	 * @return <tt>true</tt> if this set contains no elements
	 */
	isEmpty() {
		return this.list.length === 0;
	}

	/**
	 * Returns <tt>true</tt> if this set contains the specified element.
	 * More formally, returns <tt>true</tt> if and only if this set
	 * contains an element <tt>e</tt> such that
	 * <tt>(o==null&nbsp;?&nbsp;e==null&nbsp;:&nbsp;o.equals(e))</tt>.
	 *
	 * @param o element whose presence in this set is to be tested
	 * @return <tt>true</tt> if this set contains the specified element
	 */
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

	filter(callback) {
		const list = new List();
		for (let i = 0; i < this.list.length; i++) {
			const item = this.list[i];
			if (callback(item.key) || callback(item.value))
				return list.add(item);
		}

		return list;
	}

	getValue(key) {
		for (let i = 0; i < this.list.length; i++) {
			const item = this.list[i];
			if ((item.key.equals && item.key.equals(key)) || item.key === key){
				return item.value;
			}
		}
		return undefined;
	}

	value(key) {
		return this.getValue(key);
	}

	values() {
		const list = new List();
		this.list.map((entry) => list.add(entry.value))
		return list;
	}

	getOrDefault(key, defaultValue) {
		return this.contains(key) ?
			defaultValue instanceof List && !(this.getValue(key) instanceof List)
				? new List([this.getValue(key)]) : this.getValue(key)
			: defaultValue;
	}

	forEach(callback) {
		const iterator = this.iterator();
		while (iterator.hasNext()) {
			callback(iterator);
			iterator.next();
		}
	}

	put(key, value) {
		this.list.splice(0, 0, { key: key, value: value });
	}

	putStack(key, value) {
		this.list.push({ key: key, value: value });
	}

	/**
	 * Removes the specified element from this set if it is present.
	 * More formally, removes an element <tt>e</tt> such that
	 * <tt>(o==null&nbsp;?&nbsp;e==null&nbsp;:&nbsp;o.equals(e))</tt>,
	 * if this set contains such an element.  Returns <tt>true</tt> if
	 * this set contained the element (or equivalently, if this set
	 * changed as a result of the call).  (This set will not contain the
	 * element once the call returns.)
	 *
	 * @param o object to be removed from this set, if present
	 * @return <tt>true</tt> if the set contained the specified element
	 */
	remove(o) {
		if (this.size() === 0) return;
		if (o) {
			for (let i = 0; i < this.list.length; i++) {
				const item = this.list[i];
				if (item.key === o) {
					return this.list.splice(i, 1);
				}
			}
		} else {
			const last = this.getLast().value;
			this.clear();
			return last;
		}

	}

	getFirst() {
		return this.list[0].value;
	}

	getLast() {
		return this.list[this.size() - 1];
	}

	static hashCode(object, max) {
		const str = object.hashCode ? object.hashCode() : object;
		var hash = 0;
		for (var i = 0; i < str.length; i++) {
			var letter = str[i];
			hash = (hash << 5) + letter.charCodeAt(0);
			hash = (hash & hash) % max;
		}
		return hash;
	}

	/**
	 * Removes all of the elements from this set.
	 * The set will be empty after this call returns.
	 */
	clear() {
		this.list = [];
	}
}
