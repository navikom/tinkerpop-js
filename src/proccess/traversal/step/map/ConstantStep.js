import { List } from '../../../../util';
import { MapStep } from './MapStep';

/**
 * ConstantStep
 * @param traversal
 * @param constant
 * @constructor
 */
function ConstantStep(traversal, constant) {
	MapStep.call(this, traversal);
	this.constant = constant;
}

ConstantStep.prototype = Object.create(MapStep.prototype);
ConstantStep.prototype.constructor = ConstantStep;

ConstantStep.prototype.map = function(traverser) {
	return this.constant;
};

export { ConstantStep };
