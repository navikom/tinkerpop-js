import { mixin, List, Pair, isNull } from '../../../../util';
import MultiComparator from '../../../../util/function/MultiComparator';
import TraversalParent from '../TraversalParent';
import ByModulating from '../../ByModulating';
import CollectingBarrierStep from './../util/CollectingBarrierStep';
import TraversalUtil from '../../util/TraversalUtil';
import TraverserRequirement from '../../traverser/TraverserRequirement';
import Order from '../../Order';
import IdentityTraversal from '../../lambda/IdentityTraversal';
import ProjectedTraverser from '../../traverser/ProjectedTraverser';
import Barrier from '../Barrier';

/**
 * OrderGlobalStep
 * @param traversal
 * @constructor
 */
function OrderGlobalStep(traversal) {
	CollectingBarrierStep.call(this, traversal);

	this.comparators = new List();
	this.multiComparator = null;
	this.limit = Number.MAX_VALUE;
}

OrderGlobalStep.prototype = Object.create(CollectingBarrierStep.prototype);
OrderGlobalStep.prototype.constructor = OrderGlobalStep;

mixin(OrderGlobalStep, TraversalParent.prototype, ByModulating.prototype, Barrier.prototype);

OrderGlobalStep.prototype.barrierConsumer = function(traverserSet) {
	if (isNull(this.multiComparator)) this.multiComparator = this.createMultiComparator();
	//
	if (this.multiComparator.isShuffle())
		traverserSet.shuffle();
	else
		traverserSet.sort(this.multiComparator);

};

OrderGlobalStep.prototype.processAllStarts = function() {
	while (this.starts.hasNext()) {
		this.traverserSet.add(this.createProjectedTraverser(this.starts.next()));
	}
};

OrderGlobalStep.prototype.setLimit = function(limit) {
	this.limit = limit;
};

OrderGlobalStep.prototype.getLimit = function() {
	return this.limit;
};

OrderGlobalStep.prototype.addComparator = function(traversal, comparator) {
	this.comparators.add(new Pair(this.integrateChild(traversal), comparator));
};

OrderGlobalStep.prototype.modulateBy = function(traversal, comparator) {
	this.addComparator(traversal, comparator || Order.incr);
}

OrderGlobalStep.prototype.getComparators = function() {
	return this.comparators.isEmpty()
		? new List([new Pair(new IdentityTraversal(), Order.incr)]) : this.comparators;
};

OrderGlobalStep.prototype.getRequirements = function() {
	return this.getSelfAndChildRequirements(TraverserRequirement.BULK, TraverserRequirement.OBJECT);
};

OrderGlobalStep.prototype.getLocalChildren = function() {
	return this.comparators.iterator().map((entry) => entry.getValue0());
};

OrderGlobalStep.prototype.clone = function() {
	const clone = CollectingBarrierStep.prototype.clone.call(this);
	clone.comparators = new List();
	for (let i = 0; i < this.comparators.size(); i++) {
		const comparator = this.comparators.value(i);
		clone.comparators.add(new Pair(comparator.getValue0().clone(), comparator.getValue1()));
	}
	return clone;
};

OrderGlobalStep.prototype.setTraversal = function(parentTraversal) {
	CollectingBarrierStep.prototype.setTraversal(parentTraversal);
	this.comparators.iterator().map((entry) => entry.getValue0())
		.forEach((entry) => TraversalParent.prototype.integrateChild.call(this, entry));
};

OrderGlobalStep.prototype.getMemoryComputeKey = function() {
	//if (null == this.multiComparator) this.multiComparator = this.createMultiComparator();
	//return MemoryComputeKey.of(this.getId(), new OrderBiOperator<>(this.limit, this.multiComparator), false, true);
};

OrderGlobalStep.prototype.createProjectedTraverser = function(traverser) {

	const projections = new List();
	for (let i = 0; i < this.comparators.size(); i++) {
		const pair = this.comparators.value(i);
		projections.add(TraversalUtil.apply(traverser, pair.getValue0()));
	}

	return new ProjectedTraverser(traverser, projections);
};

OrderGlobalStep.prototype.createMultiComparator = function() {
	const list = new List();
	for (let i = 0; i < this.comparators.size(); i++) {
		const pair = this.comparators.value(i);
		list.add(pair.getValue1());
	}
	return new MultiComparator(list);
};

export { OrderGlobalStep };
