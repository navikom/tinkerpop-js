import { mixin, List, Map } from '../../../../util';
import HashMapSupplier from '../../../../util/function/HashMapSupplier';
import BinaryOperator from '../../../../util/function/BinaryOperator';
import { __ } from '../../dsl/graph';
import ByModulating from '../../ByModulating';
import TraversalParent from '../../step/TraversalParent';
import ReducingBarrierStep from './../util/ReducingBarrierStep';
import TraversalUtil from '../../util/TraversalUtil';
import TraversalHelper from '../../util/TraversalHelper';
import ElementValueTraversal from '../../lambda/ElementValueTraversal';
import TokenTraversal from '../../lambda/TokenTraversal';
import IdentityTraversal from '../../lambda/IdentityTraversal';
import FunctionTraverser from '../../lambda/FunctionTraverser';
import { LambdaMapStep } from './LambdaMapStep';
import { FoldStep } from './FoldStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';
import Barrier from '../Barrier';
import Operator from '../../Operator';

/**
 * GroupStep
 * @param traversal
 * @constructor
 */
function GroupStep(traversal) {
	ReducingBarrierStep.call(this, traversal);
	this.state = 'k';
	this.valueTraversal = this.integrateChild(__.fold().asAdmin());
	this.barrierStep = TraversalHelper.getFirstStepOfAssignableClass(Barrier, this.valueTraversal).orElse(null);
	this.setReducingBiOperator(
		new GroupStep.GroupBiOperator(
			null === this.barrierStep ? Operator.assign : this.barrierStep.getMemoryComputeKey().getReducer()));
	this.setSeedSupplier(HashMapSupplier.instance());
}
GroupStep.prototype = Object.create(ReducingBarrierStep.prototype);
GroupStep.prototype.constructor = GroupStep;

mixin(GroupStep, ByModulating.prototype, TraversalParent.prototype);

GroupStep.prototype.modulateBy = function(kvTraversal) {
	if ('k' === this.state) {
		this.keyTraversal = this.integrateChild(kvTraversal);
		this.state = 'v';
	} else if ('v' === this.state) {
		this.valueTraversal = this.integrateChild(GroupStep.convertValueTraversal(kvTraversal));
		this.barrierStep = TraversalHelper.getFirstStepOfAssignableClass(Barrier, this.valueTraversal).orElse(null);
		this.setReducingBiOperator(
			new GroupStep.GroupBiOperator(
			null === this.barrierStep ? Operator.assign : this.barrierStep.getMemoryComputeKey().getReducer()));
		this.state = 'x';
	} else {
		throw ("The key and value traversals for group()-step have already been set: " + this.constructor.name);
	}
};

GroupStep.prototype.projectTraverser = function(traverser) {
	const map = new Map();
	this.valueTraversal.reset();
	this.valueTraversal.addStart(traverser);
	if (null === this.barrierStep) {
		if (this.valueTraversal.hasNext())
			map.put(TraversalUtil.applyNullable(traverser, this.keyTraversal), this.valueTraversal.next());
	} else if (this.barrierStep.hasNextBarrier())
		map.put(TraversalUtil.applyNullable(traverser, this.keyTraversal), this.barrierStep.nextBarrier());
	return map;
};

GroupStep.prototype.getLocalChildren = function() {
	const children = new List();
	if (null !== this.keyTraversal || this.keyTraversal !== undefined)
		children.add(this.keyTraversal);
	children.add(this.valueTraversal);
	return children;
};

GroupStep.prototype.getRequirements = function() {
	return this.getSelfAndChildRequirements(TraverserRequirement.OBJECT, TraverserRequirement.BULK);
};

GroupStep.prototype.clone = function() {
	const clone = ReducingBarrierStep.prototype.clone.call(this);
	if (null !== this.keyTraversal)
		clone.keyTraversal = this.keyTraversal.clone();
	clone.valueTraversal = this.valueTraversal.clone();
	clone.barrierStep = TraversalHelper.getFirstStepOfAssignableClass(Barrier, clone.valueTraversal).orElse(null);
	return clone;
};

GroupStep.prototype.setTraversal = function(parentTraversal) {
	ReducingBarrierStep.prototype.setTraversal.call(this, parentTraversal);
	this.integrateChild(this.keyTraversal);
	this.integrateChild(this.valueTraversal);
};

GroupStep.prototype.generateFinalResult = function(object) {
	return GroupStep.doFinalReduction(object, this.valueTraversal);
};

/**
 * GroupBiOperator
 * @param barrierAggregator
 * @constructor
 */
GroupStep.GroupBiOperator = function(barrierAggregator) {
	this.barrierAggregator = barrierAggregator;
};

GroupStep.GroupBiOperator.prototype = {
	constructor: GroupStep.GroupBiOperator,

	apply(mapA, mapB) {
		const itB = mapB.keySet();
		while (itB.hasNext()) {
			const key = itB.getKey();
			let objectA = mapA.get(key);
			let objectB = mapB.get(key);
			if (null === objectA || undefined === objectA)
				objectA = objectB;
			else if (null !== objectB && undefined !== objectB){
				objectA = this.barrierAggregator.apply(objectA, objectB);
			}
			mapA.put(key, objectA);
			itB.next();
		}
		return mapA;
	}
};

mixin(GroupStep.GroupBiOperator, BinaryOperator.prototype)


///////////////////////

GroupStep.convertValueTraversal = function(valueTraversal) {
	if (valueTraversal instanceof ElementValueTraversal ||
		valueTraversal instanceof TokenTraversal ||
		valueTraversal instanceof IdentityTraversal ||
		valueTraversal.getStartStep() instanceof LambdaMapStep
		&& valueTraversal.getStartStep().getMapFunction() instanceof FunctionTraverser) {
		return __.map(valueTraversal).fold();
	} else
		return valueTraversal;
};

GroupStep.doFinalReduction = function(map, valueTraversal) {
	TraversalHelper.getFirstStepOfAssignableClass(Barrier, valueTraversal).ifPresent(barrierStep => {
		const it = map.keySet();
		while (it.hasNext()) {
			const key = it.getKey();
			valueTraversal.reset();
			barrierStep.addBarrier(map.get(key));
			if (valueTraversal.hasNext())
				map.put(key, valueTraversal.next());
			it.next();
		}

	});
	return map;
};

export { GroupStep }