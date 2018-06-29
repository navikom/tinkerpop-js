import { List } from '../../../../util';
import { MapStep } from './MapStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * PropertyKeyStep
 * @param traversal
 * @constructor
 */
function PropertyKeyStep(traversal) {
	MapStep.call(this, traversal);
}

PropertyKeyStep.prototype = Object.create(MapStep.prototype);
PropertyKeyStep.prototype.constructor = PropertyKeyStep;

PropertyKeyStep.prototype.map = function(traverser) {
	return traverser.get().key();
};

PropertyKeyStep.prototype.getRequirements = function() {
	return new List([TraverserRequirement.OBJECT]);
};

export { PropertyKeyStep };
