import { mixin } from '../../../util';
import Graph from '../../Graph';
import VertexProperty from '../../VertexProperty';
import { Collections } from '../../../util';

/**
 * EmptyGraph
 * @constructor
 */
function EmptyGraph() {
  Graph.call(this);
  this.features = new EmptyGraphFeatures();
}

EmptyGraph.prototype = {
  constructor: EmptyGraph,
  addVertex(...keyValues) {
    throw ('vertex Additions Not Supported');
  },


  variables() {
    throw ('variables Not Supported');
  },

  configuration() {
  },

  close() {
  },

  vertices(...vertexIds) {
    return Collections.emptyIterator();
  },

  edges(...edgeIds) {
    return Collections.emptyIterator();
  },
};

mixin(EmptyGraph, Graph.prototype);

/**
 * EmptyGraphFeatures
 * @constructor
 */
function EmptyGraphFeatures() {
  this.graphFeatures = new EmptyGraphGraphFeatures();
  this.vertexFeatures = new EmptyGraphVertexFeatures();
  this.edgeFeatures = new EmptyGraphEdgeFeatures();
}

EmptyGraphFeatures.prototype = {
  constructor: EmptyGraphFeatures,
  graph() {
    return this.graphFeatures;
  },

  vertex() {
    return this.vertexFeatures;
  },

  edge() {
    return this.edgeFeatures;
  },
};

mixin(EmptyGraphFeatures, Graph.Features.prototype);

/**
 * EmptyGraphGraphFeatures
 * @constructor
 */
function EmptyGraphGraphFeatures() {

}

EmptyGraphGraphFeatures.prototype = {
  constructor: EmptyGraphGraphFeatures,
  supportsPersistence() {
    return false;
  },

  supportsTransactions() {
    return false;
  },

  supportsThreadedTransactions() {
    return false;
  },

  variables() {
    return null;
  },

  supportsComputer() {
    return false;
  },

};

mixin(EmptyGraphGraphFeatures, Graph.Features.GraphFeatures.prototype);

/**
 * EmptyGraphVertexFeatures
 * @constructor
 */
function EmptyGraphVertexFeatures() {

}

EmptyGraphVertexFeatures.prototype = {
  constructor: EmptyGraphVertexFeatures,
  getCardinality(key) {
    // probably not much hurt here in returning list...it's an "empty graph"
    return VertexProperty.Cardinality.list;
  },

  supportsAddVertices() {
    return false;
  },

  supportsRemoveVertices() {
    return false;
  },

  properties() {
    return new EmptyGraphVertexPropertyFeatures();
  },

};

mixin(EmptyGraphVertexFeatures, EmptyGraphElementFeatures.prototype, Graph.Features.VertexFeatures.prototype);

/**
 * EmptyGraphEdgeFeatures
 * @constructor
 */
function EmptyGraphEdgeFeatures() {

}

EmptyGraphEdgeFeatures.prototype = {
  constructor: EmptyGraphEdgeFeatures,
  supportsAddEdges() {
    return false;
  },

  supportsRemoveEdges() {
    return false;
  },

  properties() {
    return new EmptyGraphEdgePropertyFeatures();
  },

};

mixin(EmptyGraphEdgeFeatures, EmptyGraphElementFeatures.prototype, Graph.Features.EdgeFeatures.prototype);

/**
 * EmptyGraphElementFeatures
 * @constructor
 */
function EmptyGraphElementFeatures() {

}

EmptyGraphElementFeatures.prototype = {
  constructor: EmptyGraphElementFeatures,
  supportsAddProperty() {
    return false;
  },

  supportsRemoveProperty() {
    return false;
  },

};

mixin(EmptyGraphElementFeatures, Graph.Features.ElementFeatures.prototype);

/**
 * EmptyGraphEdgePropertyFeatures
 * @constructor
 */
function EmptyGraphEdgePropertyFeatures() {

}

EmptyGraphEdgePropertyFeatures.prototype = {
  constructor: EmptyGraphEdgePropertyFeatures,
  supportsAddProperty() {
    return false;
  },

  supportsRemoveProperty() {
    return false;
  },

};

mixin(EmptyGraphEdgePropertyFeatures, Graph.Features.EdgePropertyFeatures.prototype);

/**
 * EmptyGraphVertexPropertyFeatures
 * @constructor
 */
function EmptyGraphVertexPropertyFeatures() {

}

EmptyGraphVertexPropertyFeatures.prototype = {
  constructor: EmptyGraphVertexPropertyFeatures,
  supportsAddProperty() {
    return false;
  },

  supportsRemoveProperty() {
    return false;
  },

};

mixin(EmptyGraphVertexPropertyFeatures, Graph.Features.VertexPropertyFeatures.prototype);

const INSTANCE = new EmptyGraph();
EmptyGraph.instance = () => INSTANCE;
export default EmptyGraph;
