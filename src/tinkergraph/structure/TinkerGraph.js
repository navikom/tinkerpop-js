import { v4 } from 'uuid';
import { mixin, ArrayUtils, ConcurrentHashMap, Logger } from '../../util';

import __ from '../../proccess/traversal/dsl/graph/__';

import GlobalCache from '../../proccess/traversal/GlobalCache';
import Graph from '../../structure/Graph';
import StringFactory from '../../structure/util/StringFactory';
import Element from '../../structure/Element';
import Vertex from '../../structure/Vertex';
import Edge from '../../structure/Edge';
import VertexProperty from '../../structure/VertexProperty';
import ElementHelper from '../../structure/util/ElementHelper';
import { Map, List, Collections } from '../../util';
import { TinkerVertex } from './TinkerVertex';
import { TinkerEdge } from './TinkerEdge';
import { TinkerGraphVariables } from './TinkerGraphVariables';
import tinkerGraphStepStrategy from '../process/traversal/strategy/optimization/TinkerGraphStepStrategy';
import tinkerGraphCountStrategy from '../process/traversal/strategy/optimization/TinkerGraphCountStrategy';
import { SubgraphStep } from '../../proccess/traversal/step/sideEffects';
import { TinkerIndex } from './TinkerIndex';
import { BaseConfiguration } from '../../util';
import GraphSONIo from '../../structure/io/graphson/GraphSONIo';

let currentId = -1;

/**
 * An in-memory (with optional persistence on calls to {@link #close()}), reference implementation of the property
 * graph interfaces provided by TinkerPop.
 *
 * @constructor
 */
function TinkerGraph(configuration, anonymous) {
	Graph.call(this, anonymous, TinkerGraph);

	GlobalCache.registerStrategies(TinkerGraph.TYPE, GlobalCache.getStrategies('Graph').addStrategies(
		tinkerGraphStepStrategy,
		tinkerGraphCountStrategy));

	this._features = new TinkerGraphFeatures(configuration);
	this._vertices = new ConcurrentHashMap();
	this._edges = new ConcurrentHashMap();
	this._variables = null;
	this.vertexIndex = null;
	this.edgeIndex = null;

	this.configuration = configuration;

	this.idManager = TinkerGraph.DefaultIdManager;


	this.graphLocation = configuration.getString(TinkerGraph.GREMLIN_TINKERGRAPH_GRAPH_LOCATION, null);
	this.graphFormat = configuration.getString(TinkerGraph.GREMLIN_TINKERGRAPH_GRAPH_FORMAT, null);
	this.vertexIdManager = TinkerGraph.selectIdManager(configuration, TinkerGraph.GREMLIN_TINKERGRAPH_VERTEX_ID_MANAGER);
	this.edgeIdManager = TinkerGraph.selectIdManager(configuration, TinkerGraph.GREMLIN_TINKERGRAPH_EDGE_ID_MANAGER);
	this.vertexPropertyIdManager = TinkerGraph.selectIdManager(configuration, TinkerGraph.GREMLIN_TINKERGRAPH_VERTEX_PROPERTY_ID_MANAGER);
	Logger.enabled = configuration.getString(TinkerGraph.GREMLIN_LOGS, false);

	if ((this.graphLocation !== null && this.graphFormat === null) || (this.graphLocation === null && this.graphFormat !== null)) {
		throw (`The ${TinkerGraph.GREMLIN_TINKERGRAPH_GRAPH_LOCATION}
    and ${TinkerGraph.GREMLIN_TINKERGRAPH_GRAPH_LOCATION} must both be specified if either is present`);
	}

	if (this.graphLocation !== null) this.loadGraph();
}

TinkerGraph.prototype = {
	constructor: TinkerGraph,
	type: TinkerGraph.TYPE,
	// //////////// STRUCTURE API METHODS //////////////////

	addVertex(...keyValues) {
		keyValues = ArrayUtils.checkArray(keyValues);
		ElementHelper.legalPropertyKeyValueArray(keyValues);
		let idValue = ElementHelper.getIdValue(keyValues).orElse(undefined);
		const label = ElementHelper.getLabelValue(keyValues).orElse(Vertex.DEFAULT_LABEL);
		if (idValue) {
			if (this._vertices.contains(idValue)) {
				throw (`vertex With Id (${idValue}) Already Exists`);
			}
		} else {
			idValue = this.vertexIdManager.getNextId(this);
		}

		const vertex = new TinkerVertex(idValue, label, this);
		this._vertices.put(vertex.id(), vertex);

		ElementHelper.attachProperties(vertex, VertexProperty.Cardinality.list, keyValues);
		return vertex;
	},

	variables() {
		if (!this._variables) {
			this._variables = new TinkerGraphVariables();
		}
		return this._variables;
	},

	io(builder = GraphSONIo.build()) {
		return builder.graph(this).create();
	},


	clear() {
		this._vertices.clear();
		this._edges.clear();
		this._variables = null;

		this.vertexIndex = null;
		this.edgeIndex = null;

		currentId = -1;
	},

	close() {
		if (this.graphLocation) this.saveGraph();
	},

	getConfiguration() {
		return this.configuration;
	},

	vertices(...vertexIds) {
		vertexIds = ArrayUtils.checkArray(vertexIds);
		const iterator = this.createElementIterator(Element.TYPES.VERTEX, this._vertices, this.idManager, vertexIds);
		return iterator;
	},

	edges(...edgeIds) {
		edgeIds = ArrayUtils.checkArray(edgeIds);
		return this.createElementIterator(Element.TYPES.EDGE, this._edges, this.idManager, edgeIds);
	},

	loadGraph() {
		try {
			this.io(GraphSONIo.build()).readGraph(this.graphLocation);
		} catch (ex) {
			throw (`Could not load graph at ${this.graphLocation} error message: ${ex}`);
		}
	},

	saveGraph() {
		try {
			this.io(GraphSONIo.build()).writeGraph(this.graphLocation);
		} catch (ex) {
			throw (`Could not save graph at ${this.graphLocation} error message: ${ex}`);
		}
	},

	createElementIterator(clazz, elements, idManager, ids) {
		ids = ArrayUtils.checkArray(ids);
		let iterator;
		if (ids.length === 0) {
			iterator = elements.keySet();
		} else {
			const idList = new List(ids);
			//this.validateHomogenousIds(idList);

			let list = new List();
			if (Object.keys(ids[0]).length > 0 && clazz === ids[0].type) {
				list = idList.iterator().filter((entity) => elements.containsKey(entity.getValue().id()));
			} else {
				idList.iterator().filter(entity => elements.containsKey(entity.getValue()))
					.iterator().forEachRemaining((id) => list.add(elements.getValue(id)))
			}

			return list.iterator();
		}
		//console.log('createElementIterator', iterator.size())
		return iterator;
	},

	/**
	 * Return TinkerGraph feature set.
	 * <p/>
	 * <b>Reference Implementation Help:</b> Implementers only need to implement features for which there are
	 * negative or instance configured features.  By default, all
	 * {@link org.apache.tinkerpop.gremlin.structure.Graph.Features} return true.
	 */
	features() {
		return this._features;
	},

	validateHomogenousIds(ids) {
		const iterator = ids.iterator();
		let id = iterator.next();
		if (!id) {
			throw ('id Args Must Be Either Id Or Element');
		}
		const firstClass = id;
		while (iterator.hasNext()) {
			id = iterator.next();
			console.log(id, firstClass)
			if (!id || id !== firstClass) {
				throw ('id Args Must Be Either Id Or Element');
			}
		}
	},

	// /////////// GRAPH SPECIFIC INDEXING METHODS ///////////////

	/**
	 * Create an index for said element class ({@link Vertex} or {@link Edge}) and said property key.
	 * Whenever an element has the specified key mutated, the index is updated.
	 * When the index is created, all existing elements are indexed to ensure that they are captured by the index.
	 *
	 * @param key          the property key to index
	 * @param elementClass the element class to index
	 * @param <E>          The type of the element class
	 */
	createIndex(key, elementClass) {
		if (Vertex === elementClass) {
			if (!this.vertexIndex) this.vertexIndex = new TinkerIndex(this, TinkerVertex);
			this.vertexIndex.createKeyIndex(key);
		} else if (Edge === elementClass) {
			if (this.edgeIndex == null) this.edgeIndex = new TinkerIndex(this, TinkerEdge);
			this.edgeIndex.createKeyIndex(key);
		} else {
			throw (`Class is not indexable: ${elementClass}`);
		}
	},

	/**
	 * Drop the index for the specified element class ({@link Vertex} or {@link Edge}) and key.
	 *
	 * @param key          the property key to stop indexing
	 * @param elementClass the element class of the index to drop
	 * @param <E>          The type of the element class
	 */
	dropIndex(key, elementClass) {
		if (Vertex === elementClass) {
			if (!this.vertexIndex) this.vertexIndex.dropKeyIndex(key);
		} else if (Edge === elementClass) {
			if (!this.edgeIndex) this.edgeIndex.dropKeyIndex(key);
		} else {
			throw("Class is not indexable: " + elementClass);
		}
	},

	/**
	 * Return all the keys currently being index for said element class  ({@link Vertex} or {@link Edge}).
	 *
	 * @param elementClass the element class to get the indexed keys for
	 * @param <E>          The type of the element class
	 * @return the set of keys currently being indexed
	 */
	getIndexedKeys(elementClass) {
		if (Vertex === elementClass) {
			return !this.vertexIndex ? Collections.emptySet() : this.vertexIndex.getIndexedKeys();
		} else if (Edge === elementClass) {
			return null == this.edgeIndex ? Collections.emptySet() : this.edgeIndex.getIndexedKeys();
		} else {
			throw("Class is not indexable: " + elementClass);
		}
	},
	toString() {
		return StringFactory.graphString(this, "vertices:" + this._vertices.size() + " edges:" + this._edges.size());
	}

};

mixin(TinkerGraph, Graph.prototype);

TinkerGraph.GREMLIN_TINKERGRAPH_VERTEX_ID_MANAGER = 'gremlin.tinkergraph.vertexIdManager';
TinkerGraph.GREMLIN_TINKERGRAPH_EDGE_ID_MANAGER = 'gremlin.tinkergraph.edgeIdManager';
TinkerGraph.GREMLIN_TINKERGRAPH_VERTEX_PROPERTY_ID_MANAGER = 'gremlin.tinkergraph.vertexPropertyIdManager';
TinkerGraph.GREMLIN_TINKERGRAPH_DEFAULT_VERTEX_PROPERTY_CARDINALITY = 'gremlin.tinkergraph.defaultVertexPropertyCardinality';
TinkerGraph.GREMLIN_TINKERGRAPH_GRAPH_LOCATION = 'gremlin.tinkergraph.graphLocation';
TinkerGraph.GREMLIN_TINKERGRAPH_GRAPH_FORMAT = 'gremlin.tinkergraph.graphFormat';
TinkerGraph.GREMLIN_LOGS = 'gremlin.tinkergraph.logs';
TinkerGraph.EMPTY_CONFIGURATION = new BaseConfiguration();
TinkerGraph.EMPTY_CONFIGURATION.setProperty(Graph.GRAPH, 'TinkerGraph');

TinkerGraph.TYPE = 'TinkerGraph';

/**
 * open
 * @param configuration
 * @returns {TinkerGraph}
 */
TinkerGraph.open = (configuration) => {
	return new TinkerGraph(configuration || TinkerGraph.EMPTY_CONFIGURATION, __);
};

/**
 * selectIdManager
 * @param config
 * @param configKey
 * @returns {*}
 */
TinkerGraph.selectIdManager = (config, configKey) => {
	return config.getString(configKey, TinkerGraph.NumberIDType);
};

/**
 *
 * @type {{getNextId: TinkerGraph.DefaultIdManager.getNextId,
 * generateUUID: TinkerGraph.DefaultIdManager.generateUUID}}
 */
TinkerGraph.DefaultIdManager = {
	getNextId: (graph) => {
		if (!graph) return currentId++;
		const existingIds = graph._vertices.keys().toArray().concat(graph._edges.keys().toArray()).filter((id) => !isNaN(id));
		while (existingIds.includes(++currentId)) {
		}
		return currentId;
	},
	generateUUID: () => {
		return v4();
	},
};

/**
 * NumberIDType
 * @type {{getNextId: TinkerGraph.DefaultIdManager.getNextId}}
 */
TinkerGraph.NumberIDType = {
	getNextId: TinkerGraph.DefaultIdManager.getNextId
};

/**
 * UUIDType
 * @type {{getNextId: TinkerGraph.UUIDType.getNextId}}
 */
TinkerGraph.UUIDType = {
	getNextId: TinkerGraph.DefaultIdManager.generateUUID
};

/**
 * TinkerGraphFeatures
 * @constructor
 */
function TinkerGraphFeatures(configuration) {
	this.graphFeatures = new TinkerGraphGraphFeatures();
	this.edgeFeatures = new TinkerGraphEdgeFeatures();
	this.vertexFeatures = new TinkerGraphVertexFeatures(configuration);
}

TinkerGraphFeatures.prototype = {
	constructor: TinkerGraphFeatures,

	graph() {
		return this.graphFeatures;
	},

	edge() {
		return this.edgeFeatures;
	},

	vertex() {
		return this.vertexFeatures;
	},

};

mixin(TinkerGraphFeatures, Graph.Features.prototype);

/**
 * TinkerGraphVertexFeatures
 * @param configuration
 * @constructor
 */
function TinkerGraphVertexFeatures(configuration) {
	this.configuration = configuration;
}

TinkerGraphVertexFeatures.prototype = {
	constructor: TinkerGraphVertexFeatures,

	supportsCustomIds() {
		return false;
	},

	willAllowId(id) {
		return true;
	},

	getCardinality(key) {
		return VertexProperty.Cardinality[this.configuration.getString(TinkerGraph.GREMLIN_TINKERGRAPH_DEFAULT_VERTEX_PROPERTY_CARDINALITY, VertexProperty.Cardinality.single)];
	},
};

mixin(TinkerGraphVertexFeatures, Graph.Features.VertexFeatures.prototype);

/**
 * TinkerGraphEdgeFeatures
 * @constructor
 */
function TinkerGraphEdgeFeatures() {

}

TinkerGraphEdgeFeatures.prototype = {
	constructor: TinkerGraphEdgeFeatures,

	supportsCustomIds() {
		return false;
	},

	willAllowId(id) {
		return true;
	},
};

mixin(TinkerGraphEdgeFeatures, Graph.Features.EdgeFeatures.prototype);

/**
 * TinkerGraphGraphFeatures
 * @constructor
 */
function TinkerGraphGraphFeatures() {

}

TinkerGraphGraphFeatures.prototype = {
	constructor: TinkerGraphGraphFeatures,
	supportsConcurrentAccess() {
		return false;
	},

	supportsTransactions() {
		return false;
	},

	supportsThreadedTransactions() {
		return false;
	},

};

mixin(TinkerGraphGraphFeatures, Graph.Features.GraphFeatures.prototype);

export { TinkerGraph };
