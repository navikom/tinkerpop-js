import { ConnectiveStep } from './ConnectiveStep';
import TraversalUtil from '../../util/TraversalUtil';

/**
 * AndStep
 * @param traversal
 * @param traversals
 * @constructor
 */
function AndStep(traversal, traversals) {
  ConnectiveStep.call(this, traversal, traversals);
}

AndStep.prototype = Object.create(ConnectiveStep.prototype);
AndStep.prototype.constructor = AndStep;

AndStep.prototype.filter = function(traverser) {
    for (let i = 0; i < this.traversals.size(); i++) {
      const traversal = this.traversals.get(i);
      if (!TraversalUtil.test(traverser, traversal))
        return false;
    }
    return true;
};

export { AndStep };
