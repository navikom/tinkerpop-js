import { mixin } from '../../../../util';
import { SideEffectStep } from './SideEffectStep';
import LambdaHolder from '../LambdaHolder';
//import Operator from '../../Operator';

/**
 * LambdaSideEffectStep
 * @param traversal
 * @param consumer
 * @constructor
 */
function LambdaSideEffectStep(traversal, consumer) {
	SideEffectStep.call(this, traversal);
	this.consumer = consumer;
}

LambdaSideEffectStep.prototype = {
	constructor: LambdaSideEffectStep,
	sideEffect(traverser) {
		this.consumer(traverser);
	}
};

mixin(LambdaSideEffectStep, SideEffectStep.prototype, LambdaHolder.prototype);

export { LambdaSideEffectStep };
