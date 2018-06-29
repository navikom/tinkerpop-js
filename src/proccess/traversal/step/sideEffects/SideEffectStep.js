import { mixin } from '../../../../util';
import AbstractStep from '../util/AbstractStep';

/**
 * SideEffectStep
 * @param traversal
 * @constructor
 */
function SideEffectStep(traversal) {
  AbstractStep.call(this, traversal);
}
SideEffectStep.prototype = {
  constructor: SideEffectStep,
  processNextStart() {
    const traverser = this.starts.next();
    this.sideEffect(traverser);
    return traverser;
  },
};

mixin(SideEffectStep, AbstractStep.prototype);

export { SideEffectStep };
