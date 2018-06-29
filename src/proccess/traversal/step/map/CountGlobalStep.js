import { List } from '../../../../util';
import ConstantSupplier from '../../../../util/function/ConstantSupplier';
import Operator from '../../Operator';
import ReducingBarrierStep from './../util/ReducingBarrierStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';
import Barrier from '../Barrier';

const REQUIREMENTS = new List([TraverserRequirement.BULK]);

/**
 * CountGlobalStep
 * @param traversal
 * @constructor
 */
function CountGlobalStep(traversal) {
  ReducingBarrierStep.call(this, traversal);
  this.setSeedSupplier(new ConstantSupplier(0));
  this.setReducingBiOperator(Operator.sumLong);

}
CountGlobalStep.prototype = Object.create(ReducingBarrierStep.prototype);
CountGlobalStep.prototype.constructor = CountGlobalStep;

CountGlobalStep.prototype.projectTraverser = function(traverser) {
  return traverser.bulk();
};

CountGlobalStep.prototype.getRequirements = function() {
  return REQUIREMENTS;
};

export { CountGlobalStep };

