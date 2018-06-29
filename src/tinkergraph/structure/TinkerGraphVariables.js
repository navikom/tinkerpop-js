import { mixin, Map, Optional } from '../../util';
import Graph from '../../structure/Graph';
import ElementHelper from '../../structure/util/ElementHelper';

/**
 * TinkerGraphVariables
 * @constructor
 */
function TinkerGraphVariables() {
	this.variables = new Map();
}

TinkerGraphVariables.prototype = {
	constructor: TinkerGraphVariables,


	keys() {
		return this.variables.getKeys();
	},

	getValue(key) {
		return Optional.ofNullable(this.variables.getValue(key));
	},

	remove(key) {
		this.variables.remove(key);
	},

	put(key, value) {
		ElementHelper.validateProperty(key, value);
		this.variables.put(key, value);
	}
};

mixin(TinkerGraphVariables, Graph.Variables.prototype);

export { TinkerGraphVariables };
