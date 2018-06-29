import { mixin } from '../../../../util';
import TraversalStrategy from '../../TraversalStrategy';
import Hidden from '../../../../structure/Hidden';
import TraversalHelper from '../../util/TraversalHelper';
import { ProfileSideEffectStep } from '../../step/sideEffects';
import { RepeatStep } from '../../step/branch';

/**
 * StandardVerificationStrategy
 * @constructor
 */
function StandardVerificationStrategy() {
}

StandardVerificationStrategy.prototype = {
	constructor: StandardVerificationStrategy,
	apply(traversal) {
		//if (!traversal.getStrategies().toList().contains(ComputerFinalizationStrategy.instance()) &&
		//	!traversal.getStrategies().toList().contains(ComputerVerificationStrategy.instance())) {
		//	if (!TraversalHelper.getStepsOfAssignableClass(VertexComputing.class, traversal).isEmpty())
		//		throw new VerificationException("VertexComputing steps must be executed with a GraphComputer: " + TraversalHelper.getStepsOfAssignableClass(VertexComputing.class, traversal), traversal);
		//}

		for (let i = 0; i < traversal.getSteps().size(); i++) {
			const step = traversal.getSteps().get(i);
			for (let j = 0; j < step.getLabels().size(); j++) {
				const label = step.getLabels().get(j);
				if (Hidden.isHidden(label))
					step.removeLabel(label);
			}
			if (step.getSeedSupplier && step.getTraversal().getParent() instanceof RepeatStep
				&& step.getTraversal().getParent().getGlobalChildren().get(0).getSteps().contains(step))
				throw ("The parent of a reducing barrier can not be repeat()-step: " + step.constructor.name);
		}

		// The ProfileSideEffectStep must be the last step, 2nd last step when accompanied by the cap step,
		// or 3rd to last when the traversal ends with a RequirementsStep.
		const endStep = traversal.asAdmin().getEndStep();
		if (TraversalHelper.hasStepOfClass(ProfileSideEffectStep, traversal) && !(endStep instanceof ProfileSideEffectStep ||
			(endStep instanceof SideEffectCapStep && endStep.getPreviousStep() instanceof ProfileSideEffectStep) ||
			(endStep instanceof RequirementsStep && (
			endStep.getPreviousStep() instanceof SideEffectCapStep ||
			endStep.getPreviousStep() instanceof ProfileSideEffectStep)))) {
			throw ("When specified, the profile()-Step must be the last step or followed only by the cap()-step and/or requirements step.");
		}

		if (TraversalHelper.getStepsOfClass(ProfileSideEffectStep, traversal).size() > 1) {
			throw ("The profile()-Step cannot be specified multiple times.", traversal);
		}
	},

	applyPrior() {
		//return Collections.singleton(ComputerVerificationStrategy.class);
	}
};

mixin(StandardVerificationStrategy, TraversalStrategy.VerificationStrategy.prototype);


const INSTANCE = new StandardVerificationStrategy();

StandardVerificationStrategy.instance = () => INSTANCE;

export default StandardVerificationStrategy;

