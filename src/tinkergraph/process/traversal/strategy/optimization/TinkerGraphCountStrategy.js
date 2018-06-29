import { mixin, List } from '../../../../../util';
import TraversalHelper from '../../../../../proccess/traversal/util/TraversalHelper';
import TraversalStrategy from '../../../../../proccess/traversal/TraversalStrategy';
import TraversalParent from '../../../../../proccess/traversal/step/TraversalParent';
import TinkerGraphStepStrategy from './TinkerGraphStepStrategy';
import { GraphStep, NoOpBarrierStep, MapStep, CountGlobalStep } from '../../../../../proccess/traversal/step/map';
import { IdentityStep, SideEffectStep } from '../../../../../proccess/traversal/step/sideEffects';
import CollectingBarrierStep from '../../../../../proccess/traversal/step/util/CollectingBarrierStep';
import { EmptyStep } from '../../../../../proccess/traversal/step/util/EmptyStep';
import { HasStep } from '../../../../../proccess/traversal/step/filter';
import TinkerGraphStep from '../../step/sideEffects/TinkerGraphStep';
import TinkerCountGlobalStep from '../../step/map/TinkerCountGlobalStep';

/**
 * TinkerGraphCountStrategy
 * @constructor
 */
function TinkerGraphCountStrategy() {

}

TinkerGraphCountStrategy.prototype = {
  constructor: TinkerGraphCountStrategy,
  position: 10,
  apply(traversal) {
    if (!(traversal.getParent() instanceof EmptyStep))
      return;
    const steps = traversal.getSteps();
    if (steps.size() < 2 || !(steps.getValue(0) instanceof GraphStep) ||
      0 !== steps.getValue(0).getIds().length || !(steps.getValue(steps.size() - 1) instanceof CountGlobalStep))
      return;
    for (let i = 1; i < steps.size() - 1; i++) {
      const current = steps.getValue(i);
      if (!(current instanceof MapStep ||
        current instanceof IdentityStep ||
        current instanceof NoOpBarrierStep ||
        current instanceof CollectingBarrierStep) ||
        (current instanceof TraversalParent &&
        TraversalHelper.anyStepRecursively((s) => (s instanceof SideEffectStep || s instanceof AggregateStep), current)))
        return;
    }
    const elementClass = steps.getValue(0).getReturnClass();
    TraversalHelper.removeAllSteps(traversal);
    traversal.addStep(new TinkerCountGlobalStep(traversal, elementClass));
  },

  applyPost() {
    return new List([TinkerGraphStepStrategy]);
  }
};

mixin(TinkerGraphCountStrategy, TraversalStrategy.ProviderOptimizationStrategy.prototype);

const tinkerGraphCountStrategy = new TinkerGraphCountStrategy();

export default tinkerGraphCountStrategy;