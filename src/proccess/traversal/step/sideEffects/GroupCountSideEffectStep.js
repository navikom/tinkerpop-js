import { mixin, Map, List } from '../../../../util';
import HashMapSupplier from '../../../../util/function/HashMapSupplier';
import TraversalParent from '../TraversalParent';
import { SideEffectStep } from './SideEffectStep';
import ByModulating from '../../ByModulating';
import { GroupCountStep } from '../map';
import TraversalHelper from '../../util/TraversalHelper';
import TraversalUtil from '../../util/TraversalUtil';
import TraverserRequirement from '../../traverser/TraverserRequirement';
import SideEffectCapable from '../SideEffectCapable';


/**
 * GroupCountSideEffectStep
 * @param traversal
 * @param sideEffectKey
 * @constructor
 */
function GroupCountSideEffectStep(traversal, sideEffectKey) {
	SideEffectStep.call(this, traversal);
	this.keyTraversal = null;
	this.sideEffectKey = sideEffectKey;
	this.getTraversal().asAdmin().getSideEffects()
		.registerIfAbsent(this.sideEffectKey, HashMapSupplier.instance(), GroupCountStep.GroupCountBiOperator.instance());
}
GroupCountSideEffectStep.prototype = Object.create(SideEffectStep.prototype);
GroupCountSideEffectStep.prototype.constructor = GroupCountSideEffectStep;

mixin(GroupCountSideEffectStep, TraversalParent.prototype, SideEffectCapable.prototype, ByModulating.prototype);

GroupCountSideEffectStep.prototype.sideEffect = function(traverser) {
	const map = new Map();
	map.put(TraversalUtil.applyNullable(traverser, this.keyTraversal), traverser.bulk());
	this.getTraversal().getSideEffects().add(this.sideEffectKey, map);
};

GroupCountSideEffectStep.prototype.getSideEffectKey = function() {
	return this.sideEffectKey;
};

GroupCountSideEffectStep.prototype.addLocalChild = function(groupTraversal) {
	this.keyTraversal = this.integrateChild(groupTraversal);
};

GroupCountSideEffectStep.prototype.getLocalChildren = function() {
	return null === this.keyTraversal || undefined === this.keyTraversal
		? new List() : new List([this.keyTraversal]);
};

GroupCountSideEffectStep.prototype.getRequirements = function() {
	return this.getSelfAndChildRequirements(TraverserRequirement.BULK, TraverserRequirement.SIDE_EFFECTS);
};

GroupCountSideEffectStep.prototype.clone = function() {
	const clone = SideEffectStep.prototype.clone.call(this);
	if (null !== this.keyTraversal && undefined !== this.keyTraversal)
		clone.keyTraversal = this.keyTraversal.clone();
	return clone;
};

GroupCountSideEffectStep.prototype.setTraversal = function(parentTraversal) {
	SideEffectStep.prototype.setTraversal.call(this, parentTraversal);
	this.integrateChild(this.keyTraversal);
};

GroupCountSideEffectStep.prototype.modulateBy = function(keyTraversal) {
	this.keyTraversal = this.integrateChild(keyTraversal);
};

export { GroupCountSideEffectStep };

