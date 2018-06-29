import { mixin, List, ArrayUtils } from '../../../../util';
import TraversalParent from '../TraversalParent';
import { SideEffectStep } from './SideEffectStep';
import TraversalUtil from '../../util/TraversalUtil';

/**
 * TraversalSideEffectStep
 * @param traversal
 * @param sideEffectTraversal
 * @constructor
 */
function TraversalSideEffectStep(traversal, sideEffectTraversal) {
	SideEffectStep.call(this, traversal);
	this.sideEffectTraversal = this.integrateChild(sideEffectTraversal.asAdmin());
}

TraversalSideEffectStep.prototype = {
	constructor: TraversalSideEffectStep,
	sideEffect(traverser) {
		const iterator = TraversalUtil.applyAll(traverser, this.sideEffectTraversal);
		while (iterator.hasNext()) iterator.next();
	},

	getLocalChildren() {
		return new List([this.sideEffectTraversal]);
	},

	clone() {
		const clone = SideEffectStep.prototype.clone.call(this);
		clone.sideEffectTraversal = this.sideEffectTraversal.clone();
		return clone;
	},

	setTraversal(parentTraversal) {
		SideEffectStep.prototype.setTraversal.call(this, parentTraversal);
		this.integrateChild(this.sideEffectTraversal);
	},

	getRequirements() {
		return this.getSelfAndChildRequirements();
	}
};

mixin(TraversalSideEffectStep, SideEffectStep.prototype, TraversalParent.prototype);

export { TraversalSideEffectStep };
