import { List, NumberHelper } from '../../../../util';
import { MapStep } from './MapStep';
import { RangeLocalStep } from './RangeLocalStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';
import StringFactory from '../../../../structure/util/StringFactory';

/**
 *
 * @param traversal
 * @param limit
 * @constructor
 */
function TailLocalStep(traversal, limit) {
	MapStep.call(this, traversal);
	this.limit = limit;
}

TailLocalStep.prototype = Object.create(MapStep.prototype);
TailLocalStep.prototype.constructor = TailLocalStep;

TailLocalStep.prototype.map = function(traverser) {
	// We may consider optimizing the iteration of these containers using subtype-specific interfaces.  For
	// example, we could use descendingIterator if we have a Deque.  But in general, we cannot reliably iterate a
	// collection in reverse, so we use the range algorithm with dynamically computed boundaries.
	const start = traverser.get();
	const high = start.size ? start.size() : this.limit;
	const low = high - this.limit;
	const result = RangeLocalStep.applyRange(start, low, high);
	return result;
};

TailLocalStep.prototype.toString = function() {
	return StringFactory.stepString(this, this.limit);
};

TailLocalStep.prototype.getRequirements = function() {
	return new List([TraverserRequirement.OBJECT]);
};

export { TailLocalStep };