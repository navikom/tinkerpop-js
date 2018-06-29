import { mixin, ArrayUtils, List, Map } from '../../../../util';
import { FilterStep } from './FilterStep';
import TraversalParent from '../TraversalParent';
import TraversalUtil from '../../util/TraversalUtil';
import Scoping from '../Scoping';
import GraphComputing from '../GraphComputing';
import ByModulating from '../../ByModulating';
import PathProcessor from '../../step/PathProcessor';
import Pop from '../../Pop';
import TraverserRequirement from '../../traverser/TraverserRequirement';
import Barrier from '../Barrier';

/**
 * DedupGlobalStep
 * @param traversal
 * @param dedupLabels
 * @constructor
 */
function DedupGlobalStep(traversal, ...dedupLabels) {
	FilterStep.call(this, traversal);

	dedupLabels = ArrayUtils.checkArray(dedupLabels);
	this.dedupTraversal = null;
	this.duplicateSet = new List();
	this.onGraphComputer = false;
	this.executingAtMaster = false;

	this.dedupLabels = dedupLabels.length === 0 ? null : dedupLabels;
}
DedupGlobalStep.prototype = {
	constructor: DedupGlobalStep,
	filter(traverser) {

		if (this.onGraphComputer && !this.executingAtMaster) return true;
		traverser.setBulk(1);
		if (null === this.dedupLabels) {
			const duplicateSet = this.duplicateSet.put(TraversalUtil.applyNullable(traverser, this.dedupTraversal));
			return duplicateSet;
		} else {
			const objects = new List();
			this.dedupLabels.map((label) => objects.add(TraversalUtil.applyNullable(this.getScopeValue(Pop.last, label, traverser),
				this.dedupTraversal)));
			return this.duplicateSet.put(objects);
		}
	},

	atMaster(atMaster) {
		this.executingAtMaster = atMaster;
	},

	getMaxRequirement() {
		return null === this.dedupLabels ? PathProcessor.ElementRequirement.ID : PathProcessor.prototype.getMaxRequirement.call(this);
	},

	processNextStart() {
		if (this.barrier && null !== this.barrier) {
			this.barrierIterator = this.barrier.keySet();
			this.barrier = null;
		}

		while (this.barrierIterator && this.barrierIterator.hasNext()) {
			if (!this.barrierIterator)
				this.barrierIterator = this.barrier.keySet();
			const entry = this.barrierIterator.next();
			if (this.duplicateSet.add(entry.getKey()))
				return PathProcessor.processTraverserPathLabels(entry.getValue(), this.keepLabels);
		}
		const processor = PathProcessor.processTraverserPathLabels(FilterStep.prototype.processNextStart.call(this), this.keepLabels);
		//console.log(this, processor);
		return processor;
	},

	getLocalChildren() {
		return !this.dedupTraversal ? new List() : new List([this.dedupTraversal]);
	},

	modulateBy(dedupTraversal) {
		this.dedupTraversal = this.integrateChild(dedupTraversal);
	},


	setTraversal(parentTraversal) {
		FilterStep.prototype.setTraversal.call(this, parentTraversal);
		this.integrateChild(this.dedupTraversal);
	},

	getRequirements() {
		return this.dedupLabels === null ?
			this.getSelfAndChildRequirements(TraverserRequirement.BULK) :
			this.getSelfAndChildRequirements(TraverserRequirement.LABELED_PATH, TraverserRequirement.BULK);
	},

	onGraphComputer() {
		this.onGraphComputer = true;
	},

	getScopeKeys() {
		return null === this.dedupLabels ? [] : this.dedupLabels;
	},

	processAllStarts() {

	},

	hasNextBarrier() {
		return this.barrier && null !== this.barrier || this.starts.hasNext();
	},

	nextBarrier() {
		const map = this.barrier && null != this.barrier ? this.barrier : new Map();
		while (this.starts.hasNext()) {
			const traverser = this.starts.next();
			let object;
			if (null !== this.dedupLabels) {
				object = new List();
				this.dedupLabels.map((label) =>
					object.add(TraversalUtil.applyNullable(this.getScopeValue(Pop.last, label, traverser), this.dedupTraversal)));
			} else {
				object = TraversalUtil.applyNullable(traverser, this.dedupTraversal);
			}
			if (!map.containsKey(object)) {
				traverser.setBulk(1);
				// traverser.detach();
				//traverser.set(DetachedFactory.detach(traverser.get(), true)); // TODO: detect required detachment accordingly
				map.put(object, traverser);
			}
		}
		this.barrier = null;
		this.barrierIterator = null;
		if (map.isEmpty())
			throw ("No Such Element Exception");
		else
			return map;
	},

	addBarrier(barrier) {
		if (!this.barrier || null === this.barrier)
			this.barrier = new Map(barrier);
		else
			this.barrier.putAll(barrier);
	},

	//getMemoryComputeKey() {
	//	return MemoryComputeKey.of(this.getId(), (BinaryOperator) Operator.addAll, false, true);
	//}

	setKeepLabels(labels) {
		this.keepLabels = labels;
	},

	getKeepLabels() {
		return this.keepLabels;
	},

	reset() {
		FilterStep.prototype.reset.call(this);
		this.duplicateSet.clear();
		this.barrier = null;
		this.barrierIterator = null;
	}
};

mixin(DedupGlobalStep,
	FilterStep.prototype,
	TraversalParent.prototype,
	Scoping.prototype,
	GraphComputing.prototype,
	ByModulating.prototype,
	PathProcessor.prototype,
	Barrier.prototype
);

export { DedupGlobalStep };