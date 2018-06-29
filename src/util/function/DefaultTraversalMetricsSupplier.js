import DefaultTraversalMetrics from '../../proccess/traversal/util/DefaultTraversalMetrics';
let INSTANCE = null;

/**
 * DefaultTraversalMetricsSupplier
 */
export default class DefaultTraversalMetricsSupplier {

	constructor() {
		if (!INSTANCE) {
			INSTANCE = this;
		}
		return INSTANCE;
	}

	get() {
		return new DefaultTraversalMetrics();
	}

	static instance() {
		return new DefaultTraversalMetricsSupplier();
	}
}
