import { mixin, List } from '../../../../util';
import BinaryOperator from '../../../../util/function/BinaryOperator';
import ArrayListSupplier from '../../../../util/function/ArrayListSupplier';
import Operator from '../../Operator';
import ReducingBarrierStep from './../util/ReducingBarrierStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';

const REQUIREMENTS = new List([TraverserRequirement.OBJECT]);

/**
 * FoldStep
 * @param traversal
 * @param seed
 * @param foldFunction
 * @constructor
 */
function FoldStep(traversal, seed, foldFunction) {
	ReducingBarrierStep.call(this, traversal);
	if(seed === undefined && foldFunction === undefined){
		seed = ArrayListSupplier.instance();
		foldFunction = Operator.addAll;
	}

	this.listFold = Operator.addAll === foldFunction;
	this.setSeedSupplier(seed);
	this.setReducingBiOperator(new FoldStep.FoldBiOperator(foldFunction));

}

FoldStep.prototype = Object.create(ReducingBarrierStep.prototype);
FoldStep.prototype.constructor = FoldStep;

FoldStep.prototype.projectTraverser = function(traverser) {
	if (this.listFold) {
		const list = new List();
		for (let i = 0; i < traverser.bulk(); i++) {
			list.add(traverser.get());
		}
		return list;
	} else {
		return traverser.get();
	}
};

FoldStep.prototype.getRequirements = function() {
	return REQUIREMENTS;
};

/**
 * FoldBiOperator
 * @param biFunction
 * @constructor
 */
FoldStep.FoldBiOperator = function(biFunction) {
	this.biFunction = biFunction;
};

FoldStep.FoldBiOperator.prototype = {
	constructor: FoldStep.FoldBiOperator,

	apply(seed, other) {
		return this.biFunction.apply(seed, other);
	}
};

mixin(FoldStep.FoldBiOperator, BinaryOperator.prototype);

export { FoldStep };
