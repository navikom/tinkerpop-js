import { mixin, List } from '../../../../util';
import TraversalUtil from '../../util/TraversalUtil';
import { FilterStep } from './FilterStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';
import TraverserSet from '../../traverser/util/TraverserSet';
import Barrier from '../Barrier';

/**
 * RangeGlobalStep
 * @param traversal
 * @param low
 * @param high
 * @constructor
 */
function RangeGlobalStep(traversal, low, high) {
	FilterStep.call(this, traversal);
	this.counter = 0;
	if (low !== -1 && high !== -1 && low > high) {
		throw ("Not a legal range: [" + low + ", " + high + ']');
	}
	this.low = low;
	this.high = high;
}

RangeGlobalStep.prototype = {
	constructor: RangeGlobalStep,
	filter(traverser) {
		if (this.bypass) return true;

		if (this.high !== -1 && this.counter >= this.high) {
			throw ("No Such Element Exception");
		}

		const avail = traverser.bulk();
		if (this.counter + avail <= this.low) {
			// Will not surpass the low w/ this traverser. Skip and filter the whole thing.
			this.counter = this.counter + avail;

			return false;
		}

		// Skip for the low and trim for the high. Both can happen at once.

		let toSkip = 0;
		if (this.counter < this.low) {
			toSkip = this.low - this.counter;
		}

		let toTrim = 0;
		if (this.high !== -1 && this.counter + avail >= this.high) {
			toTrim = this.counter + avail - this.high;
		}

		let toEmit = avail - toSkip - toTrim;
		this.counter = this.counter + toSkip + toEmit;
		traverser.setBulk(toEmit);

		return true;
	},


	getLowRange() {
		return this.low;
	},

	getHighRange() {
		return this.high;
	},

	clone() {
		const clone = FilterStep.prototype.clone.call(this);
		clone.counter = 0;
		return clone;
	},

	reset() {
		FilterStep.prototype.reset.call(this);
		this.counter = 0;
	},

	getRequirements() {
		return new List([TraverserRequirement.BULK]);
	},

	getMemoryComputeKey() {
		//return MemoryComputeKey.of(this.getId(), new RangeBiOperator<>(this.high), false, true);
	},

	setBypass(bypass) {
		this.bypass = bypass;
	},

	processAllStarts() {

	},

	hasNextBarrier() {
		return this.starts.hasNext();
	},

	nextBarrier() {
		if (!this.starts.hasNext())
			throw ("No Such Element Exception");
		const barrier = new TraverserSet();
		while (this.starts.hasNext()) {
			barrier.add(this.starts.next());
		}
		return barrier;
	},

	addBarrier(barrier) {
		barrier.iterator().forEachRemaining(traverser => {
			traverser.setSideEffects(this.getTraversal().getSideEffects());
			this.addStart(traverser);
		});
	}
};

mixin(RangeGlobalStep, FilterStep.prototype, Barrier.prototype);

export { RangeGlobalStep };
