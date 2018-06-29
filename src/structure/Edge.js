import { mixin } from '../util';
import Element from './Element';
import Direction from './Direction';

/**
 * An {@link Edge} links two {@link Vertex} objects. Along with its {@link Property} objects, an {@link Edge} has both
 * a {@link Direction} and a {@code label}. The {@link Direction} determines which {@link Vertex} is the tail
 * {@link Vertex} (out {@link Vertex}) and which {@link Vertex} is the head {@link Vertex}
 * (in {@link Vertex}). The {@link Edge} {@code label} determines the type of relationship that exists between the
 * two vertices.
 * <p/>
 * Diagrammatically:
 * <pre>
 * outVertex ---label---> inVertex.
 * </pre>
 * @constructor
 */
function Edge() {
  Element.call(this);
}

Edge.prototype = {
  constructor: Edge,
  type: Element.TYPES.EDGE,
  /**
   * Retrieve the vertex (or vertices) associated with this edge as defined by the direction.
   * If the direction is {@link Direction#BOTH} then the iterator order is: {@link Direction#OUT} then {@link Direction#IN}.
   *
   * @param direction Get the incoming vertex, outgoing vertex, or both vertices
   * @return An iterator with 1 or 2 vertices
   */
  vertices(direction) {
    throw new Error('Must be overloaded');
  },

  /**
   * Get the outgoing/tail vertex of this edge.
   *
   * @return the outgoing vertex of the edge
   */
  outVertex() {
    return this.vertices(Direction.OUT).next();
  },

  /**
   * Get the incoming/head vertex of this edge.
   *
   * @return the incoming vertex of the edge
   */
  inVertex() {
    return this.vertices(Direction.IN).next();
  },

  /**
   * Get both the outgoing and incoming vertices of this edge.
   * The first vertex in the iterator is the outgoing vertex.
   * The second vertex in the iterator is the incoming vertex.
   *
   * @return an iterator of the two vertices of this edge
   */
  bothVertices() {
    return this.vertices(Direction.BOTH);
  },

  /**
   * {@inheritDoc}
   */
  properties(...propertyKeys) {
    throw new Error('Must be overloaded');
  },
};

Edge.TYPE = Element.TYPES.EDGE;

mixin(Edge, Element.prototype);
export default Edge;
