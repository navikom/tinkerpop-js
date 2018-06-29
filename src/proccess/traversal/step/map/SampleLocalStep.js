import { List, Map, NumberHelper, getRandomArbitrary } from '../../../../util';
import { MapStep } from './MapStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * SampleLocalStep
 * @param traversal
 * @param amountToSample
 * @constructor
 */
function SampleLocalStep(traversal, amountToSample) {
	MapStep.call(this, traversal);
	this.amountToSample = amountToSample;
}

SampleLocalStep.prototype = Object.create(MapStep.prototype);
SampleLocalStep.prototype.constructor = SampleLocalStep;

SampleLocalStep.prototype.map = function(traverser) {
	const start = traverser.get();
	if (start instanceof Map) {
		return this.mapMap(start);
	} else if (start instanceof List) {
		return this.mapCollection(start);
	} else {
		return start;
	}
};

SampleLocalStep.prototype.mapCollection = function(collection) {
	if (collection.size() <= this.amountToSample)
		return collection;

	const original = collection.clone();
	const target = new List();
	while (target.size() < this.amountToSample) {
		target.add(original.remove(getRandomArbitrary(0, original.size())));
	}
	return target;
};

SampleLocalStep.prototype.mapMap = function(map) {
	if (map.size() <= this.amountToSample)
		return map;

	const original = map.clone().keySet();
	const target = new Map();
	while (target.size() < this.amountToSample) {
		target.put(original.getKey(), original.getValue());
		original.remove(getRandomArbitrary(0, original.size()));

		original.next();
	}
	return target;
};

SampleLocalStep.prototype.getRequirements = function() {
	return Collections.singleton(TraverserRequirement.OBJECT);
};

export { SampleLocalStep };
