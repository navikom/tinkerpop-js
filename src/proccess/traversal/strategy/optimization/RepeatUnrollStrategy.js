import { mixin } from '../../../../util';
import TraversalStrategy from '../../TraversalStrategy';
import TraversalHelper from '../../util/TraversalHelper';
import { RepeatStep } from '../../step/branch';
import { DedupGlobalStep } from '../../step/filter';
import LoopTraversal from '../../lambda/LoopTraversal';
import { NoOpBarrierStep } from '../../step/map';
import Scope from '../../Scope';

const MAX_BARRIER_SIZE = 2500;

/**
 * RepeatUnrollStrategy
 * @constructor
 */
function RepeatUnrollStrategy() {

}

RepeatUnrollStrategy.prototype = {
	constructor: RepeatUnrollStrategy,
	position: 5,
	apply(traversal) {
	//if (TraversalHelper.onGraphComputer(traversal))
	//	return;

	for (let i = 0; i < traversal.getSteps().size(); i++) {

		if (traversal.getSteps().getValue(i) instanceof RepeatStep) {
			const repeatStep = traversal.getSteps().getValue(i);

			if (null === repeatStep.getEmitTraversal() &&
				repeatStep.getUntilTraversal() instanceof LoopTraversal && repeatStep.getUntilTraversal().getMaxLoops() > 0 &&
			!TraversalHelper.hasStepOfAssignableClassRecursively(Scope.global, DedupGlobalStep, repeatStep.getRepeatTraversal())) {

				const repeatTraversal = repeatStep.getGlobalChildren().getValue(0);
				repeatTraversal.removeStep(repeatTraversal.getSteps().size() - 1); // removes the RepeatEndStep
				TraversalHelper.applySingleLevelStrategies(traversal, repeatTraversal, RepeatUnrollStrategy.instance());
				const repeatLength = repeatTraversal.getSteps().size();
				let insertIndex = i;
				let loops = repeatStep.getUntilTraversal().getMaxLoops();

				for (let j = 0; j < loops; j++) {
					TraversalHelper.insertTraversal(insertIndex, repeatTraversal.clone(), traversal);
					insertIndex = insertIndex + repeatLength;
					if (j !== (loops - 1) || !(traversal.getSteps().get(insertIndex).getNextStep().barrier)) // only add a
					// final NoOpBarrier is subsequent step is not a barrier
						traversal.addStep(new NoOpBarrierStep(traversal, MAX_BARRIER_SIZE), ++insertIndex);
				}
				// label last step if repeat() was labeled
				if (!repeatStep.getLabels().isEmpty())
					TraversalHelper.copyLabels(repeatStep, traversal.getSteps().get(insertIndex), false);
				traversal.removeStep(i); // remove the RepeatStep
			}
		}
	}
}

};


mixin(RepeatUnrollStrategy, TraversalStrategy.OptimizationStrategy.prototype);

const INSTANCE = new RepeatUnrollStrategy();

RepeatUnrollStrategy.instance = () => INSTANCE;

export default RepeatUnrollStrategy;