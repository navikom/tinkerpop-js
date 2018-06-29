import { mixin, List, Map } from '../../../../util';
import { MapStep } from './MapStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * RangeLocalStep
 * @param traversal
 * @param low
 * @param high
 * @constructor
 */
function RangeLocalStep(traversal, low, high) {
	MapStep.call(this, traversal);
	if (low !== -1 && high !== -1 && low > high) {
		throw ("Not a legal range: [" + low + ", " + high + ']');
	}
	this.low = low;
	this.high = high;
}

RangeLocalStep.prototype = {
	constructor: RangeLocalStep,
	map(traverser) {
	const start = traverser.get();
	return RangeLocalStep.applyRange(start, this.low, this.high);
},

	getRequirements() {
		return new List([TraverserRequirement.OBJECT]);
	}
};

mixin(RangeLocalStep, MapStep.prototype);

RangeLocalStep.applyRange = (start, low, high) => {
	if (start instanceof Map) {
		return RangeLocalStep.applyRangeMap(start, low, high);
	} else if (start instanceof List){
		return RangeLocalStep.applyRangeIterable(start, low, high);
	}
	return start;
};

/**
 * Extracts specified range of elements from a Map.
 */
RangeLocalStep.applyRangeMap = (map, low, high) => {
	const result = new Map();
	let c = 0;
	const entry = map.keySet();
	while (entry.hasNext()){
		if (c >= low) {
			if (c < high || high === -1) {
				result.put(entry.getKey(), entry.getValue());
			} else break;
		}
		c++;
		entry.next();
	}
	return result;
};

RangeLocalStep.applyRangeIterable = (iterable, low, high) => {
	// See if we only want a single item.  It is also possible that we will allow more than one item, but that the
	// incoming container is only capable of producing a single item.  In that case, we will still emit a
	// container.  This allows the result type to be predictable based on the step arguments.  It also allows us to
	// avoid creating the result container for the single case.
	let single = high !== -1 ? (high - low === 1) : false;

	const resultCollection =
		single ? null : new List();
	let result = single ? null : resultCollection;

	for (let c = 0; c < iterable.size(); c++) {
		const item = iterable.get(c);
		if (c >= low) {
			if (c < high || high === -1) {
				if (single) {
					result = item;
					break;
				} else {
					resultCollection.add(item);
				}
			} else break;
		}
	}
	if (null === result)
	// We have nothing to emit, so stop traversal.
		throw ("No Such Element Exception");

	console.log(result, iterable)
	return result;
};

export { RangeLocalStep };
