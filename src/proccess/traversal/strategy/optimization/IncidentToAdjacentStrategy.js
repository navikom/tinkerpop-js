import { mixin, List, Pair } from '../../../../util';
import Hidden from '../../../../structure/Hidden';
import Direction from '../../../../structure/Direction';
import Vertex from '../../../../structure/Vertex';
import TraversalStrategy from '../../TraversalStrategy';
import TraversalHelper from '../../util/TraversalHelper';
import { VertexStep, PathStep, TreeStep, EdgeOtherVertexStep, EdgeVertexStep } from '../../step/map';
import { CyclicPathStep, SimplePathStep } from '../../step/filter';
import { TreeSideEffectStep } from '../../step/sideEffects';
import IdentityRemovalStrategy from './IdentityRemovalStrategy';
import LambdaHolder from '../../step/LambdaHolder';


const MARKER = Hidden.hide("gremlin.incidentToAdjacent");
const INVALIDATING_STEP_CLASSES = new List([CyclicPathStep,
	PathStep, SimplePathStep, TreeStep, TreeSideEffectStep, LambdaHolder]);

/**
 * Checks whether a given step is optimizable or not.
 *
 * @param step1 an edge-emitting step
 * @param step2 a vertex-emitting step
 * @return <code>true</code> if step1 is not labeled and emits edges and step2 emits vertices,
 * otherwise <code>false</code>
 */
const isOptimizable = (step1, step2) => {
	if (step1 instanceof VertexStep && step1.returnsEdge() && step1.getLabels().isEmpty()) {
		const step1Dir = step1.getDirection();
		if (step1Dir === Direction.BOTH) {
			return step2 instanceof EdgeOtherVertexStep;
		}
		return step2 instanceof EdgeOtherVertexStep || (step2 instanceof EdgeVertexStep &&
			step2.getDirection() === Direction.opposite(step1Dir));
	}
	return false;
};

/**
 * Optimizes the given edge-emitting step and the vertex-emitting step by replacing them with a single
 * vertex-emitting step.
 *
 * @param traversal the traversal that holds the given steps
 * @param step1     the edge-emitting step to replace
 * @param step2     the vertex-emitting step to replace
 */
const optimizeSteps = (traversal, step1, step2) => {
	const newStep = new VertexStep(traversal, Vertex, step1.getDirection(), step1.getEdgeLabels());
	for (let i = 0; i < step2.getLabels().size(); i++) {
		newStep.addLabel(step2.getLabels().get(i));
	}
	TraversalHelper.replaceStep(step1, newStep, traversal);
	traversal.removeStep(step2);
};

/**
 * This strategy looks for {@code .outE().inV()}, {@code .inE().outV()} and {@code .bothE().otherV()}
 * and replaces these step sequences with {@code .out()}, {@code .in()} or {@code .both()} respectively.
 * The strategy won't modify the traversal if:
 * <ul>
 * <li>the edge step is labeled</li>
 * <li>the traversal contains a {@code path} step</li>
 * <li>the traversal contains a lambda step</li>
 * </ul>
 * <p/>
 *
 * @example <pre>
 * __.outE().inV()         // is replaced by __.out()
 * __.inE().outV()         // is replaced by __.in()
 * __.bothE().otherV()     // is replaced by __.both()
 * __.bothE().bothV()      // will not be modified
 * __.outE().inV().path()  // will not be modified
 * __.outE().inV().tree()  // will not be modified
 * </pre>
 */
function IncidentToAdjacentStrategy() {
}

IncidentToAdjacentStrategy.prototype = {
	constructor: IncidentToAdjacentStrategy,
	position: 3,
	apply(traversal) {
		// using a hidden label marker to denote whether the traversal should not be processed by this strategy
		if ((traversal.getParent().constructor.name === 'EmptyStep' || traversal.getParent().constructor.name === 'VertexProgramStep') &&
			TraversalHelper.hasStepOfAssignableClassRecursively(INVALIDATING_STEP_CLASSES, traversal))
			TraversalHelper.applyTraversalRecursively(t => t.getStartStep().addLabel(MARKER), traversal);
		if (traversal.getStartStep().getLabels().contains(MARKER)) {
			traversal.getStartStep().removeLabel(MARKER);
			return;
		}
		////////////////////////////////////////////////////////////////////////////
		const stepsToReplace = new List();
		let prev = null;
		for (let i = 0; i < traversal.getSteps().size(); i++) {
			const curr = traversal.getSteps().get(i);
			if (isOptimizable(prev, curr)) {
				stepsToReplace.add(Pair.with(prev, curr));
			}
			prev = curr;
		}
		if (!stepsToReplace.isEmpty()) {
			for (let i = 0; i < stepsToReplace.size(); i++) {
				const pair = stepsToReplace.get(i);
				optimizeSteps(traversal, pair.getValue0(), pair.getValue1());
			}
		}
	},

	applyPrior() {
		return new List([IdentityRemovalStrategy.instance()]);
	}
};


mixin(IncidentToAdjacentStrategy, TraversalStrategy.OptimizationStrategy.prototype);

const INSTANCE = new IncidentToAdjacentStrategy();

IncidentToAdjacentStrategy.instance = () => INSTANCE;

export default IncidentToAdjacentStrategy;
