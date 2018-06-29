import { mixin, List, Map, isNull } from '../../../../util';
import Traversal from '../../Traversal';
import TraversalOptionParent from '../TraversalOptionParent';
import TraversalHelper from '../../util/TraversalHelper';
import ComputerAwareStep from './../util/ComputerAwareStep';
import TraversalUtil from '../../util/TraversalUtil';
import Barrier from '../Barrier';
import Pick from '../Pick';
import StringFactory from '../../../../structure/util/StringFactory';

/**
 * BranchStep
 * @param traversal
 * @constructor
 */
function BranchStep(traversal) {
	ComputerAwareStep.call(this, traversal);
	this.traversalOptions = new Map();
	this.first = true;
	this.hasBarrier = false;
};

BranchStep.prototype = Object.create(ComputerAwareStep.prototype);
BranchStep.prototype.constructor = BranchStep;

mixin(BranchStep, TraversalOptionParent.prototype);

BranchStep.prototype.setBranchTraversal = function(branchTraversal) {
	this.branchTraversal = this.integrateChild(branchTraversal);
};

BranchStep.prototype.addGlobalChildOption = function(pickToken, traversalOption) {
	if (this.traversalOptions.containsKey(pickToken))
		this.traversalOptions.get(pickToken).add(traversalOption);
	else
		this.traversalOptions.put(pickToken, new List([traversalOption]));
	Traversal.prototype.addStep.call(traversalOption, new ComputerAwareStep.EndStep(traversalOption));
	if (!this.hasBarrier && !TraversalHelper.getStepsOfAssignableClassRecursively(Barrier, traversalOption).isEmpty())
		this.hasBarrier = true;
	this.integrateChild(traversalOption);
};

BranchStep.prototype.getRequirements = function() {
	return this.getSelfAndChildRequirements();
};

BranchStep.prototype.getGlobalChildren = function() {
	return this.traversalOptions.values().flatMap();
};

BranchStep.prototype.getLocalChildren = function() {
	return new List([this.branchTraversal]);
};

BranchStep.prototype.standardAlgorithm = function() {
	while (true) {
		if (!this.first) {
			for (let i = 0; i < this.traversalOptions.size(); i++) {
				const options = this.traversalOptions.values().get(i);
				for (let j = 0; j < options.size(); j++) {
					const option = options.get(j);
					if (option.hasNext())
						return option.getEndStep();
				}
			}
		}
		this.first = false;
		///
		if (this.hasBarrier) {
			if (!this.starts.hasNext())
				throw ("No Such Element Exception");
			while (this.starts.hasNext()) {
				this.handleStart(this.starts.next());
			}
		} else {
			this.handleStart(this.starts.next());
		}
	}
};

BranchStep.prototype.handleStart = function(start) {
	const choice = TraversalUtil.apply(start, this.branchTraversal);
	const branch = this.traversalOptions.containsKey(choice) ? this.traversalOptions.get(choice) : this.traversalOptions.get(Pick.none);
	if (!isNull(branch))
		branch.forEach(traversal => traversal.addStart(start.split()));
	if (choice !== Pick.any) {
		const anyBranch = this.traversalOptions.get(Pick.any);
		if (!isNull(anyBranch))
			anyBranch.forEach(traversal => traversal.addStart(start.split()));
	}
};

BranchStep.prototype.computerAlgorithm = function() {
	const ends = new List();
	const start = this.starts.next();
	const choice = TraversalUtil.apply(start, this.branchTraversal);
	const branch = this.traversalOptions.containsKey(choice) ? this.traversalOptions.get(choice) : this.traversalOptions.get(Pick.none);
	if (!isNull(branch)) {
		branch.forEach(traversal => {
			const split = start.split();
			split.setStepId(traversal.getStartStep().getId());
			ends.add(split);
		});
	}
	if (choice !== Pick.any) {
		const anyBranch = this.traversalOptions.get(Pick.any);
		if (null !== anyBranch) {
			anyBranch.forEach(traversal => {
				const split = start.split();
				split.setStepId(traversal.getStartStep().getId());
				ends.add(split);
			});
		}
	}
	return ends.iterator();
};

BranchStep.prototype.clone = function() {
	const clone = ComputerAwareStep.prototype.clone.call(this);
	clone.traversalOptions = new Map();
	const entry = this.traversalOptions.keySet();
	while (entry.hasNext()){
		const traversals = entry.getValue();
		if (traversals.size() > 0) {
			const clonedTraversals = clone.traversalOptions.compute(entry.getKey(), (k, v) =>
				(isNull(v)) ? new List() : v);
			for (let i = 0; i < traversals.size(); i++) {
				const traversal = traversals.get(i);
				clonedTraversals.add(traversal.clone());
			}
		}
		entry.next();
	}
	clone.branchTraversal = this.branchTraversal.clone();
	return clone;
};

BranchStep.prototype.setTraversal = function(parentTraversal) {
	ComputerAwareStep.prototype.setTraversal.call(this, parentTraversal);
	this.integrateChild(this.branchTraversal);
	this.traversalOptions.values().flatMap().forEach((t) => this.integrateChild(t));
};

BranchStep.prototype.hashCode = function() {
	let result = ComputerAwareStep.prototype.hashCode.call(this);
	if (!isNull(this.traversalOptions))
		result ^= this.traversalOptions.hashCode();
	if (!isNull(this.branchTraversal))
		result ^= this.branchTraversal.hashCode();
	return result;
};


BranchStep.prototype.reset = function() {
	ComputerAwareStep.prototype.reset.call(this);
	this.getGlobalChildren().forEach((c) => c.reset());
	this.first = true;
};

BranchStep.prototype.toString = function() {
	return StringFactory.stepString(this, this.branchTraversal);
};

export { BranchStep }
