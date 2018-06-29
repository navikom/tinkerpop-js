import { mixin } from '../../../util';
import AbstractLambdaTraversal from './AbstractLambdaTraversal';

/**
 * LoopTraversal
 * @param maxLoops
 * @constructor
 */
function LoopTraversal(maxLoops) {

	this.allow = false;
	this.maxLoops = maxLoops;
}
LoopTraversal.prototype = {
	constructor: LoopTraversal,
	getMaxLoops() {
		return this.maxLoops;
	},

	hasNext() {
		return this.allow;
	},

	addStart(start) {
		this.allow = start.loops() >= this.maxLoops;
	}
};

mixin(LoopTraversal, AbstractLambdaTraversal.prototype);

export default LoopTraversal;