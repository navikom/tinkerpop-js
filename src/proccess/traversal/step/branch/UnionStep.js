import { ArrayUtils } from '../../../../util';
import { BranchStep } from './BranchStep';
import ConstantTraversal from '../../lambda/ConstantTraversal';
import Pick from '../Pick';

/**
 * UnionStep
 * @param traversal
 * @param unionTraversals
 * @constructor
 */
function UnionStep(traversal, ...unionTraversals) {
	BranchStep.call(this, traversal);
	this.setBranchTraversal(new ConstantTraversal(Pick.any));
	ArrayUtils.checkArray(unionTraversals).map((t) => this.addGlobalChildOption(Pick.any, t));

}

UnionStep.prototype = Object.create(BranchStep.prototype);
UnionStep.prototype.constructor = UnionStep;

UnionStep.prototype.addGlobalChildOption = function(pickToken, traversalOption) {
	if (Pick.any !== pickToken)
		throw ("Union step only supports the any token: " + pickToken);
	BranchStep.prototype.addGlobalChildOption.call(this, pickToken, traversalOption);
};

export { UnionStep }