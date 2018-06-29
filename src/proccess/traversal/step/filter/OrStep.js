import { ConnectiveStep } from './ConnectiveStep';
import TraversalUtil from '../../util/TraversalUtil';

/**
 * OrStep
 * @param traversal
 * @param traversals
 * @constructor
 */
function OrStep(traversal, traversals) {
	ConnectiveStep.call(this, traversal, traversals);
}

OrStep.prototype = Object.create(ConnectiveStep.prototype);
OrStep.prototype.constructor = OrStep;

OrStep.prototype.filter = function(traverser) {
	for (let i = 0; i < this.traversals.size(); i++) {
		const traversal = this.traversals.getValue(i);
		if (TraversalUtil.test(traverser, traversal))
			return true;
	}
	return false;
};

export { OrStep };
