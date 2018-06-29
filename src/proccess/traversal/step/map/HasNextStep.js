import { mixin } from '../../../../util';
import AbstractStep from './../util/AbstractStep';

/**
 * HasNextStep
 * @param traversal
 * @constructor
 */
function HasNextStep(traversal) {
  AbstractStep.call(this, traversal);
}
HasNextStep.prototype = {
  constructor: HasNextStep,
  processNextStart(){
  return this.starts.hasNext() ?
    this.starts.next().split(true, this) :
    this.getTraversal().getTraverserGenerator().generate(false, this, 1);
}
};

mixin(HasNextStep, AbstractStep.prototype);

export { HasNextStep };

