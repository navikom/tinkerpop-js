import { mixin, List, ArrayUtils, EmptyIterator } from '../../../../util';
import TraversalParent from '../TraversalParent';
import { FlatMapStep } from './FlatMapStep';

/**
 * CoalesceStep
 * @param traversal
 * @param coalesceTraversals
 * @constructor
 */
function CoalesceStep(traversal, ...coalesceTraversals) {
	FlatMapStep.call(this, traversal);
	this.coalesceTraversals = new List(ArrayUtils.checkArray(coalesceTraversals));

	for (let i = 0; i < this.coalesceTraversals.size(); i++) {
		const conjunctionTraversal = this.coalesceTraversals.get(i);
		this.integrateChild(conjunctionTraversal);
	}
}
CoalesceStep.prototype = Object.create(FlatMapStep.prototype);
CoalesceStep.prototype.constructor = CoalesceStep;

CoalesceStep.prototype.flatMap = function(traverser) {
	for (let i = 0; i < this.coalesceTraversals.size(); i++) {
		const coalesceTraversal = this.coalesceTraversals.get(i);
		coalesceTraversal.reset();
		coalesceTraversal.addStart(traverser.split());
		if (coalesceTraversal.hasNext())
			return coalesceTraversal;
	}
	return EmptyIterator.instance();
};

CoalesceStep.prototype.getRequirements = function() {
	return this.getSelfAndChildRequirements();
};

CoalesceStep.prototype.getLocalChildren = function() {
	return this.coalesceTraversals.clone();
};

CoalesceStep.prototype.clone = function() {
	const clone = FlatMapStep.prototype.clone.call(this);
	clone.coalesceTraversals = new List();
	for (let i = 0; i < this.coalesceTraversals.size(); i++) {
		const conjunctionTraversal = this.coalesceTraversals.get(i);
		clone.coalesceTraversals.add(conjunctionTraversal.clone());
	}
	return clone;
};

CoalesceStep.prototype.setTraversal = function(parentTraversal) {
	FlatMapStep.prototype.setTraversal.call(this, parentTraversal);
	for (let i = 0; i < this.coalesceTraversals.size(); i++) {
		const conjunctionTraversal = this.coalesceTraversals.get(i);
		this.integrateChild(conjunctionTraversal);
	}
};

mixin(CoalesceStep, TraversalParent.prototype);

export { CoalesceStep };
