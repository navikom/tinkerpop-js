import { Pair, List } from '../';
import Order from '../../proccess/traversal/Order';
import TraversalUtil from '../../proccess/traversal/util/TraversalUtil';
import IdentityTraversal from '../../proccess/traversal/lambda/IdentityTraversal';

/**
 * ChainedComparator
 */
export default class ChainedComparator {

	constructor(traversers, comparators) {
		this.comparators = new List();
		this.traversers = traversers;
		if (comparators.isEmpty()) {
			this.comparators.add(new Pair(new IdentityTraversal(), Order.incr));
		} else {
			this.comparators.addAll(comparators);

			this._isShuffle = (this.comparators.get(this.comparators.size() - 1).getValue1()) === Order.shuffle;
			if (!this._isShuffle) {
				this.comparators.removeAll(
					this.comparators.iterator().filter((pair) => pair.getValue().getValue1() === Order.shuffle)
				);
			}
		}
	}

	isShuffle() {
		return this._isShuffle;
	}

	compare(objectA, objectB) {
		for (let i = 0; i < this.comparators.size(); i++) {
			const pair = this.comparators.value(i);
			const comparison = this.traversers ?
				pair.getValue1().compare(TraversalUtil.apply(objectA, pair.getValue0()), TraversalUtil.apply(objectB, pair.getValue0())) :
				pair.getValue1().compare(TraversalUtil.apply(objectA, pair.getValue0()), TraversalUtil.apply(objectB, pair.getValue0()));
			if (comparison !== 0)
				return comparison;
		}
		return 0;
	}

	clone() {
		const clone = Object.assign(Object.create(this), this);
		clone.comparators = new List();
		for (let i = 0; i < this.comparators.size(); i++) {
			const comparator = this.comparators.value(i);
			clone.comparators.add(new Pair(comparator.getValue0().clone(), comparator.getValue1()));
		}
		return clone;
	}
}
