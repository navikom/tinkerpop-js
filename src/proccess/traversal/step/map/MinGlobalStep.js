import { List, NumberHelper } from '../../../../util';
import ConstantSupplier from '../../../../util/function/ConstantSupplier';
import Operator from '../../Operator';
import ReducingBarrierStep from './../util/ReducingBarrierStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * MinGlobalStep
 * @param traversal
 * @constructor
 */
function MinGlobalStep(traversal) {
	ReducingBarrierStep.call(this, traversal);
	this.setSeedSupplier(new ConstantSupplier(Number.MAX_VALUE));
	this.setReducingBiOperator(Operator.min);
}

MinGlobalStep.prototype = Object.create(ReducingBarrierStep.prototype);
MinGlobalStep.prototype.constructor = MinGlobalStep;
MinGlobalStep.prototype.projectTraverser = function(traverser) {
	return traverser.get();
};

MinGlobalStep.prototype.getRequirements = function() {
	return new List([TraverserRequirement.OBJECT]);
};

export { MinGlobalStep };