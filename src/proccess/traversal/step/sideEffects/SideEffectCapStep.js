import { mixin, ArrayUtils, List, Map } from '../../../../util';
import SupplyingBarrierStep from '../util/SupplyingBarrierStep';
import EmptyTraversal from '../../util/EmptyTraversal';
import TraversalHelper from '../../util/TraversalHelper';
import TraverserRequirement from '../../traverser/TraverserRequirement';
import SideEffectCapable from '../SideEffectCapable';

/**
 * SideEffectCapStep
 * @param traversal
 * @param sideEffectKey
 * @param sideEffectKeys
 * @constructor
 */
function SideEffectCapStep(traversal, sideEffectKey, ...sideEffectKeys) {
	SupplyingBarrierStep.call(this, traversal);
	this.sideEffectKeys = new List();
	this.sideEffectKeys.add(sideEffectKey);
	ArrayUtils.checkArray(sideEffectKeys).map((effect) => this.sideEffectKeys.add(effect));
}

SideEffectCapStep.prototype = Object.create(SupplyingBarrierStep.prototype);
SideEffectCapStep.prototype.constructor = SideEffectCapStep;

SideEffectCapStep.prototype.getSideEffectKeys = function() {
	return this.sideEffectKeys;
};

SideEffectCapStep.prototype.getRequirements = function() {
	return new List([TraverserRequirement.SIDE_EFFECTS]);
};

SideEffectCapStep.prototype.supply = function() {
	if (null === this.sideEffectCapableSteps || undefined === this.sideEffectCapableSteps) {
		this.sideEffectCapableSteps = new Map();
		let parentTraversal = this.getTraversal();
		while (!(parentTraversal instanceof EmptyTraversal)) {
			const steps = TraversalHelper.getStepsOfAssignableClassRecursively(SideEffectCapable, parentTraversal);
			for (let i = 0; i < steps.size(); i++) {
				const capableStep = steps.get(i)
				if (this.sideEffectKeys.contains(capableStep.getSideEffectKey())
					&& !this.sideEffectCapableSteps.containsKey(capableStep.getSideEffectKey()))
					this.sideEffectCapableSteps.put(capableStep.getSideEffectKey(), capableStep);
			}
			if (this.sideEffectKeys.size() === this.sideEffectCapableSteps.size())
				break;
			parentTraversal = parentTraversal.getParent().asStep().getTraversal();
		}
	}
	////////////
	if (this.sideEffectKeys.size() === 1) {
		const sideEffectKey = this.sideEffectKeys.get(0);
		const result = this.getTraversal().getSideEffects().get(sideEffectKey);
		const sideEffectCapable = this.sideEffectCapableSteps.get(sideEffectKey);
		const finalResult = null === sideEffectCapable || undefined === sideEffectCapable
			? result : sideEffectCapable.generateFinalResult(result);
		this.getTraversal().getSideEffects().set(sideEffectKey, finalResult);
		return finalResult;
	} else
		return this.getMapOfSideEffects();
};

SideEffectCapStep.prototype.getMapOfSideEffects = function() {
	const temp = this.getTraversal().getSideEffects();
	const sideEffects = new Map();
	for (let i = 0; i < this.sideEffectKeys.size(); i++) {
		const sideEffectKey = this.sideEffectKeys.get(i);
		if (temp.exists(sideEffectKey)) {
			const result = temp.get(sideEffectKey);
			const sideEffectCapable = this.sideEffectCapableSteps.get(sideEffectKey);
			const finalResult = null === sideEffectCapable || undefined === sideEffectCapable
				? result : sideEffectCapable.generateFinalResult(result);
			temp.set(sideEffectKey, finalResult);
			sideEffects.put(sideEffectKey, finalResult);
		}
	}
	return sideEffects;
};

SideEffectCapStep.prototype.clone = function() {
	const clone = SupplyingBarrierStep.prototype.clone.call(this);
	clone.sideEffectCapableSteps = null;
	return clone;
};

export { SideEffectCapStep }