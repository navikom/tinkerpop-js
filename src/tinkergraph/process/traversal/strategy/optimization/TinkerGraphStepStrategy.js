import { mixin } from '../../../../../util';
import TraversalHelper from '../../../../../proccess/traversal/util/TraversalHelper';
import TraversalStrategy from '../../../../../proccess/traversal/TraversalStrategy';
import { GraphStep, NoOpBarrierStep } from '../../../../../proccess/traversal/step/map';
import { HasStep } from '../../../../../proccess/traversal/step/filter';
import TinkerGraphStep from '../../step/sideEffects/TinkerGraphStep';
import Vertex from '../../../../../structure/Vertex';

/**
 * TinkerGraphStepStrategy
 * @constructor
 */
function TinkerGraphStepStrategy() {

}

TinkerGraphStepStrategy.prototype = {
  constructor: TinkerGraphStepStrategy,
  position: 11,
  apply(traversal) {
    const steps = TraversalHelper.getStepsOfClass('GraphStep', traversal);
    for (let i = 0; i < steps.size(); i++) {
      const originalGraphStep = steps.getValue(i);
      const tinkerGraphStep = new TinkerGraphStep(originalGraphStep);

      TraversalHelper.replaceStep(originalGraphStep, tinkerGraphStep, traversal);
      let currentStep = tinkerGraphStep.getNextStep();
      while (currentStep instanceof HasStep || currentStep instanceof NoOpBarrierStep) {
        if (currentStep instanceof HasStep) {
          const containers = currentStep.getHasContainers();
          for (let j = 0; j < containers.size(); j++) {
            const hasContainer = containers.getValue(j);
            if (!GraphStep.processHasContainerIds(tinkerGraphStep, hasContainer)) {

              tinkerGraphStep.addHasContainer(hasContainer);

            }
            tinkerGraphStep.setIteratorSupplier(Vertex === tinkerGraphStep.returnClass ? tinkerGraphStep.vertices() : tinkerGraphStep.edges());
          }
          TraversalHelper.copyLabels(currentStep, currentStep.getPreviousStep(), false);
          traversal.removeStep(currentStep);
        }
        currentStep = currentStep.getNextStep();
      }
    }
  }
}

mixin(TinkerGraphStepStrategy, TraversalStrategy.ProviderOptimizationStrategy.prototype)

const tinkerGraphStepStrategy = new TinkerGraphStepStrategy();
export default tinkerGraphStepStrategy;