import { mixin, List } from '../../../../util';
import { FilterStep } from './FilterStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * SimplePathStep
 * @param traversal
 * @constructor
 */
function SimplePathStep(traversal) {
	FilterStep.call(this, traversal);
}

SimplePathStep.prototype = {
	constructor: SimplePathStep,
	filter(traverser) {
		return traverser.path().isSimple();
	},

	getRequirements() {
		return new List([TraverserRequirement.PATH]);
	}
};

mixin(SimplePathStep, FilterStep.prototype);

export { SimplePathStep };
