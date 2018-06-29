import { mixin, Map } from '../../../../util';
import HashMapSupplier from '../../../../util/function/HashMapSupplier';
import { __ } from '../../dsl/graph';
import TraversalParent from '../TraversalParent';
import { SideEffectStep } from './SideEffectStep';
import ByModulating from '../../ByModulating';
import { GroupStep } from '../map';
import TraversalHelper from '../../util/TraversalHelper';
import TraversalUtil from '../../util/TraversalUtil';
import Operator from '../../Operator';
import Barrier from '../Barrier';
import TraverserRequirement from '../../traverser/TraverserRequirement';
import SideEffectCapable from '../SideEffectCapable';

/**
 * GroupSideEffectStep
 * @param traversal
 * @param sideEffectKey
 * @constructor
 */
function GroupSideEffectStep(traversal, sideEffectKey) {
	SideEffectStep.call(this, traversal);
	this.state = 'k';
	this.sideEffectKey = sideEffectKey;
	this.valueTraversal = this.integrateChild(__.fold().asAdmin());
	this.barrierStep = TraversalHelper.getFirstStepOfAssignableClass(Barrier, this.valueTraversal).orElse(null);
	this.getTraversal().getSideEffects().registerIfAbsent(this.sideEffectKey, HashMapSupplier.instance(),
		new GroupStep.GroupBiOperator(null == this.barrierStep ?
			Operator.assign :
			this.barrierStep.getMemoryComputeKey().getReducer()));
}
GroupSideEffectStep.prototype = Object.create(SideEffectStep.prototype);
GroupSideEffectStep.prototype.constructor = GroupSideEffectStep;

mixin(GroupSideEffectStep, TraversalParent.prototype, SideEffectCapable.prototype, ByModulating.prototype);

GroupSideEffectStep.prototype.modulateBy = function(kvTraversal) {
	if ('k' === this.state) {
		this.keyTraversal = this.integrateChild(kvTraversal);
		this.state = 'v';
	} else if ('v' === this.state) {
		this.valueTraversal = this.integrateChild(GroupStep.convertValueTraversal(kvTraversal));
		this.barrierStep = TraversalHelper.getFirstStepOfAssignableClass(Barrier, this.valueTraversal).orElse(null);
		this.getTraversal().getSideEffects().register(this.sideEffectKey, null,
			new GroupStep.GroupBiOperator(null === this.barrierStep ?
				Operator.assign :
				this.barrierStep.getMemoryComputeKey().getReducer()));
		this.state = 'x';
	} else {
		throw ("The key and value traversals for group()-step have already been set: " + this.constructor.name);
	}
};

GroupSideEffectStep.prototype.sideEffect = function(traverser) {
	const map = new Map();
	this.valueTraversal.reset();
	this.valueTraversal.addStart(traverser);
	if (null === this.barrierStep || undefined === this.barrierStep) {
		if (this.valueTraversal.hasNext())
			map.put(TraversalUtil.applyNullable(traverser, this.keyTraversal), this.valueTraversal.next());
	} else if (this.barrierStep.hasNextBarrier())
		map.put(TraversalUtil.applyNullable(traverser, this.keyTraversal), this.barrierStep.nextBarrier());
	if (!map.isEmpty())
		this.getTraversal().getSideEffects().add(this.sideEffectKey, map);
};

GroupSideEffectStep.prototype.getSideEffectKey = function() {
	return this.sideEffectKey;
};

GroupSideEffectStep.prototype.getLocalChildren = function() {
	const children = new List();
	if (null !== this.keyTraversal && undefined !== this.keyTraversal)
		children.add(this.keyTraversal);
	children.add(this.valueTraversal);
	return children;
};

GroupSideEffectStep.prototype.getRequirements = function() {
	return this.getSelfAndChildRequirements(
		TraverserRequirement.OBJECT, TraverserRequirement.BULK, TraverserRequirement.SIDE_EFFECTS);
};

GroupSideEffectStep.prototype.clone = function() {
	const clone = SideEffectStep.prototype.clone.call(this);
	if (null !== this.keyTraversal && undefined !== this.keyTraversal)
		clone.keyTraversal = this.keyTraversal.clone();
	clone.valueTraversal = this.valueTraversal.clone();
	clone.barrierStep = TraversalHelper.getFirstStepOfAssignableClass(Barrier, clone.valueTraversal).orElse(null);
	return clone;
};

GroupSideEffectStep.prototype.setTraversal = function(parentTraversal) {
	SideEffectStep.prototype.setTraversal.call(this, parentTraversal);
	this.integrateChild(this.keyTraversal);
	this.integrateChild(this.valueTraversal);
}

GroupSideEffectStep.prototype.generateFinalResult = function(object) {
	return GroupStep.doFinalReduction(object, this.valueTraversal);
};

export { GroupSideEffectStep };


