import { List } from '../../../../util';
import { MapStep } from './MapStep';
import Vertex from '../../../../structure/Vertex';
import ElementHelper from '../../../../structure/util/ElementHelper';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * EdgeOtherVertexStep
 * @param traversal
 * @constructor
 */
function EdgeOtherVertexStep(traversal) {
	MapStep.call(this, traversal);
}

EdgeOtherVertexStep.prototype = Object.create(MapStep.prototype);
EdgeOtherVertexStep.prototype.constructor = EdgeOtherVertexStep;

EdgeOtherVertexStep.prototype.map = function(traverser) {
	const objects = traverser.path().objects();
	for (let i = objects.size() - 2; i >= 0; i--) {
		if (objects.get(i).type === Vertex.TYPE) {
			return ElementHelper.areEqual(objects.get(i), traverser.get().outVertex()) ?
				traverser.get().inVertex() :
				traverser.get().outVertex();
		}
	}
	throw ("The path history of the traverser does not contain a previous vertex: " + traverser.path());
};

EdgeOtherVertexStep.prototype.getRequirements = function() {
	return new List([TraverserRequirement.PATH]);
};

export { EdgeOtherVertexStep };
