import { mixin, List } from '../../../../util';
import { MapStep } from './MapStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * CountLocalStep
 * @param traversal
 * @constructor
 */
function CountLocalStep(traversal) {
	MapStep.call(this, traversal);
}

CountLocalStep.prototype = {
	constructor: CountLocalStep,
	map(traverser) {
		const item = traverser.get();
		return isNaN(item) ? item.size() : 1;
	},

	getRequirements() {
		return new List([TraverserRequirement.OBJECT]);
	}
};

mixin(CountLocalStep, MapStep.prototype);

export { CountLocalStep };

