import { mixin, List, IteratorUtils, isNull } from '../../../../util';
import Traversal from '../../Traversal';
import TraversalParent from '../TraversalParent';
import ComputerAwareStep from './../util/ComputerAwareStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';
import TraversalUtil from '../../util/TraversalUtil';

/**
 * RepeatStep
 * @param traversal
 * @constructor
 */
function RepeatStep(traversal) {
	ComputerAwareStep.call(this, traversal);

	this.repeatTraversal = null;
	this.untilTraversal = null;
	this.emitTraversal = null;
	this.untilFirst = false;
	this.emitFirst = false;
}
RepeatStep.prototype = {
	constructor: RepeatStep,

	getRequirements() {
		const requirements = this.getSelfAndChildRequirements(TraverserRequirement.BULK);
		if (requirements.contains(TraverserRequirement.SINGLE_LOOP))
			requirements.add(TraverserRequirement.NESTED_LOOP);
		requirements.add(TraverserRequirement.SINGLE_LOOP);
		return requirements;
	},

	setRepeatTraversal(repeatTraversal) {
		if (!isNull(this.repeatTraversal))
			throw ("The repeat()-step already has its loop section declared");
		this.repeatTraversal = repeatTraversal; // .clone();
		Traversal.prototype.addStep.call(this.repeatTraversal, new RepeatStep.RepeatEndStep(this.repeatTraversal));
		this.integrateChild(this.repeatTraversal);
	},

	setUntilTraversal(untilTraversal) {
		if (!isNull(this.untilTraversal))
			throw ("The repeat()-step already has its until()-modulator declared");
		if (isNull(this.repeatTraversal)) this.untilFirst = true;
		this.untilTraversal = this.integrateChild(untilTraversal);

	},

	getUntilTraversal() {
		return this.untilTraversal;
	},

	setEmitTraversal(emitTraversal) {
		if (!isNull(this.emitTraversal))
			throw ("The repeat()-step already has its emit()-modulator declared");
		if (isNull(this.repeatTraversal)) this.emitFirst = true;
		this.emitTraversal = this.integrateChild(emitTraversal);
	},

	getEmitTraversal() {
		return this.emitTraversal;
	},

	getRepeatTraversal() {
		return this.repeatTraversal;
	},

	getGlobalChildren() {
		return isNull(this.repeatTraversal) ? new List() : new List([this.repeatTraversal]);
	},

	getLocalChildren() {
		const list = new List();
		if (!isNull(this.untilTraversal))
			list.add(this.untilTraversal);
		if (!isNull(this.emitTraversal))
			list.add(this.emitTraversal);
		return list;
	},

	doUntil(traverser, utilFirst) {
		return utilFirst === this.untilFirst && !isNull(this.untilTraversal) && TraversalUtil.test(traverser, this.untilTraversal);
	},

	doEmit(traverser, emitFirst) {
		return emitFirst === this.emitFirst && !isNull(this.emitTraversal) && TraversalUtil.test(traverser, this.emitTraversal);
	},


	untilString() {
		return isNull(this.untilTraversal) ? "until(false)" : "until(" + this.untilTraversal + ')';
	},

	emitString() {
		return isNull(this.emitTraversal) ? "emit(false)" : "emit(" + this.emitTraversal + ')';
	},

	/////////////////////////

	setTraversal(parentTraversal) {
		ComputerAwareStep.prototype.setTraversal.call(this, parentTraversal);
		this.integrateChild(this.repeatTraversal);
		this.integrateChild(this.untilTraversal);
		this.integrateChild(this.emitTraversal);
	},

	standardAlgorithm() {
		while (true) {
			if (this.repeatTraversal.getEndStep().hasNext()) {
				return this.repeatTraversal.getEndStep();
			} else {
				const start = this.starts.next();
				if (this.doUntil(start, true)) {
					start.resetLoops();
					return IteratorUtils.of(start);
				}
				this.repeatTraversal.addStart(start);
				if (this.doEmit(start, true)) {
					const emitSplit = start.split();
					emitSplit.resetLoops();
					return IteratorUtils.of(emitSplit);
				}
			}
		}
	},

	computerAlgorithm() {
		const start = this.starts.next();
		if (this.doUntil(start, true)) {
			start.resetLoops();
			start.setStepId(this.getNextStep().getId());
			start.addLabels(this.labels);
			return IteratorUtils.of(start);
		} else {
			start.setStepId(this.repeatTraversal.getStartStep().getId());
			if (this.doEmit(start, true)) {
				const emitSplit = start.split();
				emitSplit.resetLoops();
				emitSplit.setStepId(this.getNextStep().getId());
				return IteratorUtils.of(start, emitSplit);
			} else {
				return IteratorUtils.of(start);
			}
		}
	},
	reset() {
		ComputerAwareStep.prototype.reset.call(this);
		if (!isNull(this.emitTraversal))
			this.emitTraversal.reset();
		if (!isNull(this.untilTraversal))
			this.untilTraversal.reset();
		if (!isNull(this.repeatTraversal))
			this.repeatTraversal.reset();
	}
};

mixin(RepeatStep, ComputerAwareStep.prototype, TraversalParent.prototype);

/////////////////////////

RepeatStep.addRepeatToTraversal = (traversal, repeatTraversal) => {
	const step = Traversal.prototype.getEndStep.call(traversal);

	if (step instanceof RepeatStep && isNull(step.repeatTraversal)) {
		step.setRepeatTraversal(repeatTraversal);
	} else {
		const repeatStep = new RepeatStep(traversal.asAdmin());
		repeatStep.setRepeatTraversal(repeatTraversal);
		Traversal.prototype.addStep.call(traversal.asAdmin(), repeatStep);
	}

	return traversal;
};

RepeatStep.addUntilToTraversal = (traversal, untilPredicate) => {
	const step = Traversal.prototype.getEndStep.call(traversal);
	if (step instanceof RepeatStep && isNull(step.untilTraversal)) {
		step.setUntilTraversal(untilPredicate);
	} else {
		const repeatStep = new RepeatStep(traversal.asAdmin());
		repeatStep.setUntilTraversal(untilPredicate);
		Traversal.prototype.addStep.call(traversal.asAdmin(), repeatStep);
	}
	return traversal;
};

RepeatStep.addEmitToTraversal = (traversal, emitPredicate) => {
	const step = Traversal.prototype.getEndStep.call(traversal);
	if (step instanceof RepeatStep && isNull(step.emitTraversal)) {
		step.setEmitTraversal(emitPredicate);
	} else {
		const repeatStep = new RepeatStep(traversal.asAdmin());
		repeatStep.setEmitTraversal(emitPredicate);
		Traversal.prototype.addStep.call(traversal.asAdmin(), repeatStep);
	}
	return traversal;
};

///////////
/**
 * RepeatEndStep
 * @param traversal
 * @constructor
 */
RepeatStep.RepeatEndStep = function(traversal) {
	ComputerAwareStep.call(this, traversal);
};

RepeatStep.RepeatEndStep.prototype = {
	constructor: RepeatStep.RepeatEndStep,

	standardAlgorithm() {
		const repeatStep = this.getTraversal().getParent();
		while (true) {
			const start = this.starts.next();
			start.incrLoops(this.getId());
			if (repeatStep.doUntil(start, false)) {
				start.resetLoops();
				return IteratorUtils.of(start);
			} else {
				if (isNull(repeatStep.untilFirst))
					repeatStep.repeatTraversal.addStart(start);
				else
					repeatStep.addStart(start);
				if (repeatStep.doEmit(start, false)) {
					const emitSplit = start.split();
					emitSplit.resetLoops();
					return IteratorUtils.of(emitSplit);
				}
			}
		}
	},

	computerAlgorithm() {
		const repeatStep = this.getTraversal().getParent();
		const start = this.starts.next();
		start.incrLoops(repeatStep.getId());
		if (repeatStep.doUntil(start, false)) {
			start.resetLoops();
			start.setStepId(repeatStep.getNextStep().getId());
			start.addLabels(repeatStep.labels);
			return IteratorUtils.of(start);
		} else {
			start.setStepId(repeatStep.getId());
			if (repeatStep.doEmit(start, false)) {
				const emitSplit = start.split();
				emitSplit.resetLoops();
				emitSplit.setStepId(repeatStep.getNextStep().getId());
				emitSplit.addLabels(repeatStep.labels);
				return IteratorUtils.of(start, emitSplit);
			}
			return IteratorUtils.of(start);
		}
	},

	toString() {
		return 'RepeatEndStep';
	}
};

mixin(RepeatStep.RepeatEndStep, ComputerAwareStep.prototype);


export { RepeatStep };
