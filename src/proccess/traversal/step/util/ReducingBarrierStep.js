import { mixin } from '../../../../util';
import AbstractStep from './../util/AbstractStep';
import Barrier from '../Barrier';
import Generating from '../Generating';
import MemoryComputeKey from '../../../computer/MemoryComputeKey';

/**
 * ReducingBarrierStep
 * @param traversal
 * @constructor
 */
function ReducingBarrierStep(traversal) {
	AbstractStep.call(this, traversal);
	this.hasProcessedOnce = false;
	this._seed = null;

}

ReducingBarrierStep.prototype = Object.create(AbstractStep.prototype);
ReducingBarrierStep.prototype.constructor = ReducingBarrierStep;

mixin(ReducingBarrierStep, Barrier.prototype, Generating.prototype);

ReducingBarrierStep.prototype.setSeedSupplier = function(seedSupplier) {
	this.seedSupplier = seedSupplier;
};

ReducingBarrierStep.prototype.getSeedSupplier = function() {
	return this.seedSupplier;
};

ReducingBarrierStep.prototype.projectTraverser = function(traverser) {
	throw ("Must be reloaded");
};

ReducingBarrierStep.prototype.setReducingBiOperator = function(reducingBiOperator) {
	this.reducingBiOperator = reducingBiOperator;
};

ReducingBarrierStep.prototype.getBiOperator = function() {
	return this.reducingBiOperator;
};

ReducingBarrierStep.prototype.reset = function() {
	AbstractStep.prototype.reset.call(this);
	this.hasProcessedOnce = false;
	this._seed = null;
};

ReducingBarrierStep.prototype.done = function() {
	this.hasProcessedOnce = true;
	this._seed = null;
};

ReducingBarrierStep.prototype.processAllStarts = function() {
	if (this.hasProcessedOnce && !this.starts.hasNext())
		return;

	this.hasProcessedOnce = true;
	if (!this._seed) this._seed = this.seedSupplier.get();
	//console.log('processAllStarts', this.reducingBiOperator, this._seed, this.starts);
	while (this.starts.hasNext()) {
		//console.log('processAllStarts2', this._seed, this.seedSupplier)
		this._seed = this.reducingBiOperator.apply(this._seed, this.projectTraverser(this.starts.next()));
	}
};

ReducingBarrierStep.prototype.hasNextBarrier = function() {
	this.processAllStarts();
	return this._seed !== undefined;
};

ReducingBarrierStep.prototype.nextBarrier = function() {
	if (!this.hasNextBarrier())
		throw ("No Such Element Exception");
	else {
		const temp = this._seed;
		this._seed = null;
		return temp;
	}
};

ReducingBarrierStep.prototype.addBarrier = function(barrier) {
	this._seed = !this._seed ?
		barrier :
		this.reducingBiOperator.apply(this._seed, barrier);
};

ReducingBarrierStep.prototype.processNextStart = function() {
	this.processAllStarts();
	if (this._seed === null)
		throw ("No Such Element Exception");

	const traverser = this.getTraversal().getTraverserGenerator().generate(this.generateFinalResult(this._seed), this, 1);
	//console.log('processNextStart', traverser, this._seed)
	this._seed = null;
	return traverser;
};

ReducingBarrierStep.prototype.clone = function() {
	const clone = AbstractStep.prototype.clone.call(this);
	clone.hasProcessedOnce = false;
	clone.seed = null;
	return clone;
};

ReducingBarrierStep.prototype.getMemoryComputeKey = function() {
	return MemoryComputeKey.of(this.getId(), this.getBiOperator(), false, true);
};

export default ReducingBarrierStep;

