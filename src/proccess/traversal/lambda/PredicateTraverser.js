/**
 * PredicateTraverser
 * @param predicate
 * @constructor
 */
function PredicateTraverser(predicate) {
	this.predicate = predicate;
}

PredicateTraverser.prototype = {
	constructor: PredicateTraverser,

	test(traverser) {
		return this.predicate.test(traverser.get());
	}
};

export default PredicateTraverser;