import { mixin, List, NumberHelper } from '../../../../util';
import { MapStep } from './MapStep';
import LambdaHolder from '../LambdaHolder';

/**
 * LambdaMapStep
 * @param traversal
 * @param func
 * @constructor
 */
function LambdaMapStep(traversal, func) {
	MapStep.call(this, traversal);
	this.function = func;
}

LambdaMapStep.prototype = {
	constructor: LambdaMapStep,

	map(traverser) {
		return this.function(traverser);
	},

	getMapFunction() {
		return this.function;
	},
};

mixin(LambdaMapStep, MapStep.prototype, LambdaHolder.prototype);

export { LambdaMapStep };
