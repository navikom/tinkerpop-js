import { List } from './List';
import { Iterator } from './Iterator';

class HashMap {

	constructor(list) {
		this.list = list || [];
		this._limit = 8;
		this._count = 0;
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
		return this._count;
	}

	/**
	 * Returns <tt>true</tt> if this set contains no elements.
	 *
	 * @return <tt>true</tt> if this set contains no elements
	 */
	isEmpty() {
		return this._count === 0;
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
		return this.retrieve(key);
	}

	get(key){
		return this.getValue(key);
	}

	value(key) {
		return this.getValue(key);
	}

	values() {
		return this._table.slice();
	}

	put(key, value) {
		this.insert(key, value);
	}

	insert(key, value) {
		const index = HashMap.hashCode(key, this._limit);

		//retrieve the bucket at this particular index in our storage, if one exists
		//[[ [k,v], [k,v], [k,v] ] , [ [k,v], [k,v] ]  [ [k,v] ] ]
		let bucket = this.list[index];
		if (!bucket) {
			bucket = [];
			this.list[index] = bucket;
		}
		let override = false;
		//now iterate through our bucket to see if there are any conflicting
		//key value pairs within our bucket. If there are any, override them.
		for (let i = 0; i < bucket.length; i++) {
			var tuple = bucket[i];
			if ((tuple.key.equals && tuple.key.equals(key)) || tuple.key === key) {
				//overide value stored at this key
				tuple.value = value;
				override = true;
			}
		}

		if (!override) {
			//create a new tuple in our bucket
			//note that this could either be the new empty bucket we created above
			//or a bucket with other tupules with keys that are different than
			//the key of the tuple we are inserting. These tupules are in the same
			//bucket because their keys all equate to the same numeric index when
			//passing through our hash function.
			this._table.push(value);
			bucket.splice(0, 0, {key, value});
			this._count++;
			//now that we've added our new key/val pair to our storage
			//let's check to see if we need to resize our storage
			if (this._count > this._limit * 0.75) {
				this._resize(this._limit * 2);
			}
		}
		//console.log('insert', index, this)
		return this;
	};

	_resize(newLimit) {
		var oldStorage = this._table.slice();

		this._limit = newLimit;
		this._count = 0;
		this.list = [];
		this._table = [];

		//oldStorage.map((bucket) => {
		//	for (let i = 0; i < bucket.length; i++) {
		//		var tuple = bucket[i];
		//		this.insert(tuple.key, tuple.value);
		//	}
		//});
		// todo temp solution this.insert(e.id(), e)
		oldStorage.map((e) =>
			this.insert(typeof e === 'string' ? e : typeof e.id === 'function' ? e.id() : e.id, e)
		);
	};

	retrieve(key) {
		const index = HashMap.hashCode(key, this._limit);
		const bucket = this.list[index];

		if (!bucket) {
			return null;
		}

		for (let i = 0; i < bucket.length; i++) {
			const tuple = bucket[i];
			if ((tuple.key.equals && tuple.key.equals(key)) || tuple.key === key) {
				return tuple.value;
			}
		}

		return null;
	};

	remove(key) {
		const index = HashMap.hashCode(key, this._limit);
		const bucket = this.list[index];
		if (!bucket) {
			return null;
		}
		//iterate over the bucket
		for (let i = 0; i < bucket.length; i++) {
			const tuple = bucket[i];
			//check to see if key is inside bucket
			if ((tuple.key.equals && tuple.key.equals(key)) || tuple.key === key) {
				//if it is, get rid of this tuple
				this._table.splice(this._table.indexOf(tuple.value), 1);
				bucket.splice(i, 1);
				this._count--;
				if (this._count < this._limit * 0.25) {
					this._resize(this._limit / 2);
				}
				return tuple.value;
			}
		}
	};


	static hashCode(object, max) {
		const s = object.hashCode ? object.hashCode() : object;
		return s.toString().split("").reduce((a,b) => {
			a = ((a<<5) - a) + b.charCodeAt(0);
			return (a & a) % max;
		}, 0);
	}

	/**
	 * Removes all of the elements from this set.
	 * The set will be empty after this call returns.
	 */
	clear() {
		this.list = [];
		this._table = [];
	}
}

export { HashMap }