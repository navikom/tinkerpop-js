import { Map, isNull } from '../../../util';
import MutableMetrics from './MutableMetrics';

/**
 * ImmutableMetrics
 * @constructor
 */
function ImmutableMetrics() {

	this.counts = new Map();
	this.durationNs = 0;
	this.annotations = new Map();
	this.nested = new Map();
}
ImmutableMetrics.prototype = {
	constructor: ImmutableMetrics,
	getDuration(unit) {
		//console.log(this.durationNs, unit);
		return this.durationNs / unit;
	},

	getCount(key) {
		if (!this.counts.containsKey(key)) {
			return null;
		}
		return this.counts.getValue(key);
	},

	getCounts() {
		const ret = new Map();
		const it = this.counts.keySet();
		while (it.hasNext()) {
			ret.put(it.getKey(), it.getValue());
			it.next();
		}
		return ret;
	},

	getName() {
		return this.name;
	},

	getId() {
		return this.id;
	},

	getNested(metricsId) {
		if(!isNull(metricsId)){
			return this.nested.getValue(metricsId);
		} else {
			return this.nested.values();
		}
	},

	getAnnotations() {
		return this.annotations;
	},

	getAnnotation(key) {
		return this.annotations.getValue(key);
	}
};

ImmutableMetrics.SOURCE_UNIT = +new Date;

export default ImmutableMetrics;
