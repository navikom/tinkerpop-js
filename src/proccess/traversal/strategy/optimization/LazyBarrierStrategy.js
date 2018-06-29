import { mixin, HashSet, List } from '../../../../util';
import TraversalStrategy from '../../TraversalStrategy';
import RangeByIsCountStrategy from './RangeByIsCountStrategy';
import AdjacentToIncidentStrategy from './AdjacentToIncidentStrategy';
import InlineFilterStrategy from './InlineFilterStrategy';
import FilterRankingStrategy from './FilterRankingStrategy';
import MatchPredicateStrategy from './MatchPredicateStrategy';
import PathRetractionStrategy from './PathRetractionStrategy';
import IncidentToAdjacentStrategy from './IncidentToAdjacentStrategy';
import TraversalHelper from '../../util/TraversalHelper';
import EmptyGraph from '../../../../structure/util/empty/EmptyGraph';
import EmptyStep from '../../step/util/EmptyStep';
import Direction from '../../../../structure/Direction';
import { FlatMapStep, TraversalFlatMapStep, VertexStep, GraphStep, NoOpBarrierStep } from '../../step/map';
import { HasStep } from '../../step/filter';
import { ProfileSideEffectStep } from '../../step/sideEffects';
import TraverserRequirement from '../../traverser/TraverserRequirement';

const PRIORS = new List([
	RangeByIsCountStrategy.instance(),
	PathRetractionStrategy.instance(),
	IncidentToAdjacentStrategy.instance(),
	AdjacentToIncidentStrategy.instance(),
	FilterRankingStrategy.instance(),
	InlineFilterStrategy.instance(),
	MatchPredicateStrategy.instance()]);

const MAX_BARRIER_SIZE = 2500;
const BIG_START_SIZE = 5;
/**
 * LazyBarrierStrategy
 * @constructor
 */
function LazyBarrierStrategy() {
}

LazyBarrierStrategy.prototype = {
	constructor: LazyBarrierStrategy,
	position: 9,
	apply(traversal) {
		if (TraversalHelper.onGraphComputer(traversal) ||
			traversal.getTraverserRequirements().contains(TraverserRequirement.PATH) ||
			TraversalHelper.hasStepOfAssignableClass(ProfileSideEffectStep, TraversalHelper.getRootTraversal(traversal))) // necessary cause ProfileTest analyzes counts
			return;

		let foundFlatMap = false;
		let labeledPath = false;
		for (let i = 0; i < traversal.getSteps().size(); i++) {
			const step = traversal.getSteps().get(i);

			if (step.getKeepLabels) {
				const keepLabels = step.getKeepLabels();
				if (keepLabels && keepLabels.isEmpty()) // if no more path data, then start barrier'ing again
					labeledPath = false;
			}
			if (step.flatMapType && !(step instanceof VertexStep && step.returnsEdge()) ||
				(step instanceof GraphStep &&
				(i > 0 || step.getIds().length >= BIG_START_SIZE ||
				(step.getIds().length === 0 && !(step.getNextStep() instanceof HasStep))))) {
				if (foundFlatMap && !labeledPath && !(step.getNextStep().barrierType)
					&& step.getNextStep().constructor.name !== 'EmptyStep') {
					//console.log('LazyBarrierStrategy0', step)
					const noOpBarrierStep = new NoOpBarrierStep(traversal, MAX_BARRIER_SIZE);
					TraversalHelper.copyLabels(step, noOpBarrierStep, true);
					TraversalHelper.insertAfterStep(noOpBarrierStep, step, traversal);
				} else{
					//console.log('LazyBarrierStrategy1', step)
					foundFlatMap = true;
				}
			}
			if (!step.getLabels().isEmpty())
				labeledPath = true;

		}
	},


	applyPrior() {
		return PRIORS;
	}
};

mixin(LazyBarrierStrategy, TraversalStrategy.OptimizationStrategy.prototype);

const INSTANCE = new LazyBarrierStrategy();

LazyBarrierStrategy.instance = () => INSTANCE;

export default LazyBarrierStrategy;
