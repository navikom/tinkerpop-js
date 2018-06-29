import { mixin, List } from '../../../../util';
import TraversalParent from '../TraversalParent';
import TraversalUtil from '../../util/TraversalUtil';
import { FilterStep } from './FilterStep';

/**
 * TraversalFilterStep
 * @param traversal
 * @param filterTraversal
 * @constructor
 */
function TraversalFilterStep(traversal, filterTraversal) {
  FilterStep.call(this, traversal);
  this.filterTraversal = this.integrateChild(filterTraversal.asAdmin());
}

TraversalFilterStep.prototype = {
  constructor: TraversalFilterStep,

  filter(traverser) {
    //console.log('TraversalFilterStep filter', traverser, this.filterTraversal)
    return TraversalUtil.test(traverser, this.filterTraversal);
  },

  getLocalChildren() {
    return new List([this.filterTraversal]);
  },

  getRequirements() {
    return this.getSelfAndChildRequirements();
  },

  setTraversal(parentTraversal) {
    FilterStep.prototype.setTraversal.call(this, parentTraversal);
    this.integrateChild(this.filterTraversal);
  },
};

mixin(TraversalFilterStep, FilterStep.prototype, TraversalParent.prototype);

export { TraversalFilterStep };
