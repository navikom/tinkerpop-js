import { mixin, List } from '../../../../util';
import TraversalStrategy from '../../TraversalStrategy';
import TraversalHelper from '../../util/TraversalHelper';
import Scoping from '../../step/Scoping';
import { OrderGlobalStep } from '../../step/map';
import {
	FilterStep, IsStep, HasStep, WherePredicateStep, TraversalFilterStep,
	WhereTraversalStep, DedupGlobalStep, ClassFilterStep, CyclicPathStep,
	SimplePathStep, OrStep, AndStep, NotStep
} from '../../step/filter';
import IdentityRemovalStrategy from './IdentityRemovalStrategy';

const PRIORS = new List([IdentityRemovalStrategy.instance()]);

/**
 * FilterRankingStrategy reorders filter- and order-steps according to their rank. It will also do its best to push
 * step labels as far "right" as possible in order to keep traversers as small and bulkable as possible prior to the
 * absolute need for path-labeling.
 * <p/>
 * <table>
 * <thead>
 * <tr><th>Step</th><th>Rank</th></tr>
 * </thead>
 * <tbody>
 * <tr><td>is(predicate)</td><td>1</td></tr>
 * <tr><td>has(predicate)</td><td>2</td></tr>
 * <tr><td>where(predicate)</td><td>3</td></tr>
 * <tr><td>simplePath()</td><td>4</td></tr>
 * <tr><td>cyclicPath()</td><td>4</td></tr>
 * <tr><td>filter(traversal)</td><td>5</td></tr>
 * <tr><td>not(traversal)</td>td>5</td></tr>
 * <tr><td>where(traversal)</td><td>6</td></tr>
 * <tr><td>or(...)</td><td>7</td></tr>
 * <tr><td>and(...)</td><td>8</td></tr>
 * <tr><td>dedup()</td><td>9</td></tr>
 * <tr><td>order()</td><td>10</td></tr>
 * </tbody>
 * </table>

 * @example <pre>
 * __.order().dedup()                        // is replaced by __.dedup().order()
 * __.dedup().filter(out()).has("value", 0)  // is replaced by __.has("value", 0).filter(out()).dedup()
 * </pre>
 */
function FilterRankingStrategy() {
}

FilterRankingStrategy.prototype = {
	constructor: FilterRankingStrategy,
	position: 2,
	apply(traversal) {
	let modified = true;
	while (modified) {
		modified = false;
		const steps = traversal.getSteps();
		for (let i = 0; i < steps.size() - 1; i++) {
			const step = steps.get(i);
			const nextStep = step.getNextStep();
			if (!FilterRankingStrategy.usesLabels(nextStep, step.getLabels())) {
				const nextRank = FilterRankingStrategy.getStepRank(nextStep);
				if (nextRank !== 0) {
					if (!step.getLabels().isEmpty()) {
						TraversalHelper.copyLabels(step, nextStep, true);
						modified = true;
					}
					if (FilterRankingStrategy.getStepRank(step) > nextRank) {
						traversal.removeStep(nextStep);
						traversal.addStep(i, nextStep);
						modified = true;
					}
				}
			}
		}
	}
},

applyPrior() {
	return PRIORS;
}
};

mixin(FilterRankingStrategy, TraversalStrategy.OptimizationStrategy.prototype);


/**
 * Ranks the given step. Steps with lower ranks can be moved in front of steps with higher ranks. 0 means that
 * the step has no rank and thus is not exchangeable with its neighbors.
 *
 * @param step the step to get a ranking for
 * @return The rank of the given step.
 */
FilterRankingStrategy.getStepRank = (step) => {
	let rank;
	if (!(step.type === FilterStep.TYPE || step instanceof OrderGlobalStep))
		return 0;
	else if (step instanceof IsStep || step instanceof ClassFilterStep)
		rank = 1;
	else if (step instanceof HasStep)
		rank = 2;
	else if (step instanceof WherePredicateStep && step.getLocalChildren().isEmpty())
	rank = 3;
else if (step instanceof SimplePathStep || step instanceof CyclicPathStep)
		rank = 4;
	else if (step instanceof TraversalFilterStep || step instanceof NotStep)
		rank = 5;
	else if (step instanceof WhereTraversalStep)
		rank = 6;
	else if (step instanceof OrStep)
		rank = 7;
	else if (step instanceof AndStep)
		rank = 8;
	else if (step instanceof WherePredicateStep) // has by()-modulation
		rank = 9;
	else if (step instanceof DedupGlobalStep)
		rank = 10;
	else if (step instanceof OrderGlobalStep)
		rank = 11;
	else
		return 0;
	////////////
	if (step.propType === 'TraversalParent')
		return FilterRankingStrategy.getMaxStepRank(step, rank);
else
	return rank;
};

FilterRankingStrategy.getMaxStepRank = (parent, startRank) => {
	let maxStepRank = startRank;
	// no filter steps are global parents (yet)
	for (let i = 0; i < parent.getLocalChildren().size(); i++) {
		const traversal = parent.getLocalChildren().get(i);
		for (let j = 0; j < traversal.getSteps().size(); j++) {
			const step = traversal.getSteps().get(j)
			const stepRank = FilterRankingStrategy.getStepRank(step);
			if (stepRank > maxStepRank)
				maxStepRank = stepRank;
		}
	}
	return maxStepRank;
};

FilterRankingStrategy.usesLabels = (step, labels) => {
	if (step.lambdaHolderType)
		return true;
	if (step.getScopeKeys) {
		const scopes = step.getScopeKeys();
		for (let i = 0; i < labels.size(); i++) {
			const label = labels.get(i);
			if (scopes.contains(label))
				return true;
		}
	}
	if (step.propType === 'TraversalParent') {
		if (TraversalHelper.anyStepRecursively(s => FilterRankingStrategy.usesLabels(s, labels), step))
			return true;
	}
	return false;
};

const INSTANCE = new FilterRankingStrategy();

FilterRankingStrategy.instance = () => INSTANCE;

export default FilterRankingStrategy;
