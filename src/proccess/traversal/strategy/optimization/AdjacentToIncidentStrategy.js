import { mixin, HashSet, List } from '../../../../util';
import TraversalStrategy from '../../TraversalStrategy';
import TraversalHelper from '../../util/TraversalHelper';
import { CountGlobalStep, VertexStep, PropertiesStep } from '../../step/map';
import { NotStep, TraversalFilterStep, WhereTraversalStep, ConnectiveStep, RangeGlobalStep } from '../../step/filter';
import PropertyType from '../../../../structure/PropertyType';
import Edge from '../../../../structure/Edge';
import IdentityRemovalStrategy from './IdentityRemovalStrategy';
import IncidentToAdjacentStrategy from './IncidentToAdjacentStrategy';

const PRIORS = new List([IdentityRemovalStrategy.instance(), IncidentToAdjacentStrategy.instance()]);
/**
 * This strategy looks for vertex- and value-emitting steps followed by a {@link CountGlobalStep} and replaces the
 * pattern with an edge- or property-emitting step followed by a {@code CountGlobalStep}. Furthermore, if a vertex-
 * or value-emitting step is the last step in a {@code .has(traversal)}, {@code .and(traversal, ...)} or
 * {@code .or(traversal, ...)} child traversal, it is replaced by an appropriate edge- or property-emitting step.
 * <p/>
 *
 * @example <pre>
 * __.out().count()            // is replaced by __.outE().count()
 * __.in().limit(3).count()    // is replaced by __.inE().limit(3).count()
 * __.values("name").count()   // is replaced by __.properties("name").count()
 * __.where(__.out())          // is replaced by __.where(__.outE())
 * __.where(__.values())       // is replaced by __.where(__.properties())
 * __.and(__.in(), __.out())   // is replaced by __.and(__.inE(), __.outE())
 * </pre>
 */
function AdjacentToIncidentStrategy() {
}

AdjacentToIncidentStrategy.prototype = {
	constructor: AdjacentToIncidentStrategy,
	position: 8,
	apply(traversal) {

		const steps = traversal.getSteps();
		const size = steps.size() - 1;
		let prev = null;
		for (let i = 0; i <= size; i++) {
			const curr = steps.get(i);
			//console.log('AdjacentToIncidentStrategy', curr, i, size, prev)
			if (i === size && AdjacentToIncidentStrategy.isOptimizable(curr)) {
				const parent = curr.getTraversal().getParent();
				if (parent instanceof NotStep || parent instanceof TraversalFilterStep
					|| parent instanceof WhereTraversalStep || parent instanceof ConnectiveStep) {
					AdjacentToIncidentStrategy.optimizeStep(traversal, curr);
				}
			} else if (AdjacentToIncidentStrategy.isOptimizable(prev)) {
				if (curr instanceof CountGlobalStep) {
					AdjacentToIncidentStrategy.optimizeStep(traversal, prev);
				}
			}
			if (!(curr instanceof RangeGlobalStep)) {
				prev = curr;
			}
		}

	},

	applyPrior() {
		return PRIORS;
	}

};

mixin(AdjacentToIncidentStrategy, TraversalStrategy.OptimizationStrategy.prototype);

/**
 * Checks whether a given step is optimizable or not.
 *
 * @param step the step to check
 * @return <code>true</code> if the step is optimizable, otherwise <code>false</code>
 */
AdjacentToIncidentStrategy.isOptimizable = (step) => {
	//console.log('isOptimizable',step, step && step.returnsVertex && step.returnsVertex())
	return ((step instanceof VertexStep && step.returnsVertex()) ||
		(step instanceof PropertiesStep && PropertyType.VALUE === step.getReturnType()))
		&& (step.getTraversal().getEndStep().getLabels().isEmpty() || step.getNextStep() instanceof CountGlobalStep);
};

/**
 * Optimizes the given step if possible. Basically this method converts <code>.out()</code> to <code>.outE()</code>
 * and <code>.values()</code> to <code>.properties()</code>.
 *
 * @param traversal the traversal that holds the given step
 * @param step      the step to replace
 */
AdjacentToIncidentStrategy.optimizeStep = (traversal, step) => {
	let newStep;
	if (step instanceof VertexStep) {
		const vs = step;
		newStep = new VertexStep(traversal, Edge, vs.getDirection(), vs.getEdgeLabels());
	} else if (step instanceof PropertiesStep) {
		const ps = step;
		newStep = new PropertiesStep(traversal, PropertyType.PROPERTY, ps.getPropertyKeys());
	} else {
		return;
	}
	TraversalHelper.replaceStep(step, newStep, traversal);
};

const INSTANCE = new AdjacentToIncidentStrategy();

AdjacentToIncidentStrategy.instance = () => INSTANCE;

export default AdjacentToIncidentStrategy;

