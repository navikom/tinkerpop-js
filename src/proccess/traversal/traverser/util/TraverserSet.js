import { ObjectQueueMap, List, Collections } from '../../../../util';

const getKey = (traverser) => {
	return traverser.path() === undefined
		? typeof traverser.t === 'object' ? traverser.t : traverser
		: traverser;
};

/**
 * TraverserSet
 */
export default class TraverserSet {

	constructor() {
		this.map = new ObjectQueueMap();
	}

	getTraverser(traverser) {
		return this.map.getValue(traverser);
	}

	iterator() {
		return this.values().iterator();
	}

	values() {
		return this.map.values();
	}

	get(traverser) {
		const key = getKey(traverser);
		return this.map.get(key);
	}

	size() {
		return this.map.size();
	}

	bulkSize() {
		let bulk = 0;
		this.map.values().forEach((traverser) => bulk += traverser.bulk());
		return bulk;
	}

	isEmpty() {
		return this.map.isEmpty();
	}

	contains(traverser) {
		const key = getKey(traverser);
		return this.map.contains(key);
	}

	add(traverser) {
		const key = getKey(traverser);
		const existing = this.map.getValue(key);
		//console.log('add', this, traverser, traverser.get(), existing, traverser === existing,  existing === null);
		if (existing === null) {
			this.map.put(key, traverser);
			return true;
		}
		existing.merge(traverser);
		return false;
	}

	addAll(other) {
		other.values().forEach((traverser) => this.add(traverser));
	}

	offer(traverser) {
		return this.add(traverser);
	}

	remove(traverser) {  // pop, exception if empty
		if (traverser) {
			const key = getKey(traverser);
			return this.map.remove(key) !== null;
		}
		const iterator = this.map.values().iterator();
		if (!iterator.hasNext()) {
			throw ('No Such Element Exception');
		}
		const goal = iterator.next();
		const key = getKey(goal);
		const value = this.map.remove(key, iterator.cursor - 1);
		const next = value;
		return next;
	}

	poll() {  // pop, null if empty
		return this.map.isEmpty() ? null : this.remove();
	}

	element() { // peek, exception if empty
		return this.iterator().next();
	}

	peek() { // peek, null if empty
		return this.map.isEmpty() ? null : this.iterator().next();
	}

	clear() {
		this.map.clear();
	}

	sort(comparator) {
		const list = new List();
		this.map.values().iterator().forEachRemaining((entry) => list.add(entry));
		Collections.sort(list, comparator);
		this.map.clear();
		list.iterator().map((traverser) => this.map.put(getKey(traverser), traverser));
	}

	shuffle() {
		const list = new List();
		this.map.values().iterator().forEachRemaining((entry) => list.add(entry));
		Collections.shuffle(list);
		this.map.clear();
		list.iterator().map((traverser) => this.map.put(getKey(traverser), traverser));
	}

	clone() {
		const clone = Object.assign(Object.create(this), this);
		const iterator = this.map.iterator();
		clone.helperList = new List();
		if (iterator.hasNext()) {
			const next = iterator.next();
			clone.helperList.add(next);
		}
		return clone;
	}

}
