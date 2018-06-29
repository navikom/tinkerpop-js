import { isNull } from '../../../../util';
import AbstractStep from './../util/AbstractStep';
import TraversalHelper from '../../util/TraversalHelper';
import MutableMetrics from '../../util/MutableMetrics';

/**
 * ProfileStep
 * @param traversal
 * @constructor
 */
function ProfileStep(traversal) {
	AbstractStep.call(this, traversal);
}

ProfileStep.prototype = Object.create(AbstractStep.prototype);
ProfileStep.prototype.constructor = ProfileStep;

ProfileStep.prototype.getMetrics = function() {
	return this.metrics;
};

ProfileStep.prototype.next = function() {
	let start = null;
	this.initializeIfNeeded();
	this.metrics.start();
	try {
		start = AbstractStep.prototype.next.call(this);
		return start;
	} finally {
		if (start !== null) {
			this.metrics.finish(start.bulk());
			if (this.onGraphComputer) {
				this.getTraversal().getSideEffects().add(this.getId(), this.metrics);
				this.metrics = null;
			}
		} else {
			this.metrics.stop();
			if (this.onGraphComputer) {
				this.getTraversal().getSideEffects().add(this.getId(), this.metrics);
				this.metrics = null;
			}
		}
	}
};

ProfileStep.prototype.hasNext = function() {
	this.initializeIfNeeded();
	this.metrics.start();
	let ret = AbstractStep.prototype.hasNext.call(this);
	this.metrics.stop();
	return ret;
};

ProfileStep.prototype.processNextStart = function() {
	return this.starts.next();
};

ProfileStep.prototype.initializeIfNeeded = function() {
	if (isNull(this.metrics)) {
		this.onGraphComputer = false;
		this.metrics = new MutableMetrics(
			this.getPreviousStep().getId(),
			this.getPreviousStep().toString().includes('object Object')
				? this.getPreviousStep().constructor.name : this.getPreviousStep().toString()
		);
		const previousStep = this.getPreviousStep();
		if (previousStep.profileType)
			previousStep.setMetrics(this.metrics);
	}
};

ProfileStep.prototype.getMemoryComputeKey = function() {
	//return MemoryComputeKey.of(this.getId(), ProfileBiOperator.instance(), false, true);
};

ProfileStep.prototype.clone = function() {
	const clone = AbstractStep.prototype.clone.call(this);
	clone.metrics = null;
	return clone;
};

export default ProfileStep;