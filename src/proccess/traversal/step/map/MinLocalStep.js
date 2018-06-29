import { List, NumberHelper } from '../../../../util';
import { MapStep } from './MapStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * MinLocalStep
 * @param traversal
 * @constructor
 */
function MinLocalStep(traversal) {
	MapStep.call(this, traversal);
}

MinLocalStep.prototype = Object.create(MapStep.prototype);
MinLocalStep.prototype.constructor = MinLocalStep;

MinLocalStep.prototype.map = function(traverser) {
	let result;
	const iterator = traverser.get().iterator();
	if (iterator.hasNext()) {
		result = iterator.next();
		while (iterator.hasNext()) {
			result = NumberHelper.min(iterator.next(), result);
		}
	} else {
		result = undefined;
	}
	return result;
};

MinLocalStep.prototype.getRequirements = function() {
	return new List([TraverserRequirement.OBJECT]);
};

export { MinLocalStep };
