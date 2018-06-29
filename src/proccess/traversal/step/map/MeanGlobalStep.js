import { mixin, List, NumberHelper, Comparator, isNull } from '../../../../util';
import BinaryOperator from '../../../../util/function/BinaryOperator';
import MeanNumberSupplier from '../../../../util/function/MeanNumberSupplier';
import Operator from '../../Operator';
import ReducingBarrierStep from './../util/ReducingBarrierStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * MeanGlobalStep
 * @param traversal
 * @constructor
 */
function MeanGlobalStep(traversal) {
	ReducingBarrierStep.call(this, traversal);
	this.setSeedSupplier(MeanNumberSupplier.instance());
	this.setReducingBiOperator(MeanGlobalStep.MeanGlobalBiOperator.instance());
}
MeanGlobalStep.prototype = Object.create(ReducingBarrierStep.prototype);
MeanGlobalStep.prototype.constructor = MeanGlobalStep;

MeanGlobalStep.prototype.projectTraverser = function(traverser) {
	return new MeanGlobalStep.MeanNumber(traverser.get(), traverser.bulk());
};

MeanGlobalStep.prototype.getRequirements = function() {
	return new List([TraverserRequirement.OBJECT, TraverserRequirement.BULK]);
};

MeanGlobalStep.prototype.generateFinalResult = function(meanNumber) {
	return meanNumber.getFinal();
};

/////////
/**
 * MeanGlobalBiOperator
 * @constructor
 */
MeanGlobalStep.MeanGlobalBiOperator = function() {};

MeanGlobalStep.MeanGlobalBiOperator.prototype = {
	constructor: MeanGlobalStep.MeanGlobalBiOperator,
	apply(mutatingSeed, number) {
		if (mutatingSeed instanceof MeanGlobalStep.MeanNumber) {
			return (number instanceof MeanGlobalStep.MeanNumber) ?
				mutatingSeed.add(number) : mutatingSeed.add(number, 1);
		} else {
			return (number instanceof MeanGlobalStep.MeanNumber) ?
				number.add(mutatingSeed, 1) : new MeanGlobalStep.MeanNumber(number, 1).add(mutatingSeed, 1);
		}
	},

	toString(){
		return 'MeanGlobalBiOperator';
	}
};

//mixin(MeanGlobalStep.MeanGlobalBiOperator, BinaryOperator.prototype);

const INSTANCE = new MeanGlobalStep.MeanGlobalBiOperator();
MeanGlobalStep.MeanGlobalBiOperator.instance = () => INSTANCE;

//////////
/**
 * MeanNumber
 * @param number
 * @param count
 * @constructor
 */
MeanGlobalStep.MeanNumber = function(number, count) {
	if (isNull(number)) {
		this.count = 0;
		this.sum = 0;
	} else {
		this.count = count;
		this.sum = NumberHelper.mul(number, count);
	}
};

MeanGlobalStep.MeanNumber.prototype = {
	constructor: MeanGlobalStep.MeanNumber,

	add(other) {
		this.count += other.count;
		this.sum = NumberHelper.add(this.sum, other.sum);
		return this;
	},

	intValue() {
		return NumberHelper.div(this.sum, this.count);
	},

	longValue() {
		return NumberHelper.div(this.sum, this.count);
	},

	floatValue() {
		return NumberHelper.div(this.sum, this.count, true);
	},

	doubleValue() {
		return NumberHelper.div(this.sum, this.count, true);
	},

	toString() {
		return this.getFinal().toString();
	},

	compareTo(number) {
		return Comparator.compare(doubleValue(), number.doubleValue());
	},

	equals(object) {
		return object instanceof Number && this.doubleValue() === object;
	},


	getFinal() {
		return NumberHelper.div(this.sum, this.count, true);
	},

	toString(){
		return 'MeanNumber';
	}
};

export { MeanGlobalStep };
