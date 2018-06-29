import { mixin, List } from '../../../../util';
import { MapStep } from './MapStep';
import TraversalParent from '../TraversalParent';
import TraversalUtil from '../../util/TraversalUtil';

/**
 * TraversalMapStep
 * @param traversal Traversal.Admin
 * @param mapTraversal Traversal
 * @constructor
 */
function TraversalMapStep(traversal, mapTraversal) {
	MapStep.call(this, traversal);
	this.mapTraversal = this.integrateChild(mapTraversal.asAdmin());
}

TraversalMapStep.prototype = {
	constructor: TraversalMapStep,

	map(traverser) {
		const iterator = TraversalUtil.applyAll(traverser, this.mapTraversal);
		//console.log('TraversalMapStep', traverser, iterator, iterator.hasNext());
		return iterator.hasNext() ? iterator.next() : null;
	},

	getLocalChildren() {
		return new List([this.mapTraversal]);
	},

	clone() {
		const clone = MapStep.prototype.clone.call(this);
		clone.mapTraversal = this.mapTraversal.clone();
		return clone;
	},

	setTraversal(parentTraversal) {
		MapStep.prototype.setTraversal.call(this, parentTraversal);
		this.integrateChild(this.mapTraversal);
	},

	getRequirements() {
		return this.getSelfAndChildRequirements();
	}
};

mixin(TraversalMapStep, MapStep.prototype, TraversalParent.prototype);
export { TraversalMapStep };
