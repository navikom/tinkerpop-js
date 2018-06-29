import { List, Collections, ArrayUtils } from '../../../util';

/**
 * TraversalRing
 */
export default class TraversalRing {

	constructor(...traversals) {
		this.traversals = new List();
		this.currentTraversal = -1;
		traversals = ArrayUtils.checkArray(traversals);
		Collections.addAll(this.traversals, traversals);
	}

	next() {
		if (this.traversals.isEmpty()) {
			return null;
		} else {
			this.currentTraversal = (this.currentTraversal + 1) % this.traversals.size();
			return this.traversals.get(this.currentTraversal);
		}
	}

	isEmpty() {
		return this.traversals.isEmpty();
	}

	reset() {
		this.currentTraversal = -1;
	}

	size() {
		return this.traversals.size();
	}

	addTraversal(traversal) {
		this.traversals.add(traversal);
	}

	getTraversals() {
		return this.traversals;
	}

	clone() {
		try {
			const clone = Object.assign(Object.create(this), this);
			clone.traversals = new List();
			for (let i = 0; i < this.traversals.size(); i++) {
				const traversal = this.traversals.get(i);
				clone.addTraversal(traversal.clone());
			}
			return clone;
		} catch (e) {
			throw (e);
		}
	}

	toString() {
		return this.traversals.toString();
	}
}
