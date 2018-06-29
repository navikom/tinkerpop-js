import { mixin } from '../../../../util';
import CollectingBarrierStep from './../util/CollectingBarrierStep';
import Barrier from '../Barrier';

/**
 * LambdaCollectingBarrierStep
 * @param traversal
 * @param barrierConsumer
 * @param maxBarrierSize
 * @constructor
 */
function LambdaCollectingBarrierStep(traversal, barrierConsumer, maxBarrierSize) {
	CollectingBarrierStep.call(this, traversal, maxBarrierSize);
	this._barrierConsumer = barrierConsumer;
}
LambdaCollectingBarrierStep.prototype = Object.create(CollectingBarrierStep.prototype);
LambdaCollectingBarrierStep.prototype.constructor = LambdaCollectingBarrierStep;
LambdaCollectingBarrierStep.prototype.barrierConsumer = function(traverserSet) {
	this._barrierConsumer(traverserSet);
};

mixin(LambdaCollectingBarrierStep, Barrier.prototype);

export { LambdaCollectingBarrierStep };

