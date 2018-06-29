import { ArrayUtils, isNull } from '../../../../util';
import Traversal from '../../Traversal';
import { BranchStep } from './BranchStep';
import { HasNextStep } from '../../step/map';
import Pick from '../Pick';

/**
 * ChooseStep
 * @param traversal
 * @param predicateTraversal
 * @param trueChoice
 * @param falseChoice
 * @constructor
 */
function ChooseStep(traversal, predicateTraversal, trueChoice, falseChoice) {
	BranchStep.call(this, traversal);
	let choiceTraversal;

	if(isNull(trueChoice)){
		choiceTraversal = predicateTraversal
	} else {
		choiceTraversal = Traversal.prototype.addStep.call(predicateTraversal, new HasNextStep(predicateTraversal));
		this.addGlobalChildOption(true, trueChoice);
		this.addGlobalChildOption(false, falseChoice);
	}

	this.setBranchTraversal(choiceTraversal);
}

ChooseStep.prototype = Object.create(BranchStep.prototype);
ChooseStep.prototype.constructor = ChooseStep;

ChooseStep.prototype.addGlobalChildOption = function(pickToken, traversalOption) {
	if (Pick.any === pickToken)
		throw ("Choose step can not have an any-option as only one option per traverser is allowed");
	if (this.traversalOptions.containsKey(pickToken))
		throw ("Choose step can only have one traversal per pick token: " + pickToken);
	BranchStep.prototype.addGlobalChildOption.call(this, pickToken, traversalOption);
};

export { ChooseStep }
