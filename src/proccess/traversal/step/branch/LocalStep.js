import { mixin, List } from '../../../../util';
import StringFactory from '../../../../structure/util/StringFactory';
import AbstractStep from '../util/AbstractStep';
//import Parameters from '../util/Parameters';
//import { DetachedFactory } from '../../../../structure/util/detached'
import TraversalParent from '../TraversalParent';
//import T from '../../../../structure/T';
//import ListCallbackRegistry from '../util/event/ListCallbackRegistry';
//import Event from '../util/event/Event';

/**
 * LocalStep
 * @param traversal
 * @param localTraversal
 * @constructor
 */
function LocalStep(traversal, localTraversal) {
	AbstractStep.call(this, traversal);
	this.first = true;
	this.localTraversal = this.integrateChild(localTraversal);
}
LocalStep.prototype = Object.create(AbstractStep.prototype);
LocalStep.prototype.constructor = LocalStep;

mixin(LocalStep, TraversalParent.prototype);

LocalStep.prototype.getLocalChildren = function() {
	return new List([this.localTraversal]);
};

LocalStep.prototype.getRequirements = function() {
	return this.localTraversal.getTraverserRequirements();
};

LocalStep.prototype.processNextStart = function() {
	if (this.first) {
		this.first = false;
		this.localTraversal.addStart(this.starts.next());
	}
	while (true) {
		if (this.localTraversal.hasNext())
			return this.localTraversal.nextTraverser();
		else if (this.starts.hasNext()) {
			this.localTraversal.reset();
			this.localTraversal.addStart(this.starts.next());
		} else {
			throw ("No Such Element Exception");
		}
	}
};

LocalStep.prototype.reset = function() {
	AbstractStep.prototype.reset.call(this);
	this.first = true;
	this.localTraversal.reset();
};

LocalStep.prototype.clone = function() {
	const clone = AbstractStep.prototype.clone.call(this);
	clone.localTraversal = this.localTraversal.clone();
	clone.first = true;
	return clone;
};

LocalStep.prototype.setTraversal = function(parentTraversal) {
	AbstractStep.prototype.setTraversal.call(this, parentTraversal);
	this.integrateChild(this.localTraversal);
};

LocalStep.prototype.toString = function() {
	return StringFactory.stepString(this, this.localTraversal);
};

export { LocalStep };
