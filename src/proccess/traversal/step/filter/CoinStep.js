import { mixin, List } from '../../../../util';
import { FilterStep } from './FilterStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * CoinStep
 * @param traversal
 * @param probability
 * @constructor
 */
function CoinStep(traversal, probability) {
	FilterStep.call(this, traversal);
	this.probability = probability;
}

CoinStep.prototype = Object.create(FilterStep.prototype);
CoinStep.prototype.constructor = CoinStep;

CoinStep.prototype.filter = function(traverser) {
	let newBulk = 0;
	if (traverser.bulk() < 100) {
		for (let i = 0; i < traverser.bulk(); i++) {
			if (this.probability >= Math.random())
				newBulk++;
		}
	} else {
		newBulk = Math.round(this.probability * traverser.bulk());
	}
	if (0 === newBulk) return false;
	traverser.setBulk(newBulk);
	return true;
};

CoinStep.prototype.getRequirements = function() {
	return new List([TraverserRequirement.BULK]);
};

//////

CoinStep.choose = (x, y) =>  {
	if (y < 0 || y > x) return 0;
	if (y > x / 2) {
		y = x - y;
	}
	let denominator = 1.0, numerator = 1.0;
	for (let i = 1; i <= y; i++) {
		denominator *= i;
		numerator *= (x + 1 - i);
	}
	return numerator / denominator;
};

export { CoinStep };

