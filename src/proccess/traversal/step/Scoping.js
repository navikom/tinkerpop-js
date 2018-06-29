import { Map, List } from '../../../util';
import TraverserRequirement from '../traverser/TraverserRequirement';

/**
 * Scoping
 * @constructor
 */
function Scoping() {}

Scoping.prototype = {
	constructor: Scoping,

	getScopeValue(pop, key, traverser) {
		if (traverser.getSideEffects().exists(key))
			return traverser.getSideEffects().get(key);
		///
		const object = traverser;
		if (object instanceof Map && object.containsKey(key))
			return object.getValue(key);
		///
		const path = traverser.path();
		if (path.hasLabel(key))
			return path.get(pop, key);
		///
		throw ("Neither the sideEffects, map, nor path has a " + key + "-key");
	},

	getNullableScopeValue(pop, key, traverser) {
		if (traverser.getSideEffects().exists(key))
			return traverser.getSideEffects().get(key);
		///
		const object = traverser.get();
		if (object instanceof Map && object.containsKey(key))
			return object.getValue(key);
		///
		const path = traverser.path();
		if (path.hasLabel(key))
			return path.get(pop, key);
		///
		return null;
	}
};

Scoping.TYPICAL_LOCAL_REQUIREMENTS = new List([TraverserRequirement.OBJECT, TraverserRequirement.SIDE_EFFECTS]);
Scoping.TYPICAL_GLOBAL_REQUIREMENTS = new List([TraverserRequirement.OBJECT, TraverserRequirement.LABELED_PATH,
	TraverserRequirement.SIDE_EFFECTS]);
Scoping.TYPICAL_LOCAL_REQUIREMENTS_ARRAY = [TraverserRequirement.OBJECT, TraverserRequirement.SIDE_EFFECTS];
Scoping.TYPICAL_GLOBAL_REQUIREMENTS_ARRAY = [TraverserRequirement.OBJECT, TraverserRequirement.LABELED_PATH,
	TraverserRequirement.SIDE_EFFECTS];

Scoping.Variable = {START: 'START', END: 'END'};

export default Scoping;
