import { mixin, ArrayUtils, Iterator } from '../../../../util';
import AbstractStep from '../util/AbstractStep';
import GraphComputing from '../GraphComputing';
import StringFactory from '../../../../structure/util/StringFactory';
import Vertex from '../../../../structure/Vertex';
import Edge from '../../../../structure/Edge';
import T from '../../../../structure/T';

/**
 * GraphStep
 * @param traversal
 * @param returnClass
 * @param isStart
 * @param ids
 * @constructor
 */
function GraphStep(traversal, returnClass, isStart, ids) {
	AbstractStep.call(this, traversal);

	this.iterator = new Iterator();
	this.returnClass = returnClass;
	this.ids = ids;
	this.isStart = isStart;

	this.iteratorSupplier = this.returnClass === Vertex ?
		this.getTraversal().getGraph().vertices(this.ids) :
		this.getTraversal().getGraph().edges(this.ids);
}

GraphStep.prototype = Object.create(AbstractStep.prototype);
GraphStep.prototype.constructor = GraphStep;

mixin(GraphStep, GraphComputing.prototype);

GraphStep.prototype.getReturnClass = function() {
	return this.returnClass;
};

GraphStep.prototype.isStartStep = function() {
	return this.isStart;
};


GraphStep.prototype.returnsVertex = function() {
	return this.returnClass === Vertex;
};

GraphStep.prototype.returnsEdge = function() {
	return this.returnClass === Edge;
};

GraphStep.prototype.setIteratorSupplier = function(iteratorSupplier) {
	this.iteratorSupplier = iteratorSupplier;
};

GraphStep.prototype.getIds = function() {
	return this.ids;
};

GraphStep.prototype.addIds = function(...newIds) {
	newIds = ArrayUtils.checkArray(newIds);
	this.ids = this.ids.concat(newIds);
};

GraphStep.prototype.clearIds = function() {
	this.ids = [];
};

GraphStep.prototype.onGraphComputer = function() {
	this.iteratorSupplier = new Iterator();
	this.convertElementsToIds();
};

GraphStep.prototype.convertElementsToIds = function() {
	for (let i = 0; i < this.ids.length; i++) {    // if this is going to OLAP, convert to ids so you don't serialize elements
		if (this.ids[i] instanceof Vertex || this.ids[i] instanceof Edge) {
			this.ids[i] = this.ids[i].getId();
		}
	}
};

GraphStep.prototype.processNextStart = function() {
	while (true) {
		if (this.iterator.hasNext()) {
			const traverser = this.isStart ? this.getTraversal().getTraverserGenerator()
				.generate(this.iterator.next(), this, 1) : this.head.split(this.iterator.next(), this);
			return traverser;
		}
		if (this.isStart) {
			if (this.done) {
				throw ('No Such Element Exception');
			}
			else {
				this.done = true;
				this.iterator = !this.iteratorSupplier ? new Iterator() : this.iteratorSupplier;
				//console.log('GraphStep1', this, this.iterator)
			}
		} else {
			this.head = this.starts.next();
			this.iterator = !this.iteratorSupplier ? new Iterator() : this.iteratorSupplier;
		}
	}
};

GraphStep.prototype.reset = function() {
	AbstractStep.prototype.reset.call();
	this.head = null;
	this.done = false;
	this.iterator = new Iterator();
};

GraphStep.prototype.toString = function() {
	return StringFactory.stepString(this, this.returnClass.name.toLowerCase(), this.ids.join(","));
};

GraphStep.isStartStep = (step) => {
	return step instanceof GraphStep && step.isStartStep();
};

/**
 * Helper method for providers that want to "fold in" {@link HasContainer}'s based on id checking into the ids of the {@link GraphStep}.
 *
 * @param graphStep    the GraphStep to potentially {@link GraphStep#addIds(Object...)}.
 * @param hasContainer The {@link HasContainer} to check for id validation.
 * @return true if the {@link HasContainer} updated ids and thus, was processed.
 */
GraphStep.processHasContainerIds = (graphStep, hasContainer) => {
	//if (hasContainer.key() === T.id.getAccessor() && hasContainer.getBiPredicate()) {
	//
	//  graphStep.addIds(hasContainer.getValue());
	//  return true;
	//}
	return false;
};

export { GraphStep };
