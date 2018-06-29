import { mixin, HashSet, List, Map } from '../../../../util';
import Traversal from '../../Traversal';
import __ from '../../dsl/graph/__';
import TraversalStrategy from '../../TraversalStrategy';
import TraversalHelper from '../../util/TraversalHelper';
import { GraphStep, CountGlobalStep, MatchStep } from '../../step/map';
import { RepeatStep } from '../../step/branch';
import { FilterStep, NotStep, RangeGlobalStep, IsStep } from '../../step/filter';
import { SideEffectStep } from '../../step/sideEffects';
import Contains from '../../Contains';
import Compare from '../../Compare';

const RANGE_PREDICATES = new Map();
RANGE_PREDICATES.put(Contains.within, 1);
RANGE_PREDICATES.put(Contains.without, 0);

const INCREASED_OFFSET_SCALAR_PREDICATES =
	new List([Compare.eq, Compare.neq, Compare.lte, Compare.gt]);

/**
 * This strategy optimizes any occurrence of {@link CountGlobalStep} followed by an {@link IsStep}. The idea is to limit
 * the number of incoming elements in a way that it's enough for the {@link IsStep} to decide whether it evaluates
 * {@code true} or {@code false}. If the traversal already contains a user supplied limit, the strategy won't
 * modify it.
 *
 * @author Daniel Kuppitz (http://gremlin.guru)
 * @example <pre>
 * __.outE().count().is(0)      // is replaced by __.not(outE())
 * __.outE().count().is(lt(3))  // is replaced by __.outE().limit(3).count().is(lt(3))
 * __.outE().count().is(gt(3))  // is replaced by __.outE().limit(4).count().is(gt(3))
 * </pre>
 */
function RangeByIsCountStrategy() {
}

RangeByIsCountStrategy.prototype = {
	constructor: RangeByIsCountStrategy,
	position: 7,
	apply(traversal) {

		const parent = traversal.getParent();
		let size = traversal.getSteps().size();
		let prev = null;
		//console.log('RangeByIsCountStrategy', traversal, traversal.getSteps)
		for (let i = 0; i < size; i++) {
			const curr = traversal.getSteps().get(i);
			//console.log('RangeByIsCountStrategy00', i < size - 1 && this.doStrategy(curr))
			if (i < size - 1 && this.doStrategy(curr)) {
				const isStep = traversal.getSteps().get(i + 1);
				const isStepPredicate = isStep.getPredicate();
				let highRange = null;
				let useNotStep = false, dismissCountIs = false;
				const predicates = isStepPredicate.getPredicates ? isStepPredicate.getPredicates() : new List([isStepPredicate]);
				for (let j = 0; j < predicates.size(); j++) {
					const p = predicates.get(j);
					const value = p.getValue();
					const predicate = p.getBiPredicate();
					if (!isNaN(value)) {
						const highRangeOffset = INCREASED_OFFSET_SCALAR_PREDICATES.contains(predicate) ? 1 : 0;
						const highRangeCandidate = value + highRangeOffset;
						const update = highRange === null || highRangeCandidate > highRange;
						if (update) {
							if (parent.constructor.name === 'EmptyStep') {
								useNotStep = false;
							} else {
								if (parent instanceof RepeatStep) {
									const repeatStep = parent;
									dismissCountIs = useNotStep =
										traversal.constructor.name === repeatStep.getUntilTraversal().constructor.name
										|| traversal.constructor.name === repeatStep.getEmitTraversal().constructor.name;
								} else {
									dismissCountIs = useNotStep = parent.type === FilterStep.TYPE || parent instanceof SideEffectStep;
								}
							}
							highRange = highRangeCandidate;
							useNotStep &= curr.getLabels().isEmpty() && isStep.getLabels().isEmpty()
								&& isStep.getNextStep().constructor.name === 'EmptyStep'
								&& ((highRange <= 1 && predicate === Compare.lt)
								|| (highRange == 1 && (predicate === Compare.eq || predicate === Compare.lte)));
							dismissCountIs &= curr.getLabels().isEmpty() && isStep.getLabels().isEmpty()
								&& isStep.getNextStep().constructor.name === 'EmptyStep'
								&& (highRange == 1 && (predicate === Compare.gt || predicate === Compare.gte));
						}
					} else {
						const highRangeOffset = RANGE_PREDICATES.get(predicate);
						if (value instanceof List && highRangeOffset !== null) {
							const high = Math.max.apply(null, value.toArray());
							if (!isNaN(high)) {
								const highRangeCandidate = high + highRangeOffset;
								const update = highRange === null || highRangeCandidate > highRange;
								if (update) highRange = highRangeCandidate;
							}
						}
					}
				}
				if (highRange !== null) {
					if (useNotStep || dismissCountIs) {
						traversal.asAdmin().removeStep(isStep); // IsStep
						traversal.asAdmin().removeStep(curr); // CountStep
						size -= 2;
						if (!dismissCountIs) {
							if (traversal.getParent().type === FilterStep.TYPE) {
								const filterStep = parent.asStep();
								const parentTraversal = filterStep.getTraversal();
								const notStep = new NotStep(parentTraversal,
									traversal.getSteps().isEmpty() ? __.identity() : traversal);
								filterStep.getLabels().forEach((label) => notStep.addLabel(label));
								TraversalHelper.replaceStep(filterStep, notStep, parentTraversal);
							} else {
								let inner;
								if (prev !== null) {
									inner = __.start().asAdmin();
									for (; ;) {
										const pp = prev.getPreviousStep();
										inner.addStep(prev, 0);
										if (pp.constructor.name === 'EmptyStep' || pp instanceof GraphStep
											|| !(prev.type === FilterStep.TYPE || prev instanceof SideEffectStep)) break;
										traversal.removeStep(prev);
										prev = pp;
										size--;
									}
								} else {
									inner = __.identity().asAdmin();
								}
								if (prev !== null)
									TraversalHelper.replaceStep(prev, new NotStep(traversal, inner), traversal);
								else
									Traversal.prototype.addStep.call(traversal, new NotStep(traversal, inner));
							}
						}
					} else {
						//console.log('RangeByIsCountStrategy', curr, traversal)
						TraversalHelper.insertBeforeStep(new RangeGlobalStep(traversal, 0, highRange), curr, traversal);
					}
					i++;
				}
			}
			prev = curr;
		}
	},

	doStrategy(step) {
		if (!(step instanceof CountGlobalStep) || !(step.getNextStep() instanceof IsStep) ||
			step.getPreviousStep() instanceof RangeGlobalStep) // if a RangeStep was provided, assume that the user knows what he's doing
			return false;

		const parent = step.getTraversal().getParent().asStep();
		return (parent.type === FilterStep.TYPE || parent.getLabels().isEmpty()) && // if the parent is labeled, then the count matters
			!(parent.getNextStep() instanceof MatchStep.MatchEndStep && // if this is in a pattern match, then don't do it.
			parent.getNextStep().getMatchKey().isPresent());
	}
};

mixin(RangeByIsCountStrategy, TraversalStrategy.OptimizationStrategy.prototype);


const INSTANCE = new RangeByIsCountStrategy();

RangeByIsCountStrategy.instance = () => INSTANCE;

export default RangeByIsCountStrategy;

