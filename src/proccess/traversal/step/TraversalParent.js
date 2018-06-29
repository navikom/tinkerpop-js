import { List, ArrayUtils, Collections, isNull } from '../../../util';
/**
 *
 * @constructor
 */
function TraversalParent() {

}

TraversalParent.prototype = {
  constructor: TraversalParent,
  propType: 'TraversalParent',
  getGlobalChildren() {
    return new List();
  },

  getLocalChildren() {
    return new List();
  },

  addLocalChild(localChildTraversal) {
    throw ('This traversal parent does not support the addition of local traversals');
  },

  addGlobalChild(globalChildTraversal) {
    throw ('This traversal parent does not support the addition of global traversals');
  },

  removeLocalChild(localChildTraversal) {
    throw ('This traversal parent does not support the removal of local traversals');
  },

  removeGlobalChild(globalChildTraversal) {
    throw ('This traversal parent does not support the removal of global traversals');
  },

  getSelfAndChildRequirements(...selfRequirements) {
    selfRequirements = ArrayUtils.checkArray(selfRequirements);
    const requirements = new List();

    Collections.addAll(requirements, selfRequirements);
    for (let i = 0; i < this.getLocalChildren().size(); i++) {
      const local = this.getLocalChildren().getValue(i);
      requirements.addAll(local.getTraverserRequirements());
    }
    for (let i = 0; i < this.getGlobalChildren().size(); i++) {
      const global = this.getGlobalChildren().getValue(i);
      requirements.addAll(global.getTraverserRequirements());
    }
    return requirements;
  },
  asStep() {
    return this;
  },

  integrateChild(childTraversal) {
    if (isNull(childTraversal)) {
      return null;
    }

    childTraversal.setParent(this);
    childTraversal.getSideEffects().mergeInto(this.asStep().getTraversal().getSideEffects());
    childTraversal.setSideEffects(this.asStep().getTraversal().getSideEffects());
    return childTraversal;
  },

  toString() {
    return this.constructor.name;
  }
};

TraversalParent.TYPE = 'TraversalParent';

export default TraversalParent;
