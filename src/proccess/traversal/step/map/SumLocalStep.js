import { List, NumberHelper } from '../../../../util';
import { MapStep } from './MapStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * SumLocalStep
 * @param traversal
 * @constructor
 */
function SumLocalStep(traversal) {
	MapStep.call(this, traversal);
}

SumLocalStep.prototype = Object.create(MapStep.prototype);
SumLocalStep.prototype.constructor = SumLocalStep;

SumLocalStep.prototype.map = function(traverser) {
	let result;
	const iterator = traverser.get().iterator();
	if (iterator.hasNext()) {
		result = iterator.next();
		while (iterator.hasNext()) {
			result = NumberHelper.add(result, iterator.next());
		}
	} else {
		result = 0;
	}
	return result;
};

SumLocalStep.prototype.getRequirements = function() {
	return new List([TraverserRequirement.OBJECT]);
};

export { SumLocalStep };
