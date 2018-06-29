import { mixin, List } from '../../../../util';
import { FilterStep } from './FilterStep';

/**
 * LambdaFilterStep
 * @param traversal
 * @param predicate
 * @constructor
 */
function LambdaFilterStep(traversal, predicate) {
	FilterStep.call(this, traversal);
	this.predicate = predicate;
}

LambdaFilterStep.prototype = {
	constructor: LambdaFilterStep,


	getPredicate() {
		return this.predicate;
	},

	filter(traverser) {
		return this.predicate.test(traverser);
	},
};

mixin(LambdaFilterStep, FilterStep.prototype);

export { LambdaFilterStep };