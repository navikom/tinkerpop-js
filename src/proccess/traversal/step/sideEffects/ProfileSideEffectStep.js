import { mixin, isNull } from '../../../../util';
import DefaultTraversalMetricsSupplier from '../../../../util/function/DefaultTraversalMetricsSupplier';
import { SideEffectStep } from './SideEffectStep';
import Hidden from '../../../../structure/Hidden';
import Operator from '../../Operator';
import SideEffectCapable from '../../step/SideEffectCapable';
import GraphComputing from '../../step/GraphComputing';

/**
 * ProfileSideEffectStep
 * @param traversal
 * @param sideEffectKey
 * @constructor
 */
function ProfileSideEffectStep(traversal, sideEffectKey) {
	SideEffectStep.call(this, traversal);
	this.sideEffectKey = sideEffectKey;
	this.onGraphComputer = false;
	this.getTraversal().getSideEffects()
		.registerIfAbsent(this.sideEffectKey, DefaultTraversalMetricsSupplier.instance(), Operator.assign);

}

ProfileSideEffectStep.prototype = Object.create(SideEffectStep.prototype);
ProfileSideEffectStep.prototype.constructor = ProfileSideEffectStep;

mixin(ProfileSideEffectStep, SideEffectCapable.prototype, GraphComputing.prototype);

ProfileSideEffectStep.prototype.sideEffect = function(traverser) {
};

ProfileSideEffectStep.prototype.getSideEffectKey = function() {
	return this.sideEffectKey;
};

ProfileSideEffectStep.prototype.next = function() {
	let start = null;
	try {
		start = SideEffectStep.prototype.next.call(this);
		return start;
	} finally {
		if (!isNull(this.onGraphComputer) && start === null) {
			this.getTraversal().getSideEffects().getValue(this.sideEffectKey).setMetrics(this.getTraversal(), false);
		}
	}
};

ProfileSideEffectStep.prototype.hasNext = function() {
	let start = SideEffectStep.prototype.hasNext.call(this);
	if (!isNull(this.onGraphComputer) && !start) {
		this.getTraversal().getSideEffects().get(this.sideEffectKey).setMetrics(this.getTraversal(), false);
	}
	return start;
};

ProfileSideEffectStep.prototype.generateFinalResult = function(tm) {
	if (this.onGraphComputer)
		tm.setMetrics(this.getTraversal(), true);
	return tm;
};

ProfileSideEffectStep.prototype.onGraphComputer = function() {
	this.onGraphComputer = true;
};

ProfileSideEffectStep.DEFAULT_METRICS_KEY = Hidden.hide("metrics");

export { ProfileSideEffectStep };
