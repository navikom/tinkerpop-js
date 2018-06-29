import { mixin } from '../../../../util';
import AbstractStep from './../util/AbstractStep';

/**
 * IdentityStep
 * @param traversal
 * @constructor
 */
function IdentityStep(traversal) {
  AbstractStep.call(this, traversal);
}
IdentityStep.prototype = {
  constructor: IdentityStep,
  processNextStart() {
    return this.starts.next();
  },
};

mixin(IdentityStep, AbstractStep.prototype);

export { IdentityStep };
