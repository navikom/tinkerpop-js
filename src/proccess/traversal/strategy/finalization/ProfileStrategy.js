import { mixin } from '../../../../util';
import TraversalStrategy from '../../TraversalStrategy';
import TraversalHelper from '../../util/TraversalHelper';
import ProfileStep from '../../step/util/ProfileStep';
import { ProfileSideEffectStep } from '../../step/sideEffects';

/**
 * ProfileStrategy
 * @constructor
 */
function ProfileStrategy() {
}

ProfileStrategy.prototype = {
	constructor: ProfileStrategy,
	position: 12,
	apply(traversal) {
		if (TraversalHelper
				.hasStepOfAssignableClassRecursively(
					ProfileSideEffectStep,
					TraversalHelper.getRootTraversal(traversal).asAdmin())) {
			this.prepTraversalForProfiling(traversal);
		}
	},

	// Iterate the traversal steps and inject the .profile()-steps.
	prepTraversalForProfiling(traversal) {
		// Add .profile() step after every pre-existing step.
		const steps = traversal.getSteps();
		const numSteps = steps.size();
		for (let ii = 0; ii < numSteps; ii++) {
			// Get the original step
			const step = steps.get(ii * 2);

			// Do not inject profiling after ProfileSideEffectStep as this will be the last step on the root traversal.
			if (step instanceof ProfileSideEffectStep) {
				break;
			}

			// Create and inject ProfileStep
			const profileStep = new ProfileStep(traversal);
			traversal.addStep(profileStep, (ii * 2) + 1);
		}
	}
};

mixin(ProfileStrategy, TraversalStrategy.FinalizationStrategy.prototype);


const INSTANCE = new ProfileStrategy();

ProfileStrategy.instance = () => INSTANCE;

export default ProfileStrategy;
