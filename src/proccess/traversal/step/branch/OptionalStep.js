import { mixin, List } from '../../../../util';
import AbstractStep from '../util/AbstractStep';
import TraversalParent from '../TraversalParent';

/**
 * OptionalStep
 * @param traversal
 * @param optionalTraversal
 * @constructor
 */
function OptionalStep(traversal, optionalTraversal) {
	AbstractStep.call(this, traversal);
	this.optionalTraversal = optionalTraversal;
}
OptionalStep.prototype = Object.create(AbstractStep.prototype);
OptionalStep.prototype.constructor = OptionalStep;

mixin(OptionalStep, TraversalParent.prototype);

OptionalStep.prototype.processNextStart = function() {
	if (this.optionalTraversal.hasNext())
		return this.optionalTraversal.nextTraverser();
	else {
		const traverser = this.starts.next();
		this.optionalTraversal.addStart(traverser.split());
		if (this.optionalTraversal.hasNext())
			return this.optionalTraversal.nextTraverser();
		else
			return traverser;
	}
};

OptionalStep.prototype.getLocalChildren = function() {
	return new List([this.optionalTraversal]);
};

OptionalStep.prototype.clone = function() {
	const clone = AbstractStep.prototype.clone.call(this);
	clone.optionalTraversal = this.optionalTraversal.clone();
	return clone;
};

OptionalStep.prototype.setTraversal = function(parentTraversal) {
	AbstractStep.prototype.setTraversal.call(this, parentTraversal);
	this.integrateChild(this.optionalTraversal);
};

OptionalStep.prototype.getRequirements = function() {
	return this.optionalTraversal.getTraverserRequirements();
};

OptionalStep.prototype.reset = function() {
	AbstractStep.prototype.reset.call(this);
	this.optionalTraversal.reset();
};

export { OptionalStep };

