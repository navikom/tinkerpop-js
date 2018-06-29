import { mixin, List } from '../../../../util';
import { MapStep } from './MapStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * DedupLocalStep
 * @param traversal
 * @constructor
 */
function DedupLocalStep(traversal) {
	MapStep.call(this, traversal);
}

DedupLocalStep.prototype = {
	constructor: DedupLocalStep,
	map(traverser) {
		const result = new List([traverser]);
		return result;
	},

	getRequirements() {
		return new List([TraverserRequirement.OBJECT]);
	}
};

mixin(DedupLocalStep, MapStep.prototype);

export { DedupLocalStep };
