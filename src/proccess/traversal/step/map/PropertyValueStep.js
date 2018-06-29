import { List } from '../../../../util';
import { MapStep } from './MapStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * PropertyValueStep
 * @param traversal
 * @constructor
 */
function PropertyValueStep(traversal) {
	MapStep.call(this, traversal);
}

PropertyValueStep.prototype = Object.create(MapStep.prototype);
PropertyValueStep.prototype.constructor = PropertyValueStep;

PropertyValueStep.prototype.map = function(traverser) {
	return traverser.get().value();
};

PropertyValueStep.prototype.getRequirements = function() {
	return new List([TraverserRequirement.OBJECT]);
};

export { PropertyValueStep };
