import { mixin } from '../../../../util';
import AbstractStep from '../util/AbstractStep';

/**
 * FilterStep
 * @param traversal
 * @constructor
 */
function FilterStep(traversal) {
  AbstractStep.call(this, traversal);
}

FilterStep.prototype = {
  constructor: FilterStep,
  type: 'FilterStep',

  processNextStart() {
    while (true) {
      //console.log('FilterStep', this, this.starts);
      const traverser = this.starts.next();
      //console.log('FilterStep1', traverser)
      const filter = this.filter(traverser);
      //console.log('FilterStep2', filter)
      if (filter) {
        return traverser;
      }
    }
  },

};

mixin(FilterStep, AbstractStep.prototype);
FilterStep.TYPE = 'FilterStep';

export { FilterStep };
