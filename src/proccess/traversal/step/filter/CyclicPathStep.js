import { mixin, List } from '../../../../util';
import { FilterStep } from './FilterStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';
import StringFactory from '../../../../structure/util/StringFactory';

/**
 * CyclicPathStep
 * @param traversal
 * @constructor
 */
function CyclicPathStep(traversal) {
	FilterStep.call(this, traversal);
}

CyclicPathStep.prototype = {
	constructor: CyclicPathStep,
	filter(traverser) {
		return !traverser.path().isSimple();
	},

	getRequirements() {
		return new List([TraverserRequirement.PATH]);
	},

	toString() {
		return StringFactory.stepString(this);
	}
};

mixin(CyclicPathStep, FilterStep.prototype);

export { CyclicPathStep };
