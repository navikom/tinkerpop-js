import { mixin } from '../../../util';
import AbstractLambdaTraversal from './AbstractLambdaTraversal';
import TraversalUtil from '../util/TraversalUtil';

/**
 * TokenTraversal
 * @param t
 * @constructor
 */
function TokenTraversal(t) {

	this.t = t;
}
TokenTraversal.prototype = {
	constructor: TokenTraversal,
	next() {
		return this.e;
	},

	addStart(start) {
		this.e = this.t.apply(start.get());
	},

	getToken() {
		return this.t;
	}
};

mixin(TokenTraversal, AbstractLambdaTraversal.prototype);

export default TokenTraversal;
