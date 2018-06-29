import { List } from '../../../../util';
import { MapStep } from './MapStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * IdStep
 * @param traversal
 * @constructor
 */
function IdStep(traversal) {
	MapStep.call(this, traversal);
}

IdStep.prototype = Object.create(MapStep.prototype);
IdStep.prototype.constructor = IdStep;

IdStep.prototype.map = function(traverser) {
	return traverser.get().id();
};

IdStep.prototype.getRequirements = function() {
	return new List([TraverserRequirement.OBJECT]);
};

export { IdStep };


