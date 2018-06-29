import { isNull } from '../../../util';

import AbstractLambdaTraversal from './AbstractLambdaTraversal';
import TraversalUtil from '../util/TraversalUtil';

/**
 * ElementValueTraversal
 * @param propertyKey
 * @constructor
 */
function ElementValueTraversal(propertyKey) {

	this.propertyKey = propertyKey;
}

ElementValueTraversal.prototype = Object.create(AbstractLambdaTraversal.prototype);
ElementValueTraversal.prototype.constructor = ElementValueTraversal;

ElementValueTraversal.prototype.next = function() {
	return this.value;
};

ElementValueTraversal.prototype.hasNext = function() {
	return true;
};

ElementValueTraversal.prototype.addStart = function(start) {
	this.value = !this.bypassTraversal ?
		start.get().value(this.propertyKey) :
		TraversalUtil.apply(start, this.bypassTraversal);
};

ElementValueTraversal.prototype.getPropertyKey = function() {
	return this.propertyKey;
};

ElementValueTraversal.prototype.toString = function() {
	return "value(" + (isNull(this.bypassTraversal) ? this.propertyKey : this.bypassTraversal) + ')';
};

export default ElementValueTraversal;
