import { mixin, ArrayUtils, List } from '../../../../util';
import Traversal from '../../Traversal';
import TraversalParent from '../TraversalParent';
import Pop from '../../Pop';
import TraversalHelper from '../../util/TraversalHelper';
import TraversalUtil from '../../util/TraversalUtil';
import Scoping from '../Scoping';
import PathProcessor from '../PathProcessor';
import ProfileStep from '../util/ProfileStep';
import { ConnectiveStrategy } from '../../strategy/decoration';
import { MapStep } from '../map';
import { StartStep } from '../sideEffects';
import { FilterStep } from './FilterStep';
import { ConnectiveStep } from './ConnectiveStep';
import { NotStep } from './NotStep';

/**
 * WhereTraversalStep
 * @param traversal
 * @param whereTraversal
 * @constructor
 */
function WhereTraversalStep(traversal, whereTraversal) {
	FilterStep.call(this, traversal);
	this.scopeKeys = new List();
	this.whereTraversal = whereTraversal.asAdmin();
	this.configureStartAndEndSteps(this.whereTraversal);
	if (this.scopeKeys.isEmpty())
		throw ("A where()-traversal must have at least a start or end label (i.e. variable): " + whereTraversal.constructor.name);
	this.whereTraversal = this.integrateChild(this.whereTraversal);
}

WhereTraversalStep.prototype = {
	constructor: WhereTraversalStep,

	configureStartAndEndSteps(whereTraversal) {
		ConnectiveStrategy.instance().apply(whereTraversal);
		//// START STEP to WhereStartStep
		const startStep = whereTraversal.getStartStep();
		if (startStep instanceof ConnectiveStep || startStep instanceof NotStep) {       // for conjunction- and not-steps
			startStep.getLocalChildren().forEach((child) => this.configureStartAndEndSteps(child));
		} else if (StartStep.isVariableStartStep(startStep)) {  // as("a").out()... traversals
			const label = startStep.getLabels().iterator().next();
			this.scopeKeys.add(label);
			TraversalHelper.replaceStep(startStep, new WhereTraversalStep.WhereStartStep(whereTraversal, label), whereTraversal);
		} else if (!whereTraversal.getEndStep().getLabels().isEmpty()) {                    // ...out().as("a") traversals
			TraversalHelper.insertBeforeStep(new WhereTraversalStep.WhereStartStep(whereTraversal, null), startStep, whereTraversal);
		}
		//// END STEP to WhereEndStep
		const endStep = whereTraversal.getEndStep();
		if (!endStep.getLabels().isEmpty()) {
			if (endStep.getLabels().size() > 1)
				throw ("The end step of a where()-traversal can only have one label: " + endStep.constructor.name);
			const label = endStep.getLabels().iterator().next();
			this.scopeKeys.add(label);
			endStep.removeLabel(label);
			Traversal.prototype.addStep.call(whereTraversal, new WhereTraversalStep.WhereEndStep(whereTraversal, label));
		}
	},

	getMaxRequirement() {
		return TraversalHelper.getVariableLocations(this.whereTraversal).contains(Scoping.Variable.START) ?
			this.getMaxRequirement() :
			PathProcessor.ElementRequirement.ID;
	},

	processNextStart() {
		return PathProcessor.processTraverserPathLabels(FilterStep.prototype.processNextStart.call(this), this.keepLabels);
	},

	filter(traverser) {
		return TraversalUtil.test(traverser, this.whereTraversal);
	},

	getLocalChildren() {
		return null === this.whereTraversal ? new List() : new List([this.whereTraversal]);
	},

	getScopeKeys() {
		return this.scopeKeys;
	},

	clone() {
		const clone = FilterStep.prototype.clone.call(this);
		clone.whereTraversal = this.whereTraversal.clone();
		return clone;
	},

	setTraversal(parentTraversal) {
		FilterStep.prototype.setTraversal.call(this, parentTraversal);
		this.integrateChild(this.whereTraversal);
	},

	getRequirements() {
		return TraversalHelper.getLabels(
			TraversalHelper.getRootTraversal(this.getTraversal())).iterator()
			.filter((item) => this.scopeKeys.contains(item.getValue())).size() > 0 ?
			Scoping.TYPICAL_GLOBAL_REQUIREMENTS :
			Scoping.TYPICAL_LOCAL_REQUIREMENTS;
	},

	setKeepLabels(keepLabels) {
		this.keepLabels = keepLabels;
	},

	getKeepLabels() {
		return this.keepLabels;
	}
};

mixin(WhereTraversalStep, FilterStep.prototype, TraversalParent.prototype, Scoping.prototype, PathProcessor.prototype);

//////////////////////////////

/**
 * WhereStartStep
 * @param traversal
 * @param selectKey
 * @constructor
 */
WhereTraversalStep.WhereStartStep = function(traversal, selectKey) {
	MapStep.call(this, traversal);
	this.selectKey = selectKey;
};

WhereTraversalStep.WhereStartStep.prototype = {
	constructor: WhereTraversalStep.WhereStartStep,

	map(traverser) {
		if (this.getTraversal().getEndStep() instanceof WhereTraversalStep.WhereEndStep)
			this.getTraversal().getEndStep().processStartTraverser(traverser);
		else if (this.getTraversal().getEndStep() instanceof ProfileStep
			&& this.getTraversal().getEndStep().getPreviousStep() instanceof WhereTraversalStep.WhereEndStep)     // TOTAL SUCKY HACK!
			this.getTraversal().getEndStep().getPreviousStep().processStartTraverser(traverser);
		const result = null === this.selectKey ? traverser : this.getScopeValue(Pop.last, this.selectKey, traverser);
		return result;
	},


	removeScopeKey() {
		this.selectKey = null;
	},

	getScopeKeys() {
		return null === this.selectKey ? new List() : new List([this.selectKey]);
	}
};

mixin(WhereTraversalStep.WhereStartStep, MapStep.prototype, Scoping.prototype);

/**
 * WhereEndStep
 * @param traversal
 * @param matchKey
 * @constructor
 */
WhereTraversalStep.WhereEndStep = function(traversal, matchKey) {
	FilterStep.call(this, traversal);
	this.matchValue = null;
	this.matchKey = matchKey;
};

WhereTraversalStep.WhereEndStep.prototype = {
	constructor: WhereTraversalStep.WhereEndStep,

	processStartTraverser(traverser) {
		if (null !== this.matchKey)
			this.matchValue = this.getScopeValue(Pop.last, this.matchKey, traverser);
	},

	filter(traverser) {
		return null === this.matchKey || traverser.get() === this.matchValue;
	},

	getScopeKeys() {
		return null === this.matchKey ? new List() : new List([this.matchKey]);
	}
};

mixin(WhereTraversalStep.WhereEndStep, FilterStep.prototype, Scoping.prototype);

export { WhereTraversalStep };

