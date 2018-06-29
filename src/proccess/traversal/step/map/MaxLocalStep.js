import { mixin, List, NumberHelper } from '../../../../util';
import { MapStep } from './MapStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * MaxLocalStep
 * @param traversal
 * @constructor
 */
function MaxLocalStep(traversal) {
	MapStep.call(this, traversal);
}

MaxLocalStep.prototype = {
	constructor: MaxLocalStep,
	map(traverser) {
		let result;
		const iterator = traverser.get().iterator();
		if (iterator.hasNext()) {
			result = iterator.next();
			while (iterator.hasNext()) {
				result = NumberHelper.max(iterator.next(), result);
			}
		} else {
			result = undefined;
		}
		return result;
	},

	getRequirements() {
		return new List([TraverserRequirement.OBJECT]);
	}
};

mixin(MaxLocalStep, MapStep.prototype);

export { MaxLocalStep };