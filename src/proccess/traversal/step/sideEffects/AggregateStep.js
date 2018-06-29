import { mixin, List } from '../../../../util';
import StringFactory from '../../../../structure/util/StringFactory';
import BulkSet from './../util/BulkSet';
import BulkSetSupplier from '../../../../util/function/BulkSetSupplier';
import Operator from '../../Operator';
import AbstractStep from './../util/AbstractStep';
import TraversalUtil from '../../util/TraversalUtil';
import TraversalParent from '../TraversalParent';
import TraverserSet from '../../traverser/util/TraverserSet';
import TraverserRequirement from '../../traverser/TraverserRequirement';
import SideEffectCapable from '../SideEffectCapable';
import Barrier from '../Barrier';

/**
 * AggregateStep
 * @param traversal
 * @param sideEffectKey
 * @constructor
 */
function AggregateStep(traversal, sideEffectKey) {
	AbstractStep.call(this, traversal);

	this.aggregateTraversal = null;
	this.barrier = new TraverserSet();
	this.sideEffectKey = sideEffectKey;
	this.getTraversal().getSideEffects().registerIfAbsent(this.sideEffectKey, BulkSetSupplier.instance(), Operator.addAll);

}
AggregateStep.prototype = {
	constructor: AggregateStep,
	getSideEffectKey() {
		return this.sideEffectKey;
	},

	modulateBy(aggregateTraversal) {
		this.aggregateTraversal = this.integrateChild(aggregateTraversal);
	},

	getLocalChildren() {
		return !this.aggregateTraversal ? new List() : new List([this.aggregateTraversal]);
	},

	getRequirements() {
		return this.getSelfAndChildRequirements(TraverserRequirement.BULK, TraverserRequirement.SIDE_EFFECTS);
	},

	setTraversal(parentTraversal) {
		AbstractStep.prototype.setTraversal.call(this, parentTraversal);
		this.integrateChild(this.aggregateTraversal);
	},


	processNextStart() {
		this.processAllStarts();
		return this.barrier.remove();
	},

	processAllStarts() {
		if (this.starts.hasNext()) {
			const bulkSet = new BulkSet();
			while (this.starts.hasNext()) {
				const traverser = this.starts.next();
				bulkSet.add(TraversalUtil.applyNullable(traverser, this.aggregateTraversal), traverser.bulk());
				traverser.setStepId(this.getNextStep().getId()); // when barrier is reloaded, the traversers should be at the next step
				this.barrier.add(traverser);
			}
			this.getTraversal().getSideEffects().add(this.sideEffectKey, bulkSet);
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
		return StringFactory.stepString(this, this.sideEffectKey, this.aggregateTraversal);
	}
};

mixin(AggregateStep, AbstractStep.prototype, TraversalParent.prototype, SideEffectCapable.prototype, Barrier.prototype);

export { AggregateStep };

