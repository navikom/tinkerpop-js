import { mixin, ArrayUtils, List } from '../../../../util';
import TraversalParent from '../TraversalParent';
import { FilterStep } from './FilterStep';

/**
 * ConnectiveStep
 * @param traversal
 * @param traversals
 * @constructor
 */
function ConnectiveStep(traversal, traversals) {
  FilterStep.call(this, traversal);
  this.traversals = new List(traversals.map((t) => t.asAdmin()));
  this.traversals.forEach((t) => this.integrateChild(t));
}

ConnectiveStep.prototype = {
  constructor: ConnectiveStep,
  getLocalChildren() {
    return this.traversals;
  },

  getRequirements() {
    return this.getSelfAndChildRequirements();
  },

  addLocalChild(localChildTraversal) {
    this.traversals.add(this.integrateChild(localChildTraversal));
  },

  clone() {
    const clone = Object.assign(Object.create(this), this);

    clone.traversals = new List();
    for (let i = 0; i < this.traversals.size(); i++) {
      const traversal = this.traversals.getValue(i);
      clone.traversals.add(traversal.clone());
    }
    return clone;
  },

  setTraversal(parentTraversal) {
    FilterStep.prototype.setTraversal.call(this, parentTraversal);
    for (let i = 0; i < this.traversals.size(); i++) {
      const traversal = this.traversals.getValue(i);
      this.integrateChild(traversal);
    }
  },
};

mixin(ConnectiveStep, FilterStep.prototype, TraversalParent.prototype);

ConnectiveStep.Connective = {AND: 'AND', OR: 'OR'};

export { ConnectiveStep };
