import { List } from '../../../../../util';
import { TinkerHelper } from '../../../../structure';
import { GraphStep } from '../../../../../proccess/traversal/step/map';
import HasContainer from '../../../../../proccess/traversal/step/util/HasContainer';
import AndP from '../../../../../proccess/traversal/util/AndP';
import StringFactory from '../../../../../structure/util/StringFactory';
import Vertex from '../../../../../structure/Vertex';
import Edge from '../../../../../structure/Edge';


/**
 * TinkerGraphStep
 * @param originalGraphStep
 * @constructor
 */
function TinkerGraphStep(originalGraphStep) {
	GraphStep.call(this,
		originalGraphStep.getTraversal(),
		originalGraphStep.getReturnClass(),
		originalGraphStep.isStartStep(),
		originalGraphStep.getIds()
	);

	this.hasContainers = new List();
	originalGraphStep.getLabels().forEach(label => this.addLabel(label));
	this.setIteratorSupplier(Vertex === this.returnClass ? this.vertices() : this.edges());
}

TinkerGraphStep.prototype = Object.create(GraphStep.prototype);
TinkerGraphStep.prototype.constructor = TinkerGraphStep;

TinkerGraphStep.prototype.edges = function() {
	const graph = this.getTraversal().getGraph();
	const indexedContainer = this.getIndexKey(Edge);
	// ids are present, filter on them first
	if (this.ids && this.ids.length > 0) {
		return this.iteratorList(graph.edges(this.ids));
	}
	return !indexedContainer ?
		this.iteratorList(graph.edges()) :
		TinkerHelper.queryEdgeIndex(graph, indexedContainer.getKey(), indexedContainer.getPredicate().getValue()).iterator()
			.filter(edge => HasContainer.testAll(edge.getValue(), this.hasContainers)).iterator();
};

TinkerGraphStep.prototype.vertices = function() {
	const graph = this.getTraversal().getGraph();
	const indexedContainer = this.getIndexKey(Vertex);
	// ids are present, filter on them first
	if (this.ids && this.ids.length > 0) {
		return this.iteratorList(graph.vertices(this.ids));
	}
	return !indexedContainer ?
		this.iteratorList(graph.vertices()) :
		TinkerHelper.queryVertexIndex(graph, indexedContainer.getKey(), indexedContainer.predicate().getValue()).iterator()
			.filter(vertex => HasContainer.testAll(vertex.getValue(), this.hasContainers)).iterator();
};

TinkerGraphStep.prototype.getIndexKey = function(indexedClass) {
	const indexedKeys = this.getTraversal().getGraph().getIndexedKeys(indexedClass);
	const itty = this.hasContainers.iterator()
		.filter(c => c.getValue().predicate().getBiPredicate() && indexedKeys.contains(c.getValue().key())).iterator();
	return itty.hasNext() ? itty.next() : null;
};

TinkerGraphStep.prototype.iteratorList = function(iterator) {
	const list = new List();
	while (iterator.hasNext()) {
		const e = iterator.next();
		if (HasContainer.testAll(e, this.hasContainers)) {
			list.add(e);
		}
	}
	return list.iterator();
};

TinkerGraphStep.prototype.getHasContainers = function() {
	return this.hasContainers;
};

TinkerGraphStep.prototype.addHasContainer = function(hasContainer) {
	if (hasContainer.predicate() instanceof AndP) {
		const predicates = hasContainer.predicate().getPredicates();

		for (let i = 0; i < predicates.size(); i++) {
			const predicate = predicates.getValue(i);
			this.addHasContainer(new HasContainer(hasContainer.key(), predicate));
		}
	} else {
		this.hasContainers.add(hasContainer);
	}
};

TinkerGraphStep.prototype.toString = function() {
	if (this.hasContainers.isEmpty())
		return GraphStep.prototype.toString.call(this);
	else
		return 0 === this.ids.length ?
			StringFactory.stepString(this, this.returnClass.name.toLowerCase(), this.hasContainers) :
			StringFactory.stepString(this, this.returnClass.name.toLowerCase(), new List(this.ids), this.hasContainers);
};

export default TinkerGraphStep;
