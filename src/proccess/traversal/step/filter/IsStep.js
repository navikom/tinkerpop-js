import { mixin, List } from '../../../../util';
import { FilterStep } from './FilterStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * IsStep
 * @param traversal
 * @param predicate
 * @constructor
 */
function IsStep(traversal, predicate) {
	FilterStep.call(this, traversal);
	this.predicate = predicate;
}

IsStep.prototype = {
	constructor: IsStep,
	filter(traverser) {
		return this.predicate.test(traverser.get());
	},

	getPredicate() {
		return this.predicate;
	},

	clone() {
		const clone = FilterStep.prototype.clone.call(this);
		clone.predicate = this.predicate.clone();
		return clone;
	},

	getRequirements() {
		return new List([TraverserRequirement.OBJECT]);
	}

};

mixin(IsStep, FilterStep.prototype);

export { IsStep };

