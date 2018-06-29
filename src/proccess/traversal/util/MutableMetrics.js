import { mixin, isNull } from '../../../util';
import ImmutableMetrics from './ImmutableMetrics';
import TraversalMetrics from './TraversalMetrics';

/**
 * MutableMetrics
 * @constructor
 */
function MutableMetrics() {
	ImmutableMetrics.call(this);
	if (arguments.length === 2) {
		this.id = arguments[0];
		this.name = arguments[1];
	} else if(arguments.length === 1) {
		const other = arguments[0];
		this.id = other.getId();
		this.name = other.getName();
		this.annotations.putAll(other.getAnnotations());
		this.durationNs = other.getDuration(ImmutableMetrics.SOURCE_UNIT);
		other.getCounts().forEach((key, count) => this.counts.put(key, count));
		other.getNested().forEach(nested => this.addNested(new MutableMetrics(nested)));
	}
	this.tempTime = -1;
}
MutableMetrics.prototype = {
	constructor: MutableMetrics,
	addNested(metrics) {
		this.nested.put(metrics.getId(), metrics);
	},

	start() {
		if (-1 !== this.tempTime) {
			throw ("Internal Error: Concurrent Metrics start. Stop timer before starting timer.");
		}
		this.tempTime = (+new Date);
	},

	stop() {
		if (-1 === this.tempTime)
			throw ("Internal Error: Metrics has not been started. Start timer before stopping timer");
		//console.log('stop', this.durationNs, (+new Date - this.tempTime), +new Date, this.tempTime)
		this.durationNs = this.durationNs + (+new Date - this.tempTime);
		this.tempTime = -1;
	},

	incrementCount(key, incr) {
		let count = this.counts.getValue(key);
		if (isNull(count)) {
			count = 1;
			this.counts.put(key, count);
		} else {
			this.counts.put(key, this.counts.get(key) + incr);
		}
	},

	setDuration(dur, unit) {
		this.durationNs = dur / unit;
	},

	setCount(key, val) {
		this.counts.put(key, val);
	},

	aggregate(other) {
		this.durationNs += other.durationNs;
		const it = other.counts.keySet();
		while (it.hasNext()) {
			let thisCount = this.counts.get(it.getKey());
			if (isNull(thisCount)) {
				thisCount = it.getValue();
				this.counts.put(it.getKey(), thisCount);
			} else {
				this.counts.put(it.getKey(), thisCount + it.getValue());
			}
			it.next();
		}

		// Merge annotations. If multiple values for a given key are found then append it to a comma-separated list.
		const p = other.annotations.keySet();
		while (p.hasNext()) {
			if (this.annotations.containsKey(p.getKey())) {
				// Strings are concatenated
				let existingVal = this.annotations.getValue(p.getKey());
				if (typeof existingVal === 'string') {
					const existingValues = existingVal.split(",");
					if (!existingValues.contains(p.getValue())) {
						// New value. Append to comma-separated list.
						this.annotations.put(p.getKey(), existingVal + ',' + p.getValue());
					}
				} else {
					// Numbers are summed
					const newVal = existingVal + p.getValue();

					this.annotations.put(p.getKey(), newVal);
				}
			} else {
				this.annotations.put(p.getKey(), p.getValue());
			}
			p.next();
		}

		this.annotations.putAll(other.annotations);

		// Merge nested Metrics
		other.nested.values().forEach(nested => {
			let thisNested = this.nested.getValue(nested.getId());
			if (isNull(thisNested)) {
				thisNested = new MutableMetrics(nested.getId(), nested.getName());
				this.nested.put(thisNested.getId(), thisNested);
			}
			thisNested.aggregate(nested);
		});
	},

	/**
	 * Set an annotation value. Support exists for Strings and Numbers only. During a merge, Strings are concatenated
	 * into a "," (comma) separated list of distinct values (duplicates are ignored), and Numbers are summed.
	 *
	 * @param key
	 * @param value
	 */
	setAnnotation(key, value) {
		if (!(typeof value === 'string' || !isNaN(value))) {
			throw ("Metrics annotations only support String and Number values.");
		}
		this.annotations.put(key, value);
	},

	getNested(metricsId) {
		return this.nested.getValue(metricsId);
	},

	getImmutableClone() {
		const clone = new ImmutableMetrics();
		this.copyMembers(clone);
		this.nested.values().forEach(nested => clone.nested.put(nested.id, nested.getImmutableClone()));
		return clone;
	},

	copyMembers(clone) {
		clone.id = this.id;
		clone.name = this.name;
		// Note: This value is overwritten in the DependantMutableMetrics overridden copyMembers method.
		clone.durationNs = this.durationNs;

		const c = this.counts.keySet();
		while (c.hasNext()) {
			clone.counts.put(c.getKey(), c.getValue());
			c.next();
		}
		const a = this.annotations.keySet();
		while (a.hasNext()) {
			clone.annotations.put(a.getKey(), a.getValue());
			a.next();
		}
	},

	clone() {
		const clone = new MutableMetrics();
		this.copyMembers(clone);
		this.nested.values().forEach(nested => clone.nested.put(nested.id, nested.clone()));
		return clone;
	},

	finish(bulk) {
		this.stop();
		this.incrementCount(TraversalMetrics.TRAVERSER_COUNT_ID, 1);
		this.incrementCount(TraversalMetrics.ELEMENT_COUNT_ID, bulk);
	}
};

mixin(MutableMetrics, ImmutableMetrics.prototype);

export default MutableMetrics;
