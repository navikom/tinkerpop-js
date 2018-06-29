import { mixin, ArrayUtils } from '../../../../util';
import TreeSupplier from '../../../../util/function/TreeSupplier';
import TraversalParent from '../TraversalParent';
import ByModulating from '../../ByModulating';
import PathProcessor from '../../step/PathProcessor';
import TraversalUtil from '../../util/TraversalUtil';
import { SideEffectStep } from './SideEffectStep';
import { TreeStep } from '../map';
import TraversalRing from '../../util/TraversalRing';
import Tree from '../../step/util/Tree';
import TraverserRequirement from '../../traverser/TraverserRequirement';
import SideEffectCapable from '../SideEffectCapable';

/**
 * TreeSideEffectStep
 * @param traversal
 * @param sideEffectKey
 * @constructor
 */
function TreeSideEffectStep(traversal, sideEffectKey) {
	SideEffectStep.call(this, traversal);
	this.sideEffectKey = sideEffectKey;
	this.traversalRing = new TraversalRing();
	this.getTraversal().getSideEffects()
		.registerIfAbsent(this.sideEffectKey, TreeSupplier.instance(), TreeStep.TreeBiOperator.instance());
}

TreeSideEffectStep.prototype = {
	constructor: TreeSideEffectStep,
	sideEffect(traverser) {
		const root = new Tree();
		let depth = root;
		const path = traverser.path();
		for (let i = 0; i < path.size(); i++) {
			const object = TraversalUtil.applyNullable(path.get(i), this.traversalRing.next());
			if (!depth.containsKey(object))
				depth.put(object, new Tree());
			depth = depth.get(object);
		}
		this.traversalRing.reset();
		this.getTraversal().getSideEffects().add(this.sideEffectKey, root);
	},

	processNextStart() {
		return PathProcessor.processTraverserPathLabels(SideEffectStep.prototype.processNextStart.call(this), this.keepLabels);
	},

	getSideEffectKey() {
		return this.sideEffectKey;
	},

	reset() {
		SideEffectStep.prototype.reset.call(this);
		this.traversalRing.reset();
	},

	clone() {
		const clone = SideEffectStep.prototype.clone.call(this);
		clone.traversalRing = this.traversalRing.clone();
		return clone;
	},

	setTraversal(parentTraversal) {
		SideEffectStep.prototype.setTraversal.call(this, parentTraversal);
		this.traversalRing.getTraversals().forEach((t) => this.integrateChild(t));
	},

	getLocalChildren() {
		return this.traversalRing.getTraversals();
	},

	modulateBy(treeTraversal) {
		this.traversalRing.addTraversal(this.integrateChild(treeTraversal));
	},

	getRequirements() {
		return this.getSelfAndChildRequirements(TraverserRequirement.PATH, TraverserRequirement.SIDE_EFFECTS);
	},

	setKeepLabels(labels) {
		this.keepLabels = labels;
	},

	getKeepLabels() {
		return this.keepLabels;
	}
};

mixin(
	TreeSideEffectStep,
	SideEffectStep.prototype,
	TraversalParent.prototype,
	SideEffectCapable.prototype,
	ByModulating.prototype,
	PathProcessor.prototype
);

export { TreeSideEffectStep };
