import { mixin, Map, List, isNull } from '../../../../util';
import BulkSetSupplier from '../../../../util/function/BulkSetSupplier';
import TraversalParent from '../TraversalParent';
import { SideEffectStep } from './SideEffectStep';
import ByModulating from '../../ByModulating';
import Operator from '../../Operator';
import TraversalUtil from '../../util/TraversalUtil';
import TraverserRequirement from '../../traverser/TraverserRequirement';
import SideEffectCapable from '../SideEffectCapable';
import BulkSet from './../util/BulkSet';
import StringFactory from '../../../../structure/util/StringFactory';

/**
 * StoreStep
 * @param traversal
 * @param sideEffectKey
 * @constructor
 */
function StoreStep(traversal, sideEffectKey) {
	SideEffectStep.call(this, traversal);
	this.storeTraversal = null;
		this.sideEffectKey = sideEffectKey;
		this.getTraversal().getSideEffects()
			.registerIfAbsent(this.sideEffectKey, BulkSetSupplier.instance(), Operator.addAll);
}
StoreStep.prototype = Object.create(SideEffectStep.prototype);
StoreStep.prototype.constructor = StoreStep;

mixin(StoreStep, SideEffectCapable.prototype, TraversalParent.prototype, ByModulating.prototype);

StoreStep.prototype.sideEffect = function(traverser) {
	const bulkSet = new BulkSet();
	bulkSet.add(TraversalUtil.applyNullable(traverser, this.storeTraversal), traverser.bulk());
	this.getTraversal().getSideEffects().add(this.sideEffectKey, bulkSet);
};

StoreStep.prototype.getSideEffectKey = function() {
	return this.sideEffectKey;
};

StoreStep.prototype.toString = function() {
	return StringFactory.stepString(this, this.sideEffectKey, this.storeTraversal);
};

StoreStep.prototype.getLocalChildren = function() {
	return isNull(this.storeTraversal) ? new List() : new List([this.storeTraversal]);
};

StoreStep.prototype.modulateBy = function(storeTraversal) {
	this.storeTraversal = this.integrateChild(storeTraversal);
};

StoreStep.prototype.getRequirements = function() {
	return this.getSelfAndChildRequirements(TraverserRequirement.SIDE_EFFECTS, TraverserRequirement.BULK);
};

StoreStep.prototype.clone = function() {
	const clone = SideEffectStep.prototype.clone.call(this);
	if (!isNull(this.storeTraversal))
		clone.storeTraversal = this.storeTraversal.clone();
	return clone;
};

StoreStep.prototype.setTraversal = function(parentTraversal) {
	SideEffectStep.prototype.setTraversal.call(this, parentTraversal);
	this.integrateChild(this.storeTraversal);
};

export { StoreStep };

