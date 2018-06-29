import { List, NumberHelper } from '../../../../util';
import { MapStep } from './MapStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * MeanLocalStep
 * @param traversal
 * @constructor
 */
function MeanLocalStep(traversal) {
	MapStep.call(this, traversal);
}

MeanLocalStep.prototype = Object.create(MapStep.prototype);
MeanLocalStep.prototype.constructor = MeanLocalStep;

MeanLocalStep.prototype.map = function(traverser) {
	const iterator = traverser.get().iterator();
	if (iterator.hasNext()) {
		let counter = 1;
		let result = iterator.next();
		while (iterator.hasNext()) {
			result = NumberHelper.add(result, iterator.next());
			counter++;
		}
		return NumberHelper.div(result, counter, true);
	} else {
		return undefined;
	}
};

MeanLocalStep.prototype.getRequirements = function() {
	return new List([TraverserRequirement.OBJECT]);
};

export { MeanLocalStep };
