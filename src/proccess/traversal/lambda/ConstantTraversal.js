import AbstractLambdaTraversal from './AbstractLambdaTraversal';

/**
 * ConstantTraversal
 * @param end
 * @constructor
 */
function ConstantTraversal(end) {
	this.end = end;
}

ConstantTraversal.prototype = Object.create(AbstractLambdaTraversal.prototype);
ConstantTraversal.prototype.constructor = ConstantTraversal;

ConstantTraversal.prototype.next = function() {
	return this.end;
};

ConstantTraversal.prototype.toString = function() {
	return "(" + this.end.toString() + ")";
};

export default ConstantTraversal;
