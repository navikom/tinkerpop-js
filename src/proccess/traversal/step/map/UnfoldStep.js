import { List, Map, IteratorUtils } from '../../../../util';
import { FlatMapStep } from './FlatMapStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 *
 * @param traversal
 * @constructor
 */
function UnfoldStep(traversal) {
	FlatMapStep.call(this, traversal);
}
UnfoldStep.prototype = Object.create(FlatMapStep.prototype);
UnfoldStep.prototype.constructor = UnfoldStep;

UnfoldStep.prototype.flatMap = function(traverser) {
	let s = traverser.get();
	if (s instanceof Map)
		return s.keySet();
	else if (s instanceof List)
		return s.iterator();
	else if (Array.isArray(s))
		return this.handleArrays(s);
	else
		return IteratorUtils.of(s);
};

UnfoldStep.prototype.getRequirements = function() {
	return new List([TraverserRequirement.OBJECT]);
};

UnfoldStep.prototype.handleArrays = function(array) {
		return new List(array).iterator();
};

export { UnfoldStep };


