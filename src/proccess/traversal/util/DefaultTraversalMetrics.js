import { Map, List, ObjectMap, TreeHashMap, isNull } from '../../../util';
import Steps from './StepsForMetric';
import TraversalHelper from './TraversalHelper';
import MutableMetrics from './MutableMetrics';
import ImmutableMetrics from './ImmutableMetrics';
import ProfileStep from '../step/util/ProfileStep';

const ELEMENT_COUNT_ID = "elementCount";
const TRAVERSER_COUNT_ID = "traverserCount";
const PERCENT_DURATION_KEY = "percentDur";
const UNIT = 1;

export default class DefaultTraversalMetrics {

	constructor(totalStepDurationNs, metricsMap) {
		this.metrics = new Map();
		this.indexToLabelMap = new TreeHashMap();
		this.totalStepDuration = totalStepDurationNs || 0;
		this.totalPercentage = 0;
		this.computedMetrics = new ObjectMap();
		if(metricsMap)
			metricsMap.forEach(metric => this.computedMetrics.put(metric.getId(), metric.getImmutableClone()));
	}

	getDuration(unit) {
		return this.totalStepDuration / unit;
	}

	getMetrics(index) {
		if (isNull(index)) {
			return this.computedMetrics.values();
		} else if (isNaN(index)) {
			return this.computedMetrics.get(index);
		}
		// adjust index to account for the injected profile steps
		return this.computedMetrics.get(this.indexToLabelMap.get(index));
	}


	toString() {
		// Build a pretty table of metrics data.
		const table = [];

		this.appendMetrics(this.computedMetrics.values(), table, 0);

		// Append total duration
		table.push(new Steps("TOTAL", "-", "-", this.getDuration(UNIT), "-"));
		console.table(table);
		return table;
	}

	print(){
		return this.toString();
	}

	appendMetrics(metrics, sb, indent) {
		// Append each StepMetric's row. indexToLabelMap values are ordered by index.
		for (let i = 0; i < metrics.size(); i++) {
			const step = new Steps();
			const m = metrics.get(i);
			let rowName = m.getName();

			// Handle indentation
			for (let ii = 0; ii < indent; ii++) {
				rowName = "---->" + rowName;
			}
			// Abbreviate if necessary
			if(rowName.length > 50)
				rowName = rowName.substring(0, 50) + '...';

			// Grab the values
			const itemCount = m.getCount(ELEMENT_COUNT_ID);
			const traverserCount = m.getCount(TRAVERSER_COUNT_ID);
			let percentDur = m.getAnnotation(PERCENT_DURATION_KEY);
			this.totalPercentage += percentDur;
			// Build the row string

			step.setStep(rowName);

			if (!isNull(itemCount)) {
				step.setCount(itemCount);
			}

			if (!isNull(traverserCount)) {
				step.setTraversers(traverserCount);
			}
			step.setTime(m.getDuration(UNIT));

			if (!isNull(percentDur)) {
				step.setDur(percentDur);
			}

			sb.push(step);
			this.appendMetrics(m.getNested(), sb, indent + 1);
		}
	}

	computeTotals() {
		// Create temp list of ordered metrics
		const tempMetrics = new List();
		const indexToLabelMapValues = this.indexToLabelMap.values();
		for (let i = 0; i < indexToLabelMapValues.size(); i++) {
			const label = indexToLabelMapValues.get(i);
			// The indexToLabelMap is sorted by index (key)
			tempMetrics.add(this.metrics.get(label).clone());
		}

		// Calculate total duration
		this.totalStepDuration = 0;
		tempMetrics.forEach(metric => this.totalStepDuration += metric.getDuration(UNIT));

		// Assign %'s
		tempMetrics.forEach(m => {
			const dur =
				this.totalStepDuration === 0 ? 0 : Math.ceil(m.getDuration(UNIT) * 10000 / this.totalStepDuration ) / 100;
			m.setAnnotation(PERCENT_DURATION_KEY, dur);
		});

		// Store immutable instances of the calculated metrics
		this.computedMetrics = new ObjectMap();
		tempMetrics.forEach(it => this.computedMetrics.put(it.getId(), it.getImmutableClone()));
	}

	static merge(toMerge) {
		const newTraversalMetrics = new DefaultTraversalMetrics();

		// iterate the incoming TraversalMetrics
		toMerge.forEachRemaining(inTraversalMetrics => {
			// aggregate the internal Metrics
			inTraversalMetrics.metrics.forEach((metricsId, toAggregate) => {

				let aggregateMetrics = newTraversalMetrics.metrics.get(metricsId);
				if (isNull(aggregateMetrics)) {
					// need to create a Metrics to aggregate into
					aggregateMetrics = new MutableMetrics(toAggregate.getId(), toAggregate.getName());

					newTraversalMetrics.metrics.put(metricsId, aggregateMetrics);
					// Set the index of the Metrics
					const entry = inTraversalMetrics.indexToLabelMap.keySet();
					while (entry.hasNext()) {
						if (metricsId === entry.getValue()) {
							newTraversalMetrics.indexToLabelMap.put(entry.getKey(), metricsId);
							break;
						}
						entry.next();
					}
				}
				aggregateMetrics.aggregate(toAggregate);
			});
		});
		return newTraversalMetrics;
	}

	setMetrics(traversal, onGraphComputer) {
		this.addTopLevelMetrics(traversal, onGraphComputer);
		this.handleNestedTraversals(traversal, null, onGraphComputer);
		this.computeTotals();
	}

	addTopLevelMetrics(traversal, onGraphComputer) {
		const profileSteps = TraversalHelper.getStepsOfClass('ProfileStep', traversal);
		for (let ii = 0; ii < profileSteps.size(); ii++) {
			// The index is necessary to ensure that step order is preserved after a merge.
			const step = profileSteps.get(ii);
			if (onGraphComputer) {
				const stepMetrics = traversal.getSideEffects().get(step.getId());
				this.indexToLabelMap.put(ii, stepMetrics.getId());
				this.metrics.put(stepMetrics.getId(), stepMetrics);
			} else {
				const stepMetrics = step.getMetrics();
				this.indexToLabelMap.put(ii, stepMetrics.getId());
				this.metrics.put(stepMetrics.getId(), stepMetrics);
			}
		}
	}

	handleNestedTraversals(traversal, parentMetrics, onGraphComputer) {
		let prevDur = 0;
		for (let i = 0; i < traversal.getSteps().size(); i++) {
			const step = traversal.getSteps().get(i);
			if (!(step instanceof ProfileStep))
				continue;

			const metrics = onGraphComputer ?
				traversal.getSideEffects().get(step.getId()) : step.getMetrics();
			if (!isNull(metrics)) { // this happens when a particular branch never received a .next() call (the metrics were never initialized)
				if (!onGraphComputer) {
					// subtract upstream duration.
					let durBeforeAdjustment = metrics.getDuration(UNIT);
					// adjust duration

					metrics.setDuration(metrics.getDuration(UNIT) - prevDur, UNIT);
					prevDur = durBeforeAdjustment;
				}

				if (!isNull(parentMetrics)) {
					parentMetrics.addNested(metrics);
				}

				if (step.getPreviousStep().propType === 'TraversalParent') {

					for (let j = 0; j < step.getPreviousStep().getLocalChildren().size(); j++) {
						const t = step.getPreviousStep().getLocalChildren().get(j);
						this.handleNestedTraversals(t, metrics, onGraphComputer);
					}
					for (let j = 0; j < step.getPreviousStep().getGlobalChildren().size(); j++) {
						const t = step.getPreviousStep().getGlobalChildren().get(j);
						this.handleNestedTraversals(t, metrics, onGraphComputer);
					}
				}
			}
		}
	}
}
