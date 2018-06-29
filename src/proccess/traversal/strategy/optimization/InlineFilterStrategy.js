import { mixin, HashSet, List } from '../../../../util';
import T from '../../../../structure/T';
import Edge from '../../../../structure/Edge';
import Compare from '../../Compare';
import Contains from '../../Contains';
import OrP from '../../util/OrP';
import TraversalStrategy from '../../TraversalStrategy';
import GraphFilterStrategy from '../optimization/GraphFilterStrategy';
import AdjacentToIncidentStrategy from './AdjacentToIncidentStrategy';
import FilterRankingStrategy from './FilterRankingStrategy';
import IdentityRemovalStrategy from './IdentityRemovalStrategy';
import MatchPredicateStrategy from './MatchPredicateStrategy';
import TraversalHelper from '../../util/TraversalHelper';
import { EmptyStep } from '../../step/util/EmptyStep';
import { VertexStep, MatchStep } from '../../step/map';
import { FilterStep, HasStep, TraversalFilterStep,
	OrStep, AndStep, DropStep, DedupGlobalStep, RangeGlobalStep } from '../../step/filter';
import HasContainer from '../../step/util/HasContainer';


const POSTS = new List([
	GraphFilterStrategy.instance(),
	AdjacentToIncidentStrategy.instance()
]);
const PRIORS = new List([
	FilterRankingStrategy.instance(),
	IdentityRemovalStrategy.instance(),
	MatchPredicateStrategy.instance()
]);

////////////////////////////
///////////////////////////

const processHasStep = (step, traversal) => {
	if (step.getPreviousStep() instanceof HasStep) {
		const previousStep = step.getPreviousStep();
		for (let i = 0; i < step.getHasContainers().size(); i++) {
			const hasContainer = step.getHasContainers().getValue(i);
			previousStep.addHasContainer(hasContainer);
		}
		TraversalHelper.copyLabels(step, previousStep, false);
		traversal.removeStep(step);
		return true;
	} else if (step.getPreviousStep() instanceof VertexStep
		&& step.getPreviousStep().returnsEdge()
		&& 0 === step.getPreviousStep().getEdgeLabels().length) {
		const previousStep = step.getPreviousStep();
		const edgeLabels = new List();
		for (let i = 0; i < step.getHasContainers().size(); i++) {
			const hasContainer = step.getHasContainers().getValue(i);
			if (hasContainer.getKey() === T.label.getAccessor()) {
				if (hasContainer.getBiPredicate() === Compare.eq &&
					typeof hasContainer.getValue() === 'string' &&
					edgeLabels.isEmpty()) {
					edgeLabels.add(hasContainer.getValue());
					step.removeHasContainer(hasContainer);
				} else if (hasContainer.getBiPredicate() === Contains.within &&
					hasContainer.getValue() instanceof List &&
					hasContainer.getValue().containsAll(edgeLabels)) {
					edgeLabels.addAll(hasContainer.getValue());
					step.removeHasContainer(hasContainer);
				} else if (hasContainer.getPredicate() instanceof OrP && edgeLabels.isEmpty()) {
					let removeContainer = true;
					const orps = hasContainer.getPredicate().getPredicates();
					const newEdges = new List();
					for (let i = 0; i < orps.size(); i++) {
						if (orps.getValue(i).getBiPredicate() === Compare.eq && typeof orps.getValue(i).getValue() === 'string')
							newEdges.add(orps.getValue(i).getValue());
						else {
							removeContainer = false;
							break;
						}
					}
					if (removeContainer) {
						edgeLabels.addAll(newEdges);
						step.removeHasContainer(hasContainer);
					}
				}
			}
		}
		if (!edgeLabels.isEmpty()) {
			const newVertexStep = new VertexStep(traversal, Edge, previousStep.getDirection(),
				edgeLabels.toArray());
			TraversalHelper.replaceStep(previousStep, newVertexStep, traversal);
			TraversalHelper.copyLabels(previousStep, newVertexStep, false);
			if (step.getHasContainers().isEmpty()) {
				TraversalHelper.copyLabels(step, newVertexStep, false);
				traversal.removeStep(step);
			}
			return true;
		}
		return false;
	} else
		return false;
};

const processTraversalFilterStep = (step, traversal) => {
	const childTraversal = step.getLocalChildren().getValue(0);
	if (TraversalHelper.hasAllStepsOfClass(childTraversal, FilterStep) && !TraversalHelper.hasStepOfClass(childTraversal,
			DropStep,
			RangeGlobalStep,
			DedupGlobalStep)) {
		TraversalHelper.applySingleLevelStrategies(traversal, childTraversal, InlineFilterStrategy);
		const finalStep = childTraversal.getEndStep();
		TraversalHelper.insertTraversal(step, childTraversal, traversal);
		TraversalHelper.copyLabels(step, finalStep, false);
		traversal.removeStep(step);
		return true;
	}
	return false;
};

const processOrStep = (step, traversal) => {
	let process = true;
	let key = null;
	let predicate = null;
	const labels = new List();
	for (let i = 0; i < step.getLocalChildren().size(); i++) {
		const childTraversal = step.getLocalChildren().getValue(i)
		InlineFilterStrategy.instance().apply(childTraversal);
		for (let j = 0; j < childTraversal.getSteps().size(); j++) {
			const childStep = childTraversal.getSteps().getValue(j);
			if (childStep instanceof HasStep) {
				for (let h = 0; h < childStep.getHasContainers().size(); h++) {
					const hasContainer = childStep.getHasContainers().getValue(h);
					if (null === key)
						key = hasContainer.getKey();
					else if (!hasContainer.getKey() === key) {
						process = false;
						break;
					}
					predicate = null === predicate ?
						hasContainer.getPredicate() :
						predicate.or(hasContainer.getPredicate());
				}
				labels.addAll(childStep.getLabels());
			} else {
				process = false;
				break;
			}
		}
		if (!process)
			break;
	}
	if (process) {
		const hasStep = new HasStep(traversal, new HasContainer(key, predicate));
		TraversalHelper.replaceStep(step, hasStep, traversal);
		TraversalHelper.copyLabels(step, hasStep, false);
		for (let i = 0; i < labels.size(); i++) {
			const label = labels.getValue(i);
			hasStep.addLabel(label);
		}
		return true;
	}
	return false;
};

const processAndStep = (step, traversal) => {
	let process = true;
	for (let i = 0; i < step.getLocalChildren().size(); i++) {
		const childTraversal = step.getLocalChildren().getValue(i)
		if (!TraversalHelper.hasAllStepsOfClass(childTraversal, FilterStep) ||
			TraversalHelper.hasStepOfClass(childTraversal,
				DropStep,
				RangeGlobalStep,
				DedupGlobalStep)) {
			process = false;
			break;
		}
	}
	if (process) {
		const childTraversals = step.getLocalChildren();
		let finalStep = null;
		for (let i = childTraversals.size() - 1; i >= 0; i--) {
			const childTraversal = childTraversals.getValue(i);
			TraversalHelper.applySingleLevelStrategies(traversal, childTraversal, InlineFilterStrategy);
			if (null === finalStep)
				finalStep = childTraversal.getEndStep();
			TraversalHelper.insertTraversal(step, childTraversals.getValue(i), traversal);

		}
		if (null !== finalStep) TraversalHelper.copyLabels(step, finalStep, false);
		traversal.removeStep(step);
		return true;
	}
	return false;
};

const processMatchStep = (step, traversal) => {
	if (step.getPreviousStep() instanceof EmptyStep)
		return false;
	let changed = false;
	const startLabel = MatchStep.Helper.computeStartLabel(step.getGlobalChildren());
	for (let i = 0; i < step.getGlobalChildren().size(); i++) {
		const matchTraversal = step.getGlobalChildren().getValue(i);
		if (TraversalHelper.hasAllStepsOfClass(matchTraversal,
				HasStep,
				MatchStep.MatchStartStep,
				MatchStep.MatchEndStep) &&
			matchTraversal.getStartStep() instanceof MatchStep.MatchStartStep &&
			startLabel === matchTraversal.getStartStep().getSelectKey().orElse(null)) {
			changed = true;
			step.removeGlobalChild(matchTraversal);
			const endLabel = matchTraversal.getEndStep().getMatchKey().orElse(null); // why would this exist? but just in case
			matchTraversal.removeStep(0);                                       // remove MatchStartStep
			matchTraversal.removeStep(matchTraversal.getSteps().size() - 1);    // remove MatchEndStep
			TraversalHelper.applySingleLevelStrategies(traversal, matchTraversal, InlineFilterStrategy);

			matchTraversal.getEndStep().addLabel(startLabel);
			if (null !== endLabel) matchTraversal.getEndStep().addLabel(endLabel);
			TraversalHelper.insertTraversal(step.getPreviousStep(), matchTraversal, traversal);
		}
	}
	if (step.getGlobalChildren().isEmpty())
		traversal.removeStep(step);
	return changed;
};


/**
 * InlineFilterStrategy analyzes filter-steps with child traversals that themselves are pure filters.
 * If the child traversals are pure filters then the wrapping parent filter is not needed and thus, the
 * children can be "inlined."
 * <p/>
 *
 * @example <pre>
 * __.outE().hasLabel(eq("knows").or(eq("created"))).inV()       // is replaced by __.outE("knows", "created").inV()
 * __.filter(has("name","marko"))                                // is replaced by __.has("name","marko")
 * __.and(has("name"),has("age"))                                // is replaced by __.has("name").has("age")
 * __.and(filter(has("name","marko").has("age")),hasNot("blah")) // is replaced by __.has("name","marko").has("age").hasNot("blah")
 * __.match(as('a').has(key,value),...)                          // is replaced by __.as('a').has(key,value).match(...)
 * </pre>
 */
function InlineFilterStrategy() {}

InlineFilterStrategy.prototype = {
	constructor: InlineFilterStrategy,
	position: 4,
	apply(traversal) {
		let changed = true; // recursively walk child traversals trying to inline them into the current traversal line.
		while (changed) {
			changed = false;
			const filterStepIterator = TraversalHelper.getStepsOfAssignableClass(FilterStep, traversal).iterator();
			while (!changed && filterStepIterator.hasNext()) {
				const step = filterStepIterator.next();
				changed = step instanceof HasStep && processHasStep(step, traversal) ||
					step instanceof TraversalFilterStep && processTraversalFilterStep(step, traversal) ||
					step instanceof OrStep && processOrStep(step, traversal) ||
					step instanceof AndStep && processAndStep(step, traversal);
			}
			if (!changed && traversal.getParent() instanceof EmptyStep) {
				const matchStepIterator = TraversalHelper.getStepsOfClass(MatchStep, traversal).iterator();
				while (!changed && matchStepIterator.hasNext()) {
					if (processMatchStep(matchStepIterator.next(), traversal))
						changed = true;
				}
			}
		}
	},

	applyPost() {
		return POSTS;
	},

	applyPrior() {
		return PRIORS;
	},
};

mixin(InlineFilterStrategy, TraversalStrategy.OptimizationStrategy.prototype);

const INSTANCE = new InlineFilterStrategy();


InlineFilterStrategy.instance = () => INSTANCE;

export default InlineFilterStrategy;
