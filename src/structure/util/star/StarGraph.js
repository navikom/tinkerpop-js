import { mixin, BaseConfiguration, ArrayUtils, Collections, List, IteratorUtils, Optional } from '../../../util';
import ElementHelper from '../../util/ElementHelper';
import Element from '../../Element';
import Graph from '../../Graph';
import Vertex from '../../Vertex';
import Edge from '../../Edge';
import Property from '../../Property';
import VertexProperty from '../../VertexProperty';
import T from '../../T';
import Direction from '../../Direction';
import EmptyProperty from '../../util/empty/EmptyProperty';


let _nextId = 0;
/**
 * StarGraph
 * @constructor
 */
function StarGraph() {
	Graph.call(this);
	this.starVertex = null;
	this.edgeProperties = null;
	this.metaProperties = null;
}

StarGraph.prototype = {
	constructor: StarGraph,
	/**
	 * Gets the {@link Vertex} representative of the {@link StarGraph}.
	 */
	getStarVertex() {
		return this.starVertex;
	},


	addVertex(...keyValues) {
		keyValues = ArrayUtils.checkArray(keyValues);
		if (!this.starVertex) {
			ElementHelper.legalPropertyKeyValueArray(keyValues);
			this.starVertex = new StarVertex(
				ElementHelper.getIdValue(keyValues).orElse(StarGraph.nextId()), ElementHelper.getLabelValue(keyValues).orElse(Vertex.DEFAULT_LABEL));
			ElementHelper.attachProperties(this.starVertex, VertexProperty.Cardinality.list, keyValues);
			return this.starVertex;
		} else
			return new StarAdjacentVertex(this.graph(), ElementHelper.getIdValue(keyValues).orElse(StarGraph.nextId()));
	},

	compute(graphComputerClass) {
		throw ("graph Computer Not Supported");
	},


	vertices(...vertexIds) {
		vertexIds = ArrayUtils.checkArray(vertexIds);
		if (!this.starVertex)
			return Collections.emptyIterator();
		else if (vertexIds.length > 0 && vertexIds[0] instanceof StarVertex)
			return new List(vertexIds).iterator();
		else if (ElementHelper.idExists(this.starVertex.id(), vertexIds))
			return IteratorUtils.of(this.starVertex);
		else
			return Collections.emptyIterator();
		/*return null == this.starVertex ?
		 Collections.emptyIterator() :
		 Stream.concat(
		 Stream.of(this.starVertex),
		 Stream.concat(
		 this.starVertex.outEdges.values()
		 .stream()
		 .flatMap(List::stream)
		 .map(Edge::inVertex),
		 this.starVertex.inEdges.values()
		 .stream()
		 .flatMap(List::stream)
		 .map(Edge::outVertex)))
		 .filter(vertex -> ElementHelper.idExists(vertex.id(), vertexIds))
		 .iterator();*/
	},

	edges(...edgeIds) {
		edgeIds = ArrayUtils.checkArray(edgeIds);
		return !this.starVertex ?
			Collections.emptyIterator() :
			[].concat(
				!this.starVertex.inEdges ? [] : this.starVertex.inEdges.values().toArray(),
				!this.starVertex.outEdges ? [] : this.starVertex.outEdges.values().toArray())
				.filter((edge) => {
				if (edgeIds.length > 0 && edgeIds[0] instanceof Edge)
					return ElementHelper.idExists(edge.id(), edgeIds.map((e) => e.getValue().id()).toArray());
				else
					return ElementHelper.idExists(edge.id(), edgeIds);
			}).iterator();
	},

	tx() {
		throw ("transactions Not Supported");
	},

	variables() {
		throw ("variables Not Supported");
	},

	configuration() {
		return StarGraph.STAR_GRAPH_CONFIGURATION;
	},

	features() {
		return StarGraphFeatures.INSTANCE;
	},

	applyGraphFilter(graphFilter) {
		if (!this.starVertex)
			return Optional.empty();
		const filtered = this.starVertex.applyGraphFilter(graphFilter);
		return filtered.isPresent() ? Optional.of(filtered.getValue().graph()) : Optional.empty();
	}
};

mixin(StarGraph, Graph.prototype);

StarGraph.STAR_GRAPH_CONFIGURATION = new BaseConfiguration();
StarGraph.STAR_GRAPH_CONFIGURATION.setProperty(Graph.GRAPH, 'StarGraph');

/**
 * Creates an empty {@link StarGraph}.
 */
StarGraph.open = () => {
	return new StarGraph();
};

StarGraph.nextId = () => {
	return _nextId++;
},

/**
 * Creates a new {@link StarGraph} from a {@link Vertex}.
 */
	StarGraph.of = (vertex) => {
		if (vertex instanceof StarVertex) return vertex.graph();
		// else convert to a star graph
		const starGraph = new StarGraph();
		const starVertex = starGraph.addVertex(T.id, vertex.id(), T.label, vertex.label());

		const supportsMetaProperties = vertex.graph().features().vertex().supportsMetaProperties();

		vertex.properties().forEachRemaining((vp) => {
			const starVertexProperty = starVertex.property(VertexProperty.Cardinality.list, vp.key(), vp.value(), T.id, vp.id());
			if (supportsMetaProperties)
				vp.properties().forEachRemaining((p) => starVertexProperty.property(p.key(), p.value()));
		});
		vertex.edges(Direction.IN).forEachRemaining((edge) => {
			const starEdge = starVertex.addInEdge(edge.label(), starGraph.addVertex(T.id, edge.outVertex().id()), T.id, edge.id());
			edge.properties().forEachRemaining((p) => starEdge.property(p.key(), p.value()));
		});

		vertex.edges(Direction.OUT).forEachRemaining((edge) => {
			const starEdge = starVertex.addOutEdge(edge.label(), starGraph.addVertex(T.id, edge.inVertex().id()), T.id, edge.id());
			edge.properties().forEachRemaining((p) => starEdge.property(p.key(), p.value()));
		});
		return starGraph;
	};

///////////////////////
//// STAR ELEMENT ////
//////////////////////
/**
 *
 * @param id
 * @param label
 * @constructor
 */
function StarElement(graph, id, label) {
	this._id = id;
	this._label = label;
	this._graph = graph;
}

StarElement.prototype = {
	constructor: StarElement,

	id() {
		return this._id;
	},

	label() {
		return this._label;
	},

	graph() {
		return this._graph;
	},

	getValue() {
		return this;
	}
}

mixin(StarElement, Element.prototype);

//////////////////////
//// STAR VERTEX ////
/////////////////////
/**
 *
 * @param id
 * @param label
 * @constructor
 */
function StarVertex(graph, id, label) {
	StarElement.call(this, graph, id, label);
	this.outEdges = null;
	this.inEdges = null;
	this.vertexProperties = null;
}

StarVertex.prototype = {
	constructor: StarVertex,

	dropEdges(direction, edgeLabel) {
		if (edgeLabel) {
			if (this.outEdges && (direction === Direction.OUT || direction === Direction.BOTH)) {
				this.outEdges.remove(edgeLabel);

				if (this.outEdges.isEmpty())
					this.outEdges = null;
			}
			if (this.inEdges && (direction === Direction.IN || direction === Direction.BOTH)) {
				this.inEdges.remove(edgeLabel);

				if (this.inEdges.isEmpty())
					this.inEdges = null;
			}
		} else {
			if ((direction === Direction.OUT || direction === Direction.BOTH) && this.outEdges) {
				this.outEdges.clear();
				this.outEdges = null;
			}
			if ((direction === Direction.IN || direction === Direction.BOTH) && this.inEdges) {
				this.inEdges.clear();
				this.inEdges = null;
			}
		}
	},

	dropVertexProperties(...propertyKeys) {
		propertyKeys = ArrayUtils.checkArray(propertyKeys);
		if (this.vertexProperties) {
			for (const key in propertyKeys) {
				this.vertexProperties.remove(key);
			}
		}
	},

	addEdge(label, inVertex, ...keyValues) {
		keyValues = ArrayUtils.checkArray(keyValues);
		const edge = this.addOutEdge(label, inVertex, keyValues);
		if (inVertex === this) {
			if (ElementHelper.getIdValue(keyValues).isPresent()) {
				// reuse edge ID from method params
				this.addInEdge(label, this, keyValues);
			} else {
				// copy edge ID that we just allocated with addOutEdge
				const keyValuesWithId = keyValues.slice();
				keyValuesWithId.push(T.id);
				keyValuesWithId.push(edge.id());
				this.addInEdge(label, this, keyValuesWithId);
			}
		}
		return edge;
	},

	property(cardinality, key, value, ...keyValues) {
		if (!key) {
			key = cardinality;
			const iterator = this.properties(key);
			return iterator.hasNext() ? iterator.next() : EmptyProperty;
		}
		if (!VertexProperty.Cardinality.contains(cardinality)) {
			if (value) {
				keyValues = [value].concat(ArrayUtils.checkArray(keyValues));
			}
			value = key;
			key = cardinality;
			cardinality = this.graph().features().vertex().getCardinality(cardinality);
		}

		ElementHelper.validateProperty(key, value);
		ElementHelper.legalPropertyKeyValueArray(keyValues);

		if (!this.vertexProperties)
			this.vertexProperties = new Map();
		const list = cardinality === VertexProperty.Cardinality.single
			? new List() : this.vertexProperties.getOrDefault(key, new List());
		const vertexProperty =
			new StarVertexProperty(this.graph(), ElementHelper.getIdValue(keyValues).orElse(StarGraph.nextId()), key, value);
		ElementHelper.attachProperties(vertexProperty, keyValues);
		list.add(vertexProperty);
		this.vertexProperties.put(key, list);
		return vertexProperty;
	},

	addOutEdge(label, inVertex, ...keyValues) {
		keyValues = ArrayUtils.checkArray(keyValues);
		ElementHelper.validateLabel(label);
		ElementHelper.legalPropertyKeyValueArray(keyValues);
		if (!this.outEdges)
			this.outEdges = new Map();
		let outE = this.outEdges.getValue(label);
		if (!outE) {
			outE = new List();
			this.outEdges.put(label, outE);
		}
		const outEdge = new StarOutEdge(this.graph(), ElementHelper.getIdValue(keyValues).orElse(StarGraph.nextId()), label, inVertex.id());
		ElementHelper.attachProperties(outEdge, keyValues);
		outE.add(outEdge);
		return outEdge;
	},

	addInEdge(label, outVertex, ...keyValues) {
		keyValues = ArrayUtils.checkArray(keyValues);
		ElementHelper.validateLabel(label);
		ElementHelper.legalPropertyKeyValueArray(keyValues);
		if (!this.inEdges)
			this.inEdges = new Map();
		let inE = this.inEdges.getValue(label);
		if (!inE) {
			inE = new List();
			this.inEdges.put(label, inE);
		}
		const inEdge = new StarInEdge(this.graph(), ElementHelper.getIdValue(keyValues).orElse(StarGraph.nextId()), label, outVertex.id());
		ElementHelper.attachProperties(inEdge, keyValues);
		inE.add(inEdge);
		return inEdge;
	},

	edges(direction, ...edgeLabels) {
		edgeLabels = ArrayUtils.checkArray(edgeLabels);
		if (direction === Direction.OUT) {
			return !this.outEdges ? Collections.emptyIterator() :
				edgeLabels.length == 0 ? this.outEdges.values().iterator() :
					this.outEdges.keySet().filter((entry) => ElementHelper.keyExists(entry.getKey(), edgeLabels)).map((entry) => entry.getValue()).iterator();
		} else if (direction === Direction.IN) {
			return !this.inEdges ? Collections.emptyIterator() :
				edgeLabels.length === 0 ?
					this.inEdges.values().iterator() :
					this.inEdges.keySet().filter((entry) => ElementHelper.keyExists(entry.getKey(), edgeLabels)).map((entry) => entry.getValue()).iterator();
		} else
			return IteratorUtils.concat(this.edges(Direction.IN, edgeLabels), this.edges(Direction.OUT, edgeLabels));
	},

	vertices(direction, ...edgeLabels) {
		edgeLabels = ArrayUtils.checkArray(edgeLabels);
		if (direction === Direction.OUT)
			return IteratorUtils.map(this.edges(direction, edgeLabels), (entry) => this.inVertex(entry.getValue()));
		else if (direction === Direction.IN)
			return IteratorUtils.map(this.edges(direction, edgeLabels), (entry) => this.outVertex(entry.getValue()));
		else
			return IteratorUtils.concat(this.vertices(Direction.IN, edgeLabels), this.vertices(Direction.OUT, edgeLabels));
	},

	remove() {
		throw ("The star vertex can not be removed from the StarGraph");
	},

	properties(...propertyKeys) {
		propertyKeys = ArrayUtils.checkArray(propertyKeys);
		if (!this.vertexProperties || this.vertexProperties.isEmpty())
			return Collections.emptyIterator();
		else if (propertyKeys.length === 0)
			return this.vertexProperties.keySet().map((entry) => entry.getValue()).iterator();
		else if (propertyKeys.length === 1)
			return this.vertexProperties.getOrDefault(propertyKeys[0], new List()).iterator();
		else
			return this.vertexProperties.keySet().filter((entry) => ElementHelper.keyExists(entry.getKey(), propertyKeys)).map((entry) => entry.getValue()).iterator();
	},

	///////////////

	applyGraphFilter(graphFilter) {
		if (!graphFilter.hasFilter())
			return Optional.of(this);
		else if (graphFilter.legalVertex(this)) {
			if (graphFilter.hasEdgeFilter()) {
				if (graphFilter.checkEdgeLegality(Direction.OUT).negative())
					this.dropEdges(Direction.OUT);
				if (graphFilter.checkEdgeLegality(Direction.IN).negative())
					this.dropEdges(Direction.IN);
				if (this.outEdges)
					for (const key in this.outEdges) {
						if (graphFilter.checkEdgeLegality(Direction.OUT, key).negative())
							this.dropEdges(Direction.OUT, key);
					}
				if (this.inEdges)
					for (const key in this.inEdges) {
						if (graphFilter.checkEdgeLegality(Direction.IN, key).negative())
							this.dropEdges(Direction.IN, key);
					}
				if (this.inEdges || this.outEdges) {
					const outEdges = new Map();
					const inEdges = new Map();
					graphFilter.legalEdges(this).forEachRemaining((edge) => {
						if (edge instanceof StarOutEdge) {
							let edges = outEdges.getValue(edge.label());
							if (!edges) {
								edges = new List();
								outEdges.put(edge.label(), edges);
							}
							edges.add(edge);
						} else {
							let edges = inEdges.getValue(edge.label());
							if (!edges) {
								edges = new List();
								inEdges.put(edge.label(), edges);
							}
							edges.add(edge);
						}
					});

					if (outEdges.isEmpty())
						this.dropEdges(Direction.OUT);
					else
						this.outEdges = outEdges;

					if (inEdges.isEmpty())
						this.dropEdges(Direction.IN);
					else
						this.inEdges = inEdges;
				}
			}
			return Optional.of(this);
		} else {
			return Optional.empty();
		}
	}
}

mixin(StarVertex, StarElement.prototype, Vertex.prototype);

///////////////////////////////
//// STAR VERTEX PROPERTY ////
//////////////////////////////
/**
 *
 * @param id
 * @param key
 * @param value
 * @constructor
 */
function StarVertexProperty(graph, id, key, value) {
	StarElement.call(this, graph, id, key);
	this._value = value;
}

StarVertexProperty.prototype = {
	constructor: StarVertexProperty,

	key() {
		return this.label();
	},

	value() {
		return this._value;
	},

	isPresent() {
		return true;
	},

	element() {
		return this.graph().starVertex;
	},

	remove() {
		if (this.graph().starVertex.vertexProperties)
			this.graph().starVertex.vertexProperties.getValue(this._label).remove(this);
	},

	properties(...propertyKeys) {
		const metaProperties = this.graph().metaProperties;
		const properties = !metaProperties ? null : metaProperties.getValue(this.id());
		if (!properties || properties.isEmpty())
			return Collections.emptyIterator();
		else if (propertyKeys.length === 0)
			return properties.keySet().map((entry) => new StarProperty(this.graph(), entry.getKey(), entry.getValue(), this)).iterator();
		else if (propertyKeys.length === 1) {
			const v = properties.getValue(propertyKeys[0]);
			return !v ?
				Collections.emptyIterator() :
				IteratorUtils.of(new StarProperty(this.graph(), propertyKeys[0], v, this));
		} else {
			return properties.keySet().filter((entry) => ElementHelper.keyExists(entry.getKey(), propertyKeys)).map((entry) => new StarProperty(this.graph(), entry.getKey(), entry.getValue(), this)).iterator();
		}
	},

	property(key, value) {
		let metaProperties = this.graph().metaProperties;
		if (!metaProperties)
			metaProperties = new List();
		let properties = metaProperties.getValue(this.id());
		if (!properties) {
			properties = new Map();
			metaProperties.put(this.id(), properties);
		}
		properties.put(key, value);
		return new StarProperty(this.graph(), key, value, this);
	}
}

mixin(StarVertexProperty, StarElement.prototype, VertexProperty.prototype);

///////////////////////////////
//// STAR ADJACENT VERTEX ////
//////////////////////////////
/**
 *
 * @param graph
 * @param id
 * @constructor
 */
function StarAdjacentVertex(graph, id) {
	this._id = id;
	this._graph = graph;
}

StarAdjacentVertex.prototype = {
	constructor: StarAdjacentVertex,

	addEdge(label, inVertex, ...keyValues) {
		if (inVertex === this._graph.starVertex)
			return this._graph.starVertex.addInEdge(label, this, keyValues);
		else
			throw ("adjacent Vertex Edges And Vertices Can Not Be Read Or Updated");
	},

	property(key, value, ...keyValues) {
		throw ("adjacent Vertex Properties Can Not Be Read Or Updated");
	},

	edges() {
		throw ("adjacent Vertex Properties Can Not Be Read Or Updated");
	},

	vertices() {
		throw ("adjacent Vertex Properties Can Not Be Read Or Updated");
	},

	id() {
		return this._id;
	},

	label() {
		throw ("adjacent Vertex Properties Can Not Be Read Or Updated");
	},

	graph() {
		return this._graph();
	},

	remove() {
		throw ("vertex Removal Not Supported");
	},

	properties() {
		throw ("adjacent Vertex Properties Can Not Be Read Or Updated");
	}
}

mixin(StarAdjacentVertex, Vertex.prototype);

////////////////////
//// STAR EDGE ////
///////////////////
/**
 *
 * @param graph
 * @param id
 * @param label
 * @param otherId
 * @constructor
 */
function StarEdge(graph, id, label, otherId) {
	StarElement.call(this, graph, id, label)
	this.otherId = otherId;
}

StarEdge.prototype = {
	constructor: StarEdge,

	property(key, value) {
		ElementHelper.validateProperty(key, value);
		if (!this.graph().edgeProperties)
			this.graph().edgeProperties = new Map();
		let properties = this.graph().edgeProperties.getValue(this.id());
		if (!properties) {
			properties = new Map();
			this.graph().edgeProperties.put(this.id(), properties);
		}
		properties.put(key, value);
		return new StarProperty(this.graph(), key, value, this);
	},

	properties(...propertyKeys) {
		propertyKeys = ArrayUtils.checkArray(propertyKeys)
		let properties = !this.graph().edgeProperties ? null : this.graph().edgeProperties.getValue(this.id());
		if (!properties || properties.isEmpty())
			return Collections.emptyIterator();
		else if (propertyKeys.length === 0)
			return properties.keySet().map((entry) => new StarProperty(this.graph(), entry.getKey(), entry.getValue(), this)).iterator();
		else if (propertyKeys.length === 1) {
			const v = properties.getValue(propertyKeys[0]);
			return !v ?
				Collections.emptyIterator() :
				IteratorUtils.of(new StarProperty(this.graph(), propertyKeys[0], v, this));
		} else {
			return properties.keySet().filter((entry) => ElementHelper.keyExists(entry.getKey(), propertyKeys)).map((entry) => new StarProperty(this.graph(), entry.getKey(), entry.getValue(), this)).iterator();
		}
	},

	vertices(direction) {
		if (direction === Direction.OUT)
			return IteratorUtils.of(this.outVertex());
		else if (direction === Direction.IN)
			return IteratorUtils.of(this.inVertex());
		else
			return IteratorUtils.of(this.outVertex(), this.inVertex());
	},

	remove() {
		throw ("edge Removal Not Supported");
	}
}

mixin(StarEdge, StarElement.prototype, Edge.prototype);

////////////////////////
//// STAR PROPERTY ////
///////////////////////
function StarProperty(graph, key, value, element) {
	this._graph = graph;
	this._key = key;
	this._value = value;
	this._element = element;
}

StarProperty.prototype = {
	constructor: StarProperty,
	key() {
		return this._key;
	},

	value() {
		return this._value;
	},

	isPresent() {
		return true;
	},

	element() {
		return this._element;
	},

	remove() {
		throw ("property Removal Not Supported");
	}
}

mixin(StarProperty, Property.prototype);

/**
 * StarGraphFeatures
 * @constructor
 */
function StarGraphFeatures() {

}

StarGraphFeatures.prototype = {
	constructor: StarGraphFeatures,
	/**
	 * Gets the features related to "graph" operation.
	 */
	graph() {
		return StarGraphGraphFeatures.INSTANCE;
	},

	/**
	 * Gets the features related to "vertex" operation.
	 */
	vertex() {
		return StarGraphVertexFeatures.INSTANCE;
	},

	/**
	 * Gets the features related to "edge" operation.
	 */
	edge() {
		return StarGraphEdgeFeatures.INSTANCE;
	},
}

mixin(StarGraphFeatures, Graph.Features.prototype);

StarGraphFeatures.INSTANCE = new StarGraphFeatures();

/**
 * StarGraphVertexFeatures
 * @constructor
 */
function StarGraphVertexFeatures() {

}

StarGraphVertexFeatures.prototype = {
	constructor: StarGraphVertexFeatures,
	properties() {
		return StarGraphVertexPropertyFeatures.INSTANCE;
	},

	supportsCustomIds() {
		return false;
	},

	willAllowId() {
		return true;
	}
};

mixin(StarGraphVertexFeatures, Graph.Features.VertexFeatures.prototype);

StarGraphVertexFeatures.INSTANCE = new StarGraphVertexFeatures();

/**
 * StarGraphEdgeFeatures
 * @constructor
 */
function StarGraphEdgeFeatures() {
}

StarGraphEdgeFeatures.prototype = {
	constructor: StarGraphEdgeFeatures,
	supportsCustomIds() {
		return false;
	},

	willAllowId() {
		return true;
	}
}


mixin(StarGraphEdgeFeatures, Graph.Features.EdgeFeatures.prototype);

StarGraphEdgeFeatures.INSTANCE = new StarGraphEdgeFeatures();

/**
 * StarGraphGraphFeatures
 * @constructor
 */
function StarGraphGraphFeatures() {
}

StarGraphGraphFeatures.prototype = {
	constructor: StarGraphGraphFeatures,
	supportsTransactions() {
		return false;
	},

	supportsPersistence() {
		return false;
	},

	supportsThreadedTransactions() {
		return false;
	}
}


mixin(StarGraphGraphFeatures, Graph.Features.GraphFeatures.prototype);

StarGraphGraphFeatures.INSTANCE = new StarGraphGraphFeatures();

function StarGraphVertexPropertyFeatures() {
}

StarGraphVertexPropertyFeatures.prototype = {
	constructor: StarGraphVertexPropertyFeatures,
	supportsCustomIds() {
		return false;
	},

	willAllowId() {
		return true;
	}
}


mixin(StarGraphVertexPropertyFeatures, Graph.Features.VertexPropertyFeatures.prototype);

StarGraphVertexPropertyFeatures.INSTANCE = new StarGraphVertexPropertyFeatures();


export default StarGraph;