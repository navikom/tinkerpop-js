import { mixin, ArrayUtils, List } from '../../../../util';
import TraversalParent from '../TraversalParent';
import TraversalUtil from '../../util/TraversalUtil';
import { FilterStep } from './FilterStep';
import StringFactory from '../../../../structure/util/StringFactory';

/**
 * NotStep
 * @param traversal
 * @param notTraversal
 * @constructor
 */
function NotStep(traversal, notTraversal) {
	FilterStep.call(this, traversal);
	this.notTraversal = this.integrateChild(notTraversal.asAdmin());
}

NotStep.prototype = {
	constructor: NotStep,

	filter(traverser) {
		return !TraversalUtil.test(traverser, this.notTraversal);
	},

	getLocalChildren() {
		return new List([this.notTraversal]);
	},

	clone() {
		const clone = FilterStep.prototype.clone.call(this);
		clone.notTraversal = this.notTraversal.clone();
		return clone;
	},

	setTraversal(parentTraversal) {
		FilterStep.prototype.setTraversal.call(this, parentTraversal);
		this.integrateChild(this.notTraversal);
	},

	getRequirements() {
		return this.getSelfAndChildRequirements();
	},

	toString() {
		return StringFactory.stepString(this, this.notTraversal);
	}

};

mixin(NotStep, FilterStep.prototype, TraversalParent.prototype);

export { NotStep };
