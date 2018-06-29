
/**
 * FunctionTraverser
 * @param func
 * @constructor
 */
function FunctionTraverser(func) {

	this.func = func;
}
FunctionTraverser.prototype = {
	constructor: FunctionTraverser,
	apply(traverser) {
		return this.func.apply(traverser);
	}
};

export default FunctionTraverser;
