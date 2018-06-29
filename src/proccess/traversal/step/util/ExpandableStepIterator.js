import { Iterator } from '../../../../util';
import TraverserSet from '../../traverser/util/TraverserSet';
/**
 *
 * @param hostStep
 * @constructor
 */
function ExpandableStepIterator(hostStep) {
  this.hostStep = hostStep;
  this.traverserSet = new TraverserSet();
}

ExpandableStepIterator.prototype = {
  constructor: ExpandableStepIterator,
  hasNext() {
    return !this.traverserSet.isEmpty() || this.hostStep.getPreviousStep().hasNext();
  },

  next() {

    if (!this.traverserSet.isEmpty()) {
      return this.traverserSet.remove();
    }
    //console.log('ExpandableStepIterator', !this.traverserSet.isEmpty(), this.hostStep, this.hostStep.getPreviousStep());
    // ///////////
    if (this.hostStep.getPreviousStep().hasNext()) {
      return this.hostStep.getPreviousStep().next();
    }

    // ///////////
    return this.traverserSet.remove();
  },

  add(traverser) {
    if(traverser instanceof Iterator){
      const iterator = traverser;
      iterator.forEachRemaining((entry) => this.traverserSet.add(entry));
    } else {
      this.traverserSet.add(traverser);
    }

  },

  forEachRemaining(callback) {
    while (this.hasNext()) {
      callback(this.next());
    }
  },

  clear() {
    this.traverserSet.clear();
  },
};
export default ExpandableStepIterator;
