import { mixin, List } from '../../../../util';
import AbstractStep from '../util/AbstractStep';
import TraverserSet from '../../traverser/util/TraverserSet';
import TraverserRequirement from '../../traverser/TraverserRequirement';
import Barrier from '../Barrier';
import StringFactory from '../../../../structure/util/StringFactory';

/**
 * NoOpBarrierStep
 * @param traversal
 * @param maxBarrierSize
 * @constructor
 */
function NoOpBarrierStep(traversal, maxBarrierSize) {
	AbstractStep.call(this, traversal);

	this.barrier = new TraverserSet();
	this.maxBarrierSize = maxBarrierSize;

}

NoOpBarrierStep.prototype = {
	constructor: NoOpBarrierStep,

	processNextStart() {
		if (this.barrier.isEmpty())
			this.processAllStarts();
		//console.log('processNextStart', this, this.barrier);
		const last = this.barrier.remove();
		//console.log('processNextStart2', this.barrier, last);
		return last;
	},

	getRequirements() {
		return new List([TraverserRequirement.BULK]);
	},

	processAllStarts() {
		while (this.starts.hasNext() && (this.maxBarrierSize === 0x7fffffff || this.barrier.size() < this.maxBarrierSize)) {
			const traverser = this.starts.next();
			traverser.setStepId(this.getNextStep().getId()); // when barrier is reloaded, the traversers should be at the next step
			//console.log('NoOpBarrierStep2', this.barrier, this.barrier.size(), traverser.get())
			this.barrier.add(traverser);

		}
	},

	hasNextBarrier() {
		this.processAllStarts();
		return !this.barrier.isEmpty();
	},

	nextBarrier() {
		this.processAllStarts();
		if (this.barrier.isEmpty())
			throw ("No Such Element Exception");
		else {
			const temp = this.barrier;
			this.barrier = new TraverserSet();
			return temp;
		}
	},

	addBarrier(barrier) {
		this.barrier.addAll(barrier);
	},

	reset() {
		AbstractStep.prototype.reset.call(this);
		this.barrier.clear();
	},

	toString() {
		return StringFactory.stepString(this, this.maxBarrierSize === Number.MAX_VALUE ? null : this.maxBarrierSize);
	}
};
mixin(NoOpBarrierStep, AbstractStep.prototype, Barrier.prototype);

export { NoOpBarrierStep };
