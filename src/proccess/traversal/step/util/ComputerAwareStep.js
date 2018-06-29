import { mixin, Iterator } from '../../../../util';
import AbstractStep from './../util/AbstractStep';
import GraphComputing from '../GraphComputing';

/**
 * ComputerAwareStep
 * @param traversal
 * @constructor
 */
function ComputerAwareStep(traversal) {
  AbstractStep.call(this, traversal);
  this.previousIterator = new Iterator();
}
ComputerAwareStep.prototype = {
  constructor: ComputerAwareStep,
  processNextStart() {
    while (true) {
      if (this.previousIterator.hasNext())
        return this.previousIterator.next();
      this.previousIterator = this.traverserStepIdAndLabelsSetByChild ? this.computerAlgorithm() : this.standardAlgorithm();
    }
  },

  onGraphComputer() {
    this.traverserStepIdAndLabelsSetByChild = true;
  }
};

mixin(ComputerAwareStep, AbstractStep.prototype, GraphComputing.prototype);

/**
 *
 * @param traversal
 * @constructor
 */
ComputerAwareStep.EndStep = function(traversal) {
  AbstractStep.call(this, traversal);
};

ComputerAwareStep.EndStep.prototype = {
  constructor: ComputerAwareStep.EndStep,

  processNextStart() {
    const start = this.starts.next();
    if (this.traverserStepIdAndLabelsSetByChild) {
      const step = this.getTraversal().getParent();
      start.setStepId(step.getNextStep().getId());
      start.addLabels(step.getLabels());
    }
    return start;
  },

  onGraphComputer() {
    this.traverserStepIdAndLabelsSetByChild = true;
  }
}

mixin(ComputerAwareStep.EndStep, AbstractStep.prototype, GraphComputing.prototype);

export default ComputerAwareStep;
