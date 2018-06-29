import { List } from '../../../../util';
import { DetachedFactory } from '../../../../structure/util/detached';
import AbstractStep from './../util/AbstractStep';
import TraverserSet from '../../traverser/util/TraverserSet';
import ProjectedTraverser from '../../traverser/ProjectedTraverser';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * CollectingBarrierStep
 * @param traversal
 * @param maxBarrierSize
 * @constructor
 */
function CollectingBarrierStep(traversal, maxBarrierSize) {
	AbstractStep.call(this, traversal);

	this.traverserSet = new TraverserSet();
	this.barrierConsumed = false;
	this.maxBarrierSize = maxBarrierSize;

}

CollectingBarrierStep.prototype = Object.create(AbstractStep.prototype);
CollectingBarrierStep.prototype.constructor = CollectingBarrierStep;

CollectingBarrierStep.prototype.getRequirements = function() {
	return new List(TraverserRequirement.BULK);
};

CollectingBarrierStep.prototype.processAllStarts = function() {
	if (this.starts.hasNext()) {
		if (2147483647 === this.maxBarrierSize) {
			let var10000 = this.starts;
			let var10001 = this.traverserSet;
			var10000.forEachRemaining((entity) => var10001.add(entity));
		} else {
			while (this.starts.hasNext() && this.traverserSet.size() < this.maxBarrierSize) {
				this.traverserSet.add(this.starts.next());
			}
		}
	}

};

CollectingBarrierStep.prototype.hasNextBarrier = function() {
	this.processAllStarts();
	return !this.traverserSet.isEmpty();
};

CollectingBarrierStep.prototype.nextBarrier = function() {
	this.processAllStarts();
	if (this.traverserSet.isEmpty()) {
		throw ("No Such Element Exception");
	} else {
		let temp = new TraverserSet();
		this.traverserSet.iterator().forEachRemaining((t) => {
			DetachedFactory.detach(t, true);
			temp.add(t);
		});
		return temp;
	}
};

CollectingBarrierStep.prototype.addBarrier = function(barrier) {
	barrier.forEach((traverser) => {
		traverser.setSideEffects(this.getTraversal().getSideEffects());
	});
	this.traverserSet.addAll(barrier);
	this.barrierConsumed = false;
};

CollectingBarrierStep.prototype.processNextStart = function() {

	if (this.traverserSet.isEmpty() && this.starts.hasNext()) {
		this.processAllStarts();
		this.barrierConsumed = false;
	}

	if (!this.barrierConsumed) {

		this.barrierConsumer(this.traverserSet);
		this.barrierConsumed = true;
	}

	return ProjectedTraverser.tryUnwrap(this.traverserSet.remove());
};


CollectingBarrierStep.prototype.reset = function() {
	AbstractStep.prototype.reset.call(this);
	this.traverserSet.clear();
};


export default CollectingBarrierStep;
