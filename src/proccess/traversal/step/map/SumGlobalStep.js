import { List, NumberHelper } from '../../../../util';
import ConstantSupplier from '../../../../util/function/ConstantSupplier';
import Operator from '../../Operator';
import ReducingBarrierStep from './../util/ReducingBarrierStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';

const REQUIREMENTS = new List([TraverserRequirement.BULK, TraverserRequirement.OBJECT]);

/**
 * SumGlobalStep
 * @param traversal
 * @constructor
 */
function SumGlobalStep(traversal) {
	ReducingBarrierStep.call(this, traversal);
	this.setSeedSupplier(new ConstantSupplier(0));
	this.setReducingBiOperator(Operator.sum);
}

SumGlobalStep.prototype = Object.create(ReducingBarrierStep.prototype);
SumGlobalStep.prototype.constructor = SumGlobalStep;
SumGlobalStep.prototype.projectTraverser = function(traverser) {
	return NumberHelper.mul(traverser.get(), traverser.bulk());
};
SumGlobalStep.prototype.getRequirements = function() {
	return REQUIREMENTS;
};

export { SumGlobalStep };
