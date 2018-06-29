import { mixin, List } from '../../../../util';
import DefaultTraversal from '../../util/DefaultTraversal';
import DefaultGraphTraversal from '../../dsl/graph/DefaultGraphTraversal';
import TraversalStrategy from '../../TraversalStrategy';
import TraversalHelper from '../../util/TraversalHelper';
import { MatchStep, SelectStep, SelectOneStep } from '../../step/map';
import { WherePredicateStep, WhereTraversalStep, DedupGlobalStep } from '../../step/filter';
import IdentityRemovalStrategy from './IdentityRemovalStrategy';
import FilterRankingStrategy from './FilterRankingStrategy';

const PRIORS = new List([IdentityRemovalStrategy.instance()]);
const POSTS = new List([FilterRankingStrategy.instance()]);

/**
 * MatchWhereStrategy will fold any post-{@code where()} step that maintains a traversal constraint into
 * {@code match()}. {@link MatchStep} is intelligent with traversal constraint applications and thus, can more
 * efficiently use the constraint of {@link WhereTraversalStep} or {@link WherePredicateStep}.
 * <p/>
 * <p/>
 *
 * @example <pre>
 * __.match(a,b).where(c)            // is replaced by __.match(a,b,c)
 * __.match(a,b).select().where(c)  // is replaced by __.match(a,b,c).select()
 * </pre>
 */
function MatchPredicateStrategy() {
}

MatchPredicateStrategy.prototype = {
	constructor: MatchPredicateStrategy,
	position: 1,
	apply(traversal) {
		if (!TraversalHelper.hasStepOfClass(MatchStep, traversal))
			return;

		TraversalHelper.getStepsOfClass(MatchStep, traversal).forEach(matchStep => {
			// match().select().where() --> match(where()).select()
			// match().select().dedup() --> match(dedup()).select()
			let nextStep = matchStep.getNextStep();
			while (nextStep instanceof WherePredicateStep ||
			nextStep instanceof WhereTraversalStep ||
			(nextStep instanceof DedupGlobalStep && !nextStep.getScopeKeys().isEmpty() && nextStep.getLocalChildren().isEmpty()) ||
			(nextStep instanceof SelectStep && nextStep.getLocalChildren().isEmpty()) ||
			(nextStep instanceof SelectOneStep && nextStep.getLocalChildren().isEmpty())) {
				if (nextStep instanceof WherePredicateStep || nextStep instanceof WhereTraversalStep) {
					traversal.removeStep(nextStep);
					matchStep.addGlobalChild(traversal.asAdmin ?
						new DefaultGraphTraversal().addStep(nextStep) :
						new DefaultTraversal().addStep(nextStep));
					nextStep = matchStep.getNextStep();
				} else if (nextStep instanceof DedupGlobalStep && !nextStep.getScopeKeys().isEmpty()
					&& nextStep.getLocalChildren().isEmpty() && !TraversalHelper.onGraphComputer(traversal)) {
					traversal.removeStep(nextStep);
					matchStep.setDedupLabels(nextStep.getScopeKeys());
					nextStep = matchStep.getNextStep();
				} else if (nextStep.getLabels().isEmpty()) {
					nextStep = nextStep.getNextStep();
				} else
					break;
			}
		});
	},

	applyPrior() {
		return PRIORS;
	},

	applyPost() {
		return POSTS;
	}
};


mixin(MatchPredicateStrategy, TraversalStrategy.OptimizationStrategy.prototype);

const INSTANCE = new MatchPredicateStrategy();

MatchPredicateStrategy.instance = () => INSTANCE;

export default MatchPredicateStrategy;
