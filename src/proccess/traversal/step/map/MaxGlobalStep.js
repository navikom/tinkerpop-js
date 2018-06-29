import { List, NumberHelper } from '../../../../util';
import ConstantSupplier from '../../../../util/function/ConstantSupplier';
import Operator from '../../Operator';
import ReducingBarrierStep from './../util/ReducingBarrierStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * MaxGlobalStep
 * @param traversal
 * @constructor
 */
function MaxGlobalStep(traversal) {
	ReducingBarrierStep.call(this, traversal);
	this.setSeedSupplier(new ConstantSupplier(Number.MIN_VALUE));
	this.setReducingBiOperator(Operator.max);
}

MaxGlobalStep.prototype = Object.create(ReducingBarrierStep.prototype);
MaxGlobalStep.prototype.constructor = MaxGlobalStep;

MaxGlobalStep.prototype.projectTraverser = function(traverser) {
	return traverser.get();
};

MaxGlobalStep.prototype.getRequirements = function() {
	return new List([TraverserRequirement.OBJECT]);
};

export { MaxGlobalStep };
