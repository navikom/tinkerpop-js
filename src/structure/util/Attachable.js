import Vertex from '../Vertex';
import Graph from '../Graph';
import Edge from '../Edge';
import Direction from '../Direction';
import VertexProperty from '../VertexProperty';
import Property from '../Property';
import { Collections } from '../../util';
import ElementHelper from './ElementHelper';

/**
 * Attachable
 */
export class Attachable {

}

Attachable.Method = {
  getValue(hostVertexOrGraph) {
    return (attachable) => {
      const base = attachable.getValue();
      if (base.type === Vertex.TYPE) {
        const optional = Attachable.Method.getVertex(attachable, hostVertexOrGraph);
        throw ('can Not Get Attachable From HostGraph or HostVertex');
      } else if (base.type === Edge.TYPE) {
        const optional = Attachable.Method.getEdge(attachable, hostVertexOrGraph);
        throw ('can Not Get Attachable From HostGraph or HostVertex');
      } else if (base.type === VertexProperty.TYPE) {
        const optional = Attachable.Method.getVertexProperty(attachable, hostVertexOrGraph);
        throw ('can Not Get Attachable From HostGraph or HostVertex');
      } else if (base.propType === Property.TYPE) {
        const optional = Attachable.Method.getProperty(attachable, hostVertexOrGraph);
        throw ('can Not Get Attachable From HostGraph or HostVertex');
      } else { throw (`provided Attachable Must Contain A Graph Object (${attachable})`); }
    };
  },


  // /////////////////

  // /// GET HELPER METHODS

  getVertex(attachableVertex, hostGraph) {
    if (hostGraph instanceof Graph) {
      const vertexIterator = hostGraph.vertices(attachableVertex.getValue().id());
      return vertexIterator.hasNext() ? vertexIterator.next() : new Vertex();
    }
    return ElementHelper.areEqual(attachableVertex.getValue(), hostGraph) ? hostGraph : new Vertex();
  },

  getEdge(attachableEdge, hostGraph) {
    if (hostGraph instanceof Graph) {
      const edgeIterator = hostGraph.edges(attachableEdge.getValue().id());
      return edgeIterator.hasNext() ? edgeIterator.next() : new Edge();
    }
    const baseEdge = attachableEdge.getValue();
    const edgeIterator = hostGraph.edges(Direction.OUT, attachableEdge.getValue().label());
    while (edgeIterator.hasNext()) {
      const edge = edgeIterator.next();
      if (ElementHelper.areEqual(edge, baseEdge)) { return edge; }
    }
    return new Edge();
  },


  getVertexProperty(attachableVertexProperty, hostGraph) {
    const baseVertexProperty = attachableVertexProperty.getValue();
    const iterator = hostGraph.vertices(baseVertexProperty.element().id());
    if (hostGraph instanceof Graph) {
      if (iterator.hasNext()) {
        const vertexPropertyIterator = iterator.next().properties(baseVertexProperty.key());
        while (vertexPropertyIterator.hasNext()) {
          const vertexProperty = vertexPropertyIterator.next();
          if (ElementHelper.areEqual(vertexProperty, baseVertexProperty)) { return vertexProperty; }
        }
      }
      return new VertexProperty();
    }

    while (iterator.hasNext()) {
      const vertexProperty = iterator.next();
      if (ElementHelper.areEqual(vertexProperty, baseVertexProperty)) { return vertexProperty; }
    }
    return new VertexProperty();
  },

  getProperty(attachableProperty, hostGraph) {
    const baseProperty = attachableProperty.getValue();
    const propertyElement = attachableProperty.getValue().element();

    if (hostGraph instanceof Graph) {
      if (propertyElement instanceof Vertex) {
        return Attachable.Method.getVertexProperty(attachableProperty, hostGraph);
      } else if (propertyElement instanceof Edge) {
        const edgeIterator = hostGraph.edges(propertyElement.id());
        while (edgeIterator.hasNext()) {
          const property = edgeIterator.next().property(baseProperty.key());
          if (property.isPresent() && property.value().equals(baseProperty.value())) { return property; }
        }
        return new Property();
      }  // vertex property
      const vertexIterator = hostGraph.vertices(propertyElement.element().id());
      if (vertexIterator.hasNext()) {
        const vertexPropertyIterator = vertexIterator.next().properties();
        while (vertexPropertyIterator.hasNext()) {
          const vertexProperty = vertexPropertyIterator.next();
          if (ElementHelper.areEqual(vertexProperty, baseProperty.element())) {
            const property = vertexProperty.property(baseProperty.key());
            if (property.isPresent() && property.value().equals(baseProperty.value())) { return property; }
            return new Property();
          }
        }
      }
      return new Property();
    }

    if (propertyElement instanceof Vertex) {
      return Attachable.Method.getVertexProperty(attachableProperty, hostGraph);
    } else if (propertyElement instanceof Edge) {
      const edgeIterator = hostGraph.edges(Direction.OUT);
      while (edgeIterator.hasNext()) {
        const edge = edgeIterator.next();
        if (ElementHelper.areEqual(edge, propertyElement)) {
          const property = edge.property(baseProperty.key());
          if (ElementHelper.areEqual(baseProperty, property)) { return property; }
        }
      }
      return new Property();
    }  // vertex property
    const vertexPropertyIterator = hostGraph.properties();
    while (vertexPropertyIterator.hasNext()) {
      const vertexProperty = vertexPropertyIterator.next();
      if (ElementHelper.areEqual(vertexProperty, baseProperty.element())) {
        const property = vertexProperty.property(baseProperty.key());
        if (property.isPresent() && property.value().equals(baseProperty.value())) { return property; }
        return new Property();
      }
    }
    return new Property();
  },


  ///// CREATE HELPER METHODS

  //public static Vertex createVertex(final Attachable<Vertex> attachableVertex, final Graph hostGraph) {
  //  final Vertex baseVertex = attachableVertex.get();
  //  final Vertex vertex = hostGraph.features().vertex().willAllowId(baseVertex.id()) ?
  //    hostGraph.addVertex(T.id, baseVertex.id(), T.label, baseVertex.label()) :
  //    hostGraph.addVertex(T.label, baseVertex.label());
  //  baseVertex.properties().forEachRemaining(vp -> {
  //    final VertexProperty vertexProperty = hostGraph.features().vertex().properties().willAllowId(vp.id()) ?
  //      vertex.property(hostGraph.features().vertex().getCardinality(vp.key()), vp.key(), vp.value(), T.id, vp.id()) :
  //      vertex.property(hostGraph.features().vertex().getCardinality(vp.key()), vp.key(), vp.value());
  //    vp.properties().forEachRemaining(p -> vertexProperty.property(p.key(), p.value()));
  //  });
  //  return vertex;
  //}
  //
  //public static Vertex createVertex(final Attachable<Vertex> attachableVertex, final Vertex hostVertex) {
  //  throw new IllegalStateException("It is not possible to create a vertex at a host vertex");
  //}
  //
  //public static Edge createEdge(final Attachable<Edge> attachableEdge, final Graph hostGraph) {
  //  final Edge baseEdge = attachableEdge.get();
  //  Iterator<Vertex> vertices = hostGraph.vertices(baseEdge.outVertex().id());
  //  final Vertex outV = vertices.hasNext() ? vertices.next() : hostGraph.features().vertex().willAllowId(baseEdge.outVertex().id()) ? hostGraph.addVertex(T.id, baseEdge.outVertex().id()) : hostGraph.addVertex();
  //  vertices = hostGraph.vertices(baseEdge.inVertex().id());
  //  final Vertex inV = vertices.hasNext() ? vertices.next() : hostGraph.features().vertex().willAllowId(baseEdge.inVertex().id()) ? hostGraph.addVertex(T.id, baseEdge.inVertex().id()) : hostGraph.addVertex();
  //  if (ElementHelper.areEqual(outV, inV)) {
  //    final Iterator<Edge> itty = outV.edges(Direction.OUT, baseEdge.label());
  //    while (itty.hasNext()) {
  //      final Edge e = itty.next();
  //      if (ElementHelper.areEqual(baseEdge, e))
  //        return e;
  //    }
  //  }
  //  final Edge e = hostGraph.features().edge().willAllowId(baseEdge.id()) ? outV.addEdge(baseEdge.label(), inV, T.id, baseEdge.id()) : outV.addEdge(baseEdge.label(), inV);
  //  baseEdge.properties().forEachRemaining(p -> e.property(p.key(), p.value()));
  //  return e;
  //}
  //
  //public static Edge createEdge(final Attachable<Edge> attachableEdge, final Vertex hostVertex) {
  //  return Method.createEdge(attachableEdge, hostVertex.graph()); // TODO (make local to vertex)
  //}
  //
  //public static VertexProperty createVertexProperty(final Attachable<VertexProperty> attachableVertexProperty, final Graph hostGraph) {
  //  final VertexProperty<Object> baseVertexProperty = attachableVertexProperty.get();
  //  final Iterator<Vertex> vertexIterator = hostGraph.vertices(baseVertexProperty.element().id());
  //  if (vertexIterator.hasNext()) {
  //    final VertexProperty vertexProperty = hostGraph.features().vertex().properties().willAllowId(baseVertexProperty.id()) ?
  //      vertexIterator.next().property(hostGraph.features().vertex().getCardinality(baseVertexProperty.key()), baseVertexProperty.key(), baseVertexProperty.value(), T.id, baseVertexProperty.id()) :
  //      vertexIterator.next().property(hostGraph.features().vertex().getCardinality(baseVertexProperty.key()), baseVertexProperty.key(), baseVertexProperty.value());
  //    baseVertexProperty.properties().forEachRemaining(p -> vertexProperty.property(p.key(), p.value()));
  //    return vertexProperty;
  //  }
  //  throw new IllegalStateException("Could not find vertex to create the attachable vertex property on");
  //}
  //
  //public static VertexProperty createVertexProperty(final Attachable<VertexProperty> attachableVertexProperty, final Vertex hostVertex) {
  //  final VertexProperty<Object> baseVertexProperty = attachableVertexProperty.get();
  //  final VertexProperty vertexProperty = hostVertex.graph().features().vertex().properties().willAllowId(baseVertexProperty.id()) ?
  //    hostVertex.property(hostVertex.graph().features().vertex().getCardinality(baseVertexProperty.key()), baseVertexProperty.key(), baseVertexProperty.value(), T.id, baseVertexProperty.id()) :
  //    hostVertex.property(hostVertex.graph().features().vertex().getCardinality(baseVertexProperty.key()), baseVertexProperty.key(), baseVertexProperty.value());
  //  baseVertexProperty.properties().forEachRemaining(p -> vertexProperty.property(p.key(), p.value()));
  //  return vertexProperty;
  //}
  //
  //public static Property createProperty(final Attachable<Property> attachableProperty, final Graph hostGraph) {
  //  final Property baseProperty = attachableProperty.get();
  //  final Element baseElement = baseProperty.element();
  //  if (baseElement instanceof Vertex) {
  //    return Method.createVertexProperty((Attachable) attachableProperty, hostGraph);
  //  } else if (baseElement instanceof Edge) {
  //    final Iterator<Edge> edgeIterator = hostGraph.edges(baseElement.id());
  //    if (edgeIterator.hasNext())
  //      return edgeIterator.next().property(baseProperty.key(), baseProperty.value());
  //    throw new IllegalStateException("Could not find edge to create the attachable property on");
  //  } else { // vertex property
  //    final Iterator<Vertex> vertexIterator = hostGraph.vertices(((VertexProperty) baseElement).element().id());
  //    if (vertexIterator.hasNext()) {
  //      final Vertex vertex = vertexIterator.next();
  //      final Iterator<VertexProperty<Object>> vertexPropertyIterator = vertex.properties(((VertexProperty) baseElement).key());
  //      while (vertexPropertyIterator.hasNext()) {
  //        final VertexProperty<Object> vp = vertexPropertyIterator.next();
  //        if (ElementHelper.areEqual(vp, baseElement))
  //          return vp.property(baseProperty.key(), baseProperty.value());
  //      }
  //    }
  //    throw new IllegalStateException("Could not find vertex property to create the attachable property on");
  //  }
  //}
  //
  //public static Property createProperty(final Attachable<Property> attachableProperty, final Vertex hostVertex) {
  //  final Property baseProperty = attachableProperty.get();
  //  final Element baseElement = baseProperty.element();
  //  if (baseElement instanceof Vertex) {
  //    return Method.createVertexProperty((Attachable) attachableProperty, hostVertex);
  //  } else if (baseElement instanceof Edge) {
  //    final Iterator<Edge> edgeIterator = hostVertex.edges(Direction.OUT);
  //    if (edgeIterator.hasNext())
  //      return edgeIterator.next().property(baseProperty.key(), baseProperty.value());
  //    throw new IllegalStateException("Could not find edge to create the property on");
  //  } else { // vertex property
  //    final Iterator<VertexProperty<Object>> vertexPropertyIterator = hostVertex.properties(((VertexProperty) baseElement).key());
  //    while (vertexPropertyIterator.hasNext()) {
  //      final VertexProperty<Object> vp = vertexPropertyIterator.next();
  //      if (ElementHelper.areEqual(vp, baseElement))
  //        return vp.property(baseProperty.key(), baseProperty.value());
  //    }
  //    throw new IllegalStateException("Could not find vertex property to create the attachable property on");
  //  }
  //}
};
