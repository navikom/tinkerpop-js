import { List, ArrayUtils } from '../../../../util';
import { FlatMapStep } from './FlatMapStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';
import Vertex from '../../../../structure/Vertex';
import Edge from '../../../../structure/Edge';
import StringFactory from '../../../../structure/util/StringFactory';

/**
 * VertexStep
 * @param traversal
 * @param returnClass
 * @param isStart
 * @param ids
 * @constructor
 */
function VertexStep(traversal, returnClass, direction, edgeLabels) {
	FlatMapStep.call(this, traversal);
	// console.log('VertexStep', direction, edgeLabels);
	this.direction = direction;
	this.edgeLabels = ArrayUtils.checkArray(edgeLabels);
	this.returnClass = returnClass;
}

VertexStep.prototype = Object.create(FlatMapStep.prototype);
VertexStep.prototype.constructor = VertexStep;

VertexStep.prototype.flatMap = function(traverser) {
	//console.log('VertexStep', this, traverser, traverser.get(), this.direction, this.edgeLabels,
	//  traverser.get().vertices(this.direction, this.edgeLabels) );
	return this.returnClass === Vertex ?
		traverser.get().vertices(this.direction, this.edgeLabels) :
		traverser.get().edges(this.direction, this.edgeLabels);
};

VertexStep.prototype.getDirection = function() {
	return this.direction;
};

VertexStep.prototype.getEdgeLabels = function() {
	return this.edgeLabels;
};

VertexStep.prototype.getReturnClass = function() {
	return this.returnClass;
};

VertexStep.prototype.reverseDirection = function() {
	this.direction = this.direction.opposite();
};

VertexStep.prototype.returnsVertex = function() {
	return this.returnClass === Vertex;
};

VertexStep.prototype.returnsEdge = function() {
	return this.returnClass === Edge;
};
VertexStep.prototype.getRequirements = function() {
	return new List([TraverserRequirement.OBJECT]);
};

VertexStep.prototype.toString = function() {
	return StringFactory.stepString(this, this.direction,
		new List(this.edgeLabels), this.returnClass.name.toLowerCase());
};

export { VertexStep };
