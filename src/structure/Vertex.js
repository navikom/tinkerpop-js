import { mixin } from '../util';
import Element from './Element';
import EmptyVertexProperty from './util/empty/EmptyVertexProperty';

/**
 * A {@link Vertex} maintains pointers to both a set of incoming and outgoing {@link Edge} objects. The outgoing edges
 * are those edges for  which the {@link Vertex} is the tail. The incoming edges are those edges for which the
 * {@link Vertex} is the head.
 * <p/>
 * Diagrammatically:
 * <pre>
 * ---inEdges---> vertex ---outEdges--->.
 * </pre>
 * @constructor
 */
function Vertex() {
  Element.call(this);
}

Vertex.prototype = {
  constructor: Vertex,
  type: Element.TYPES.VERTEX,
  /**
   * Add an outgoing edge to the vertex with provided label and edge properties as key/value pairs.
   * These key/values must be provided in an even number where the odd numbered arguments are {@link String}
   * property keys and the even numbered arguments are the related property values.
   *
   * @param label     The label of the edge
   * @param inVertex  The vertex to receive an incoming edge from the current vertex
   * @param keyValues The key/value pairs to turn into edge properties
   * @return the newly created edge
   */
  addEdge(label, inVertex, ...keyValues) {
    throw ('Must be overloaded');
  },

  /**
   * Get the {@link VertexProperty} for the provided key. If the property does not exist, return
   * {@link VertexProperty#empty}. If there are more than one vertex properties for the provided
   * key, then throw {@link Vertex.Exceptions#multiplePropertiesExistForProvidedKey}.
   *
   * Set the provided key to the provided value using {@link VertexProperty.Cardinality#single}.
   *
   * Set the provided key to the provided value using default {@link VertexProperty.Cardinality} for that key.
   * The default cardinality can be vendor defined and is usually tied to the graph schema.
   * The default implementation of this method determines the cardinality
   * {@code graph().features().vertex().getCardinality(key)}. The provided key/values are the properties of the
   * newly created {@link VertexProperty}. These key/values must be provided in an even number where the odd
   * numbered arguments are {@link String}.
   *
   * Create a new vertex property. If the cardinality is {@link VertexProperty.Cardinality#single}, then set the key
   * to the value. If the cardinality is {@link VertexProperty.Cardinality#list}, then add a new value to the key.
   * If the cardinality is {@link VertexProperty.Cardinality#sets}, then only add a new value if that value doesn't
   * already exist for the key. If the value already exists for the key, add the provided key value vertex property
   * properties to it.
   *
   * @param cardinality
   * @param key
   * @param value
   * @param keyValues
   * @return the retrieved vertex property
   */
  property(cardinality, key, value, ...keyValues) {
    if (cardinality !== null) {
      throw new Error('Must be overloaded');
    } else if (value) {
      return this.property(this.graph().features().vertex().getCardinality(key), key, value, []);
    } else if (keyValues.length > 0) {
      return this.property(this.graph().features().vertex().getCardinality(key), key, value, keyValues);
    } else {
      const iterator = this.properties(key).iterator;
      if (iterator.hasNext()) {
        const property = iterator.next();
        if (iterator.hasNext()) { throw (`multiple Properties Exist For Provided Key (${key})`); } else { return property; }
      } else {
        return EmptyVertexProperty;
      }
    }
  },

  /**
   * Gets an {@link Iterator} of incident edges.
   *
   * @param direction  The incident direction of the edges to retrieve off this vertex
   * @param edgeLabels The labels of the edges to retrieve. If no labels are provided, then get all edges.
   * @return An iterator of edges meeting the provided specification
   */
  edges(direction, ...edgeLabels) {
    throw ('Must be overloaded');
  },

  /**
   * Gets an {@link Iterator} of adjacent vertices.
   *
   * @param direction  The adjacency direction of the vertices to retrieve off this vertex
   * @param edgeLabels The labels of the edges associated with the vertices to retrieve. If no labels are provided,
   *                   then get all edges.
   * @return An iterator of vertices meeting the provided specification
   */
  vertices(direction, ...edgeLabels) {
    throw ('Must be overloaded');
  },

  /**
   * {@inheritDoc}
   */
  properties(...propertyKeys) {
    throw ('Must be overloaded');
  },
};

mixin(Vertex, Element.prototype);
/**
 * The default label to use for a vertex.
 */
Vertex.DEFAULT_LABEL = 'vertex';
Vertex.TYPE = Element.TYPES.VERTEX;

export default Vertex;
