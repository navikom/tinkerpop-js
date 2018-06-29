import { mixin } from '../../../util';
import AbstractLambdaTraversal from './AbstractLambdaTraversal';

/**
 * IdentityTraversal
 * @constructor
 */
function IdentityTraversal() {

}

IdentityTraversal.prototype = {
	constructor: IdentityTraversal,
	next() {
		return this.s;
	},

	addStart(start) {
		this.s = start;
	}
};

mixin(IdentityTraversal, AbstractLambdaTraversal.prototype);

export default IdentityTraversal;
