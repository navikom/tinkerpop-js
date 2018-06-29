import { mixin } from '../../../../util';
import TraversalStrategy from '../../TraversalStrategy';
import TraversalHelper from '../../util/TraversalHelper';
import { IdentityStep } from '../../step/sideEffects';

/**
 * {@code IdentityRemovalStrategy} looks for {@link IdentityStep} instances and removes them.
 * If the identity step is labeled, its labels are added to the previous step.
 * If the identity step is labeled and its the first step in the traversal, it stays.
 * <p/>
 *
 * @example <pre>
 * __.out().identity().count()            // is replaced by __.out().count()
 * __.in().identity().as("a")             // is replaced by __.in().as("a")
 * __.identity().as("a").out()            // is replaced by __.identity().as("a").out()
 * </pre>
 */
function IdentityRemovalStrategy() {
}

IdentityRemovalStrategy.prototype = {
	constructor: IdentityRemovalStrategy,
	apply(traversal) {
		if (traversal.getSteps().size() <= 1)
			return;
		const steps = TraversalHelper.getStepsOfClass(IdentityStep, traversal);
		for (let i = 0; i < steps.size(); i++) {
			const identityStep = steps.get(i);
			if (identityStep.getLabels().isEmpty() || !(identityStep.getPreviousStep().constructor.name === 'EmptyStep')) {
				TraversalHelper.copyLabels(identityStep, identityStep.getPreviousStep(), false);
				traversal.removeStep(identityStep);
			}
		}
	}

};


mixin(IdentityRemovalStrategy, TraversalStrategy.OptimizationStrategy.prototype);

const INSTANCE = new IdentityRemovalStrategy();

IdentityRemovalStrategy.instance = () => INSTANCE;

export default IdentityRemovalStrategy;
