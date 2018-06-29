import { mixin, Map, List } from '../../../../util';
import HashMapSupplier from '../../../../util/function/HashMapSupplier';
import BinaryOperator from '../../../../util/function/BinaryOperator';
import ByModulating from '../../ByModulating';
import TraversalParent from '../../step/TraversalParent';
import ReducingBarrierStep from './../util/ReducingBarrierStep';
import TraversalUtil from '../../util/TraversalUtil';
import TraverserRequirement from '../../traverser/TraverserRequirement';
import MapHelper from '../util/MapHelper';

/**
 *
 * @param traversal
 * @constructor
 */
function GroupCountStep(traversal) {
	ReducingBarrierStep.call(this, traversal);
	this.setSeedSupplier(HashMapSupplier.instance());
	this.setReducingBiOperator(GroupCountStep.GroupCountBiOperator.instance());
}
GroupCountStep.prototype = Object.create(ReducingBarrierStep.prototype);
GroupCountStep.prototype.constructor = GroupCountStep;

mixin(GroupCountStep, TraversalParent.prototype, ByModulating.prototype);

GroupCountStep.prototype.projectTraverser = function(traverser) {
	const map = new Map();
	map.put(TraversalUtil.applyNullable(traverser, this.keyTraversal), traverser.bulk());
	return map;
};

GroupCountStep.prototype.addLocalChild = function(groupTraversal) {
	this.keyTraversal = this.integrateChild(groupTraversal);
};

GroupCountStep.prototype.getLocalChildren = function() {
	return null === this.keyTraversal || undefined === this.keyTraversal
		? new List() : new List([this.keyTraversal]);
};

GroupCountStep.prototype.getRequirements = function() {
	return this.getSelfAndChildRequirements(TraverserRequirement.BULK);
};

GroupCountStep.prototype.modulateBy = function(keyTraversal){
	this.keyTraversal = this.integrateChild(keyTraversal);
};

GroupCountStep.prototype.clone = function() {
	const clone = ReducingBarrierStep.prototype.clone.call(this);
	if (null !== this.keyTraversal && undefined !== this.keyTraversal)
		clone.keyTraversal = this.keyTraversal.clone();
	return clone;
};

GroupCountStep.prototype.setTraversal = function(parentTraversal) {
	ReducingBarrierStep.prototype.setTraversal(parentTraversal);
	this.integrateChild(this.keyTraversal);
};

/**
 * GroupCountBiOperator
 * @param barrierAggregator
 * @constructor
 */
GroupCountStep.GroupCountBiOperator = function() {
};

GroupCountStep.GroupCountBiOperator.prototype = {
	constructor: GroupCountStep.GroupCountBiOperator,

	apply(mutatingSeed, map) {
		const entry = map.keySet();
		while (entry.hasNext()) {
			MapHelper.incr(mutatingSeed, entry.getKey(), entry.getValue());
			entry.next();
		}
		return mutatingSeed;
	}
};

mixin(GroupCountStep.GroupCountBiOperator, BinaryOperator.prototype);

const INSTANCE = new GroupCountStep.GroupCountBiOperator();
GroupCountStep.GroupCountBiOperator.instance = () => INSTANCE;

export { GroupCountStep }