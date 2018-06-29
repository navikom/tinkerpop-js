import { mixin, List, Pair, Collections } from '../../../../util';
import ChainedComparator from '../../../../util/function/ChainedComparator';
import { MapStep } from './MapStep';
import TraversalParent from '../TraversalParent';
import ByModulating from '../../ByModulating';
import Order from '../../Order';
import IdentityTraversal from '../../lambda/IdentityTraversal';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * OrderLocalStep
 * @param traversal
 * @constructor
 */
function OrderLocalStep(traversal) {
	MapStep.call(this, traversal);
	this.comparators = new List();
	this.chainedComparator = null;
}
OrderLocalStep.prototype = {
	constructor: OrderLocalStep,
	map(traverser) {
		if (null === this.chainedComparator){
			this.chainedComparator = new ChainedComparator(false, this.comparators);
		}
		const start = traverser.get();

		if(start instanceof List)
			OrderLocalStep.sort(start, this.chainedComparator);
		return start;
	},

	addComparator(traversal, comparator) {
		this.comparators.add(new Pair(this.integrateChild(traversal), comparator));
	},

	modulateBy(traversal, comparator) {
		this.addComparator(traversal, comparator || Order.incr);
	},

	getComparators() {
		return this.comparators.isEmpty() ? new List([new Pair(new IdentityTraversal(), Order.incr)])
			: this.comparators;
	},

	getRequirements() {
		return this.getSelfAndChildRequirements(TraverserRequirement.OBJECT);
	},

	getLocalChildren() {
		return this.comparators.iterator().map((entry) => entry.getValue0());
	},

	clone() {
		const clone = MapStep.prototype.clone.call(this);
		clone.comparators = new List();
		for (let i = 0; i < this.comparators.size(); i++) {
			const comparator = this.comparators.value(i);
			clone.comparators.add(new Pair(comparator.getValue0().clone(), comparator.getValue1()));
		}
		return clone;
	},

	setTraversal(parentTraversal) {
		MapStep.prototype.setTraversal(parentTraversal);
		this.comparators.iterator().map((entry) => entry.getValue0())
			.forEach((entry) => TraversalParent.prototype.integrateChild.call(this, entry));
	},

};

mixin(OrderLocalStep, MapStep.prototype, ByModulating.prototype, TraversalParent.prototype);

/////////////

OrderLocalStep.sort = (collection, comparator) => {
	if (collection instanceof List) {
		if (comparator.isShuffle())
			Collections.shuffle(collection);
		else
			Collections.sort(collection, comparator);
		return collection;
	} else {
		//console.log('OrderLocalStep', collection)
		return OrderLocalStep.sort(new List(collection), comparator);
	}
};


export { OrderLocalStep };
