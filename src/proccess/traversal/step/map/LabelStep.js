import { List } from '../../../../util';
import { MapStep } from './MapStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * LabelStep
 * @param traversal
 * @constructor
 */
function LabelStep(traversal) {
	MapStep.call(this, traversal);
}

LabelStep.prototype = Object.create(MapStep.prototype);
LabelStep.prototype.constructor = LabelStep;

LabelStep.prototype.map = function(traverser) {
	return traverser.get().label();
};

LabelStep.prototype.getRequirements = function() {
	return new List([TraverserRequirement.OBJECT]);
};

export { LabelStep };

