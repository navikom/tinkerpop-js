import { mixin } from '../../../../util';
import MemoryComputeKey from '../../../computer/MemoryComputeKey';
import Operator from '../../Operator';
import AbstractStep from './../util/AbstractStep';
import Barrier from '../Barrier';

/**
 * SupplyingBarrierStep
 * @param traversal
 * @constructor
 */
function SupplyingBarrierStep(traversal) {
	AbstractStep.call(this, traversal);
	this._done = false;
}

SupplyingBarrierStep.prototype = Object.create(AbstractStep.prototype);
SupplyingBarrierStep.prototype.constructor = SupplyingBarrierStep;

mixin(SupplyingBarrierStep, Barrier.prototype);

SupplyingBarrierStep.prototype.addStarts = function(starts) {
	if (starts.hasNext()) {
		this._done = false;
		AbstractStep.prototype.addStarts.call(this, starts);
	}
};

SupplyingBarrierStep.prototype.addStart = function(start) {
	this._done = false;
	AbstractStep.prototype.addStart.call(this, start);
};

SupplyingBarrierStep.prototype.reset = function() {
	AbstractStep.prototype.reset.call(this);
	this._done = false;
};

SupplyingBarrierStep.prototype.processNextStart = function() {
	if (this._done)
		throw ("No Such Element Exception");
	this.processAllStarts();
	this._done = true;
	return this.getTraversal().asAdmin().getTraverserGenerator().generate(this.supply(), this, 1);
};

SupplyingBarrierStep.prototype.clone = function() {
	const clone = AbstractStep.prototype.clone.call(this);
	clone._done = false;
	return clone;
};

SupplyingBarrierStep.prototype.processAllStarts = function() {
	while (this.starts.hasNext())
		this.starts.next();
};

SupplyingBarrierStep.prototype.hasNextBarrier = function() {
	return !this._done;
};

SupplyingBarrierStep.prototype.nextBarrier = function() {
	this.processAllStarts();
	this._done = true;
	return true;
};

SupplyingBarrierStep.prototype.addBarrier = function(barrier) {
	this._done = false;
};

SupplyingBarrierStep.prototype.done = function() {
	this._done = true;
};

SupplyingBarrierStep.prototype.getMemoryComputeKey = function() {
	return MemoryComputeKey.of(this.getId(), Operator.and, false, true);
};

export default SupplyingBarrierStep;


