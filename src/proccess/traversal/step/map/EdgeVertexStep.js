import { mixin, List } from '../../../../util';
import { FlatMapStep } from './FlatMapStep';
import Direction from '../../../../structure/Direction';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * EdgeVertexStep
 * @param traversal
 * @param direction
 * @constructor
 */
function EdgeVertexStep(traversal, direction) {
	FlatMapStep.call(this, traversal);
	this.direction = direction;
}
EdgeVertexStep.prototype = {
	constructor: EdgeVertexStep,


	flatMap(traverser) {
		return traverser.get().vertices(this.direction);
	},

	getDirection() {
		return this.direction;
	},

	reverseDirection() {
		this.direction = Direction.opposite(this.direction);
	},

	getRequirements() {
		return new List([TraverserRequirement.OBJECT]);
	}
};

mixin(EdgeVertexStep, FlatMapStep.prototype);

export { EdgeVertexStep };

