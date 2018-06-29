import { mixin, List } from '../../../../util';
import { SideEffectStep } from './SideEffectStep';
import Graph from '../../../../structure/Graph';
import GraphFactory from '../../../../structure/util/GraphFactory';
import T from '../../../../structure/T';
import Direction from '../../../../structure/Direction';
import TraverserRequirement from '../../traverser/TraverserRequirement';
import SideEffectCapable from '../SideEffectCapable';

const REQUIREMENTS = new List([TraverserRequirement.OBJECT, TraverserRequirement.SIDE_EFFECTS]);

/**
 * SubgraphStep
 * @param traversal
 * @param sideEffectKey
 * @constructor
 */
function SubgraphStep(traversal, sideEffectKey) {
	SideEffectStep.call(this, traversal);
	this.subgraphSupportsMetaProperties = false;
	this.sideEffectKey = sideEffectKey;
	this.getTraversal().asAdmin().getSideEffects()
		.registerSupplierIfAbsent(this.sideEffectKey, () => GraphFactory.open(traversal));
}

SubgraphStep.prototype = Object.create(SideEffectStep.prototype);
SubgraphStep.prototype.constructor = SubgraphStep;

mixin(SubgraphStep, SideEffectCapable.prototype);

SubgraphStep.prototype.sideEffect = function(traverser) {
	this.parentGraphFeatures = this.traversal.getGraph().features().vertex();
	if (null === this.subgraph || undefined === this.subgraph) {
		this.subgraph = traverser.sideEffects(this.sideEffectKey);
		if (!this.subgraph.features().vertex().supportsUserSuppliedIds()
			|| !this.subgraph.features().edge().supportsUserSuppliedIds())
			throw ("The provided subgraph must support user supplied ids for vertices and edges: "
			+ this.subgraph.constructor.name);
	}

	this.subgraphSupportsMetaProperties = this.subgraph.features().vertex().supportsMetaProperties();

	this.addEdgeToSubgraph(traverser.get());
};

SubgraphStep.prototype.getSideEffectKey = function() {
	return this.sideEffectKey;
};

SubgraphStep.prototype.getRequirements = function() {
	return REQUIREMENTS;
};

SubgraphStep.prototype.clone = function() {
	const clone = SideEffectStep.prototype.clone.call(this);
	return clone;
};

SubgraphStep.prototype.getOrCreate = function(vertex) {
	const vertexIterator = this.subgraph.vertices(vertex.id());
	if (vertexIterator.hasNext()) return vertexIterator.next();
	const subgraphVertex = this.subgraph.addVertex(T.id, vertex.id(), T.label, vertex.label());

	vertex.properties().forEachRemaining(vertexProperty => {
		const cardinality = this.parentGraphFeatures.getCardinality(vertexProperty.key());
		const subgraphVertexProperty = subgraphVertex.property(
			cardinality, vertexProperty.key(), vertexProperty.value(), T.id, vertexProperty.id());

		// only iterate the VertexProperties if the current graph can have them and if the subgraph can support
		// them. unfortunately we don't have a way to write a test for this as we dont' have a graph that supports
		// user supplied ids and doesn't support metaproperties.
		if (this.parentGraphFeatures.supportsMetaProperties() && this.subgraphSupportsMetaProperties) {
			vertexProperty.properties().forEachRemaining(property => subgraphVertexProperty.property(property.key(), property.value()));
		}
	});
	return subgraphVertex;
};

SubgraphStep.prototype.addEdgeToSubgraph = function(edge) {
	const edgeIterator = this.subgraph.edges(edge.id());
	if (edgeIterator.hasNext()) return;
	const vertexIterator = edge.vertices(Direction.BOTH);
	const subGraphOutVertex = this.getOrCreate(vertexIterator.next());
	const subGraphInVertex = this.getOrCreate(vertexIterator.next());
	const subGraphEdge = subGraphOutVertex.addEdge(edge.label(), subGraphInVertex, T.id, edge.id());
	edge.properties().forEachRemaining(property => subGraphEdge.property(property.key(), property.value()));
};

export { SubgraphStep };

