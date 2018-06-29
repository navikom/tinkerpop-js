import { mixin } from '../../../../util';
import { MapStep } from './MapStep';
import TraversalParent from '../TraversalParent';
import TraversalUtil from '../../util/TraversalUtil';

/**
 * TraversalFlatMapStep
 * @param traversal
 * @param flatMapTraversal
 * @constructor
 */
function TraversalFlatMapStep(traversal, flatMapTraversal) {
  MapStep.call(this, traversal);
  this.flatMapTraversal = this.integrateChild(flatMapTraversal.asAdmin());
}

TraversalFlatMapStep.prototype = {
  constructor: TraversalFlatMapStep,
  flatMap(traverser) {
    return TraversalUtil.applyAll(traverser, this.flatMapTraversal);
  },

  getLocalChildren() {
    return this.flatMapTraversal;
  },

  setTraversal(parentTraversal) {
    MapStep.prototype.setTraversal.call(this, parentTraversal);
    this.integrateChild(this.flatMapTraversal);
  },

  clone() {
    const clone = MapStep.prototype.clone();
    clone.flatMapTraversal = this.flatMapTraversal.clone();
    return clone;
  },

  getRequirements() {
    return this.getSelfAndChildRequirements();
  },
};

mixin(TraversalFlatMapStep, MapStep.prototype, TraversalParent.prototype);

export { TraversalFlatMapStep };
