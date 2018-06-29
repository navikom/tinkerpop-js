import ProjectedTraverser from '../../proccess/traversal/traverser/ProjectedTraverser';
import Order from '../../proccess/traversal/Order';

/**
 * MultiComparator
 */
export default class MultiComparator {
	constructor(comparators) {
		this.startIndex = 0;
		this.comparators = comparators;
		this._isShuffle = !this.comparators.isEmpty() && Order.shuffle === this.comparators.get(this.comparators.size() - 1);
		for (let i = 0; i < this.comparators.size(); i++) {
			if (this.comparators.get(i) === Order.shuffle)
				this.startIndex = i + 1;
		}
	}

	compare(objectA, objectB) {
		if (this.comparators.isEmpty()) {
			return Order.incr.compare(objectA.baseTraverser.get(), objectB.baseTraverser.get());
		} else {

			for (let i = this.startIndex; i < this.comparators.size(); i++) {

				const comparison = this.comparators.get(i).compare(this.getObject(objectA, i), this.getObject(objectB, i));

				if (comparison !== 0)
					return comparison;
			}
			return 0;
		}
	}

	isShuffle() {
		return this._isShuffle;
	}

	getObject(object, index) {
		if (object instanceof ProjectedTraverser){
			return object.getProjections().get(index).get ?
				object.getProjections().get(index).get() : object.getProjections().get(index);
		}	else
			return object.get ? object.get() : object;
	}

}
