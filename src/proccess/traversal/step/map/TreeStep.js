import { mixin, List } from '../../../../util';
import TreeSupplier from '../../../../util/function/TreeSupplier';
import BinaryOperator from '../../../../util/function/BinaryOperator';
import ByModulating from '../../ByModulating';
import TraversalParent from '../../step/TraversalParent';
import PathProcessor from '../../step/PathProcessor';
import ReducingBarrierStep from './../util/ReducingBarrierStep';
import TraversalUtil from '../../util/TraversalUtil';
import TraversalRing from '../../util/TraversalRing';
import Tree from '../../step/util/Tree';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * TreeStep
 * @param traversal
 * @constructor
 */
function TreeStep(traversal) {
	ReducingBarrierStep.call(this, traversal);
	this.traversalRing = new TraversalRing();
	this.setSeedSupplier(TreeSupplier.instance());
	this.setReducingBiOperator(TreeStep.TreeBiOperator.instance());
}

TreeStep.prototype = Object.create(ReducingBarrierStep.prototype);
TreeStep.prototype.constructor = TreeStep;

mixin(
	TreeStep, TraversalParent.prototype, ByModulating.prototype, PathProcessor.prototype);

TreeStep.prototype.getLocalChildren = function() {
		return this.traversalRing.getTraversals();
	};

TreeStep.prototype.modulateBy = function(treeTraversal) {
		this.traversalRing.addTraversal(this.integrateChild(treeTraversal));
	};

TreeStep.prototype.getRequirements = function() {
		return this.getSelfAndChildRequirements(TraverserRequirement.PATH, TraverserRequirement.SIDE_EFFECTS);
	};

TreeStep.prototype.projectTraverser = function(traverser) {
		const topTree = new Tree();
		let depth = topTree;
		const path = traverser.path();

		for (let i = 0; i < path.size(); i++) {
			const object = TraversalUtil.applyNullable(path.get(i), this.traversalRing.next());
			if (!depth.containsKey(object))
				depth.put(object, new Tree());
			depth = depth.get(object);
		}
		this.traversalRing.reset();
		return topTree;
	};


TreeStep.prototype.clone = function() {
		const clone = ReducingBarrierStep.prototype.clone.call(this);
		clone.traversalRing = this.traversalRing.clone();
		return clone;
	};

TreeStep.prototype.setTraversal = function(parentTraversal) {
		ReducingBarrierStep.prototype.setTraversal(parentTraversal);
		this.traversalRing.getTraversals().forEach((t) => this.integrateChild(t));
	};

TreeStep.prototype.reset = function() {
		ReducingBarrierStep.prototype.reset();
		this.traversalRing.reset();
	};

TreeStep.prototype.setKeepLabels = function(labels) {
		this.keepLabels = labels;
	};

TreeStep.prototype.getKeepLabels = function() {
		return this.keepLabels;
};

////////////////

TreeStep.TreeBiOperator = function() {
}

TreeStep.TreeBiOperator.prototype = {
	constructor: TreeStep.TreeBiOperator,
	apply(mutatingSeed, tree) {
		mutatingSeed.addTree(tree);
		return mutatingSeed;
	}
};

const INSTANCE = new TreeStep.TreeBiOperator();
TreeStep.TreeBiOperator.instance = () => INSTANCE;

mixin(TreeStep.TreeBiOperator, BinaryOperator.prototype);

export { TreeStep };
