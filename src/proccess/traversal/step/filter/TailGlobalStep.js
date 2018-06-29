import { mixin, List, IteratorUtils } from '../../../../util';
import AbstractStep from './../util/AbstractStep';
import TraverserSet from '../../traverser/util/TraverserSet';
import TraverserRequirement from '../../traverser/TraverserRequirement';
import StringFactory from '../../../../structure/util/StringFactory';
import Barrier from '../Barrier';

/**
 * TailGlobalStep
 * @param traversal
 * @param limit
 * @constructor
 */
function TailGlobalStep(traversal, limit) {
	AbstractStep.call(this, traversal);
	this.tailBulk = 0;
	this.bypass = false;

	this.limit = limit;
	this.tail = [];
}
TailGlobalStep.prototype = Object.create(AbstractStep.prototype);
TailGlobalStep.prototype.constructor = TailGlobalStep;

mixin(TailGlobalStep, Barrier.prototype);

TailGlobalStep.prototype.setBypass = function(bypass) {
	this.bypass = bypass;
};

TailGlobalStep.prototype.processNextStart = function() {
	if (this.bypass) {
		// If we are bypassing this step, let everything through.
		return this.starts.next();
	} else {
		// Pull everything available before we start delivering from the tail buffer.
		if (this.starts.hasNext()) {
			this.starts.forEachRemaining((t) => this.addTail(t));
		}
		// Pull the oldest traverser from the tail buffer.
		const oldest = this.tail.shift();
		// Trim any excess from the oldest traverser.
		const excess = this.tailBulk - this.limit;
		if (excess > 0) {
			oldest.setBulk(oldest.bulk() - excess);
			// Account for the loss of excess in the tail buffer
			this.tailBulk -= excess;
		}
		// Account for the loss of bulk in the tail buffer as we emit the oldest traverser.
		this.tailBulk -= oldest.bulk();
		return oldest;
	}
};

TailGlobalStep.prototype.reset = function() {
	AbstractStep.prototype.reset.call(this);
	this.tail = [];
	this.tailBulk = 0;
};

TailGlobalStep.prototype.toString = function() {
	return StringFactory.stepString(this, this.limit);
};

TailGlobalStep.prototype.clone = function() {
	const clone = AbstractStep.prototype.clone();
	clone.tail = [];
	clone.tailBulk = 0;
	return clone;
};

TailGlobalStep.prototype.getRequirements = function() {
	return new List([TraverserRequirement.BULK]);
};

TailGlobalStep.prototype.addTail = function(start) {
	// Calculate the tail bulk including this new start.
	this.tailBulk += start.bulk();
	// Evict from the tail buffer until we have enough room.
	while (this.tail.length > 0) {
		const oldest = this.tail[0];
		const bulk = oldest.bulk();
		if (this.tailBulk - bulk < this.limit)
			break;
		this.tail.shift();
		this.tailBulk -= bulk;
	}
	this.tail.push(start);
};

TailGlobalStep.prototype.getMemoryComputeKey = function() {
	//return MemoryComputeKey.of(this.getId(), new RangeGlobalStep.RangeBiOperator<>(this.limit), false, true);
};

TailGlobalStep.prototype.processAllStarts = function() {
};

TailGlobalStep.prototype.hasNextBarrier = function() {
	return this.starts.hasNext();
};

TailGlobalStep.prototype.nextBarrier = function() {
	if (!this.starts.hasNext())
		throw ("No Such Element Exception");
	const barrier = new TraverserSet();
	while (this.starts.hasNext()) {
		barrier.add(this.starts.next());
	}
	return barrier;
};

TailGlobalStep.prototype.addBarrier = function(barrier) {
	barrier.iterator().forEachRemaining(traverser => {
		traverser.setSideEffects(this.getTraversal().getSideEffects());
		this.addStart(traverser);
	});
};

export { TailGlobalStep };
