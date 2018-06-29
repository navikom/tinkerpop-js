import { Map, ArrayUtils, List, HashSet } from '../../util';
import ElementHelper from '../../structure/util/ElementHelper';
import Edge from '../../structure/Edge';
import Direction from '../../structure/Direction';
import { TinkerVertex } from './TinkerVertex';
import { TinkerEdge } from './TinkerEdge';


/**
 * TinkerHelper
 */
export class TinkerHelper {
  static addEdge(graph, outVertex, inVertex, label, ...keyValues) {
    ElementHelper.validateLabel(label);
    keyValues = ArrayUtils.checkArray(keyValues);
    ElementHelper.legalPropertyKeyValueArray(keyValues);

    let idValue = ElementHelper.getIdValue(keyValues).orElse(null);

    if (idValue !== null) {
      if (graph._edges.containsKey(idValue)) { throw ('edge With Id (idValue) Already Exists'); }
    } else {
      idValue = graph.edgeIdManager.getNextId(graph);
    }

    const edge = new TinkerEdge(idValue, outVertex, label, inVertex);
    ElementHelper.attachProperties(edge, undefined, keyValues);
    graph._edges.put(edge.id(), edge);
    TinkerHelper.addOutEdge(outVertex, label, edge);
    TinkerHelper.addInEdge(inVertex, label, edge);
    return edge;
  }

  static addOutEdge(vertex, label, edge) {
    if (!vertex.outEdges) vertex.outEdges = new HashSet();
    let edges = vertex.outEdges.getValue(label);
    if (!edges) {
      edges = new List();
      vertex.outEdges.put(label, edges);
    }
    edges.add(edge);
  }

  static addInEdge(vertex, label, edge) {
    if (!vertex.inEdges) vertex.inEdges = new HashSet();
    let edges = vertex.inEdges.getValue(label);
    if (!edges) {
      edges = new List();
      vertex.inEdges.put(label, edges);
    }
    edges.add(edge);
  }

  static queryVertexIndex(graph, key, value) {
    return !graph.vertexIndex ? new List() : graph.vertexIndex.getValue(key, value);
  }

  static queryEdgeIndex(graph, key, value) {
    return !graph.edgeIndex ? new List() : graph.edgeIndex.getValue(key, value);
  }

// public static boolean inComputerMode(final TinkerGraph graph) {
//  return null != graph.graphComputerView;
// }
//
// public static TinkerGraphComputerView createGraphComputerView(final TinkerGraph graph, final GraphFilter graphFilter, final Set<VertexComputeKey> computeKeys) {
//  return graph.graphComputerView = new TinkerGraphComputerView(graph, graphFilter, computeKeys);
// }
//
// public static TinkerGraphComputerView getGraphComputerView(final TinkerGraph graph) {
//  return graph.graphComputerView;
// }
//
// public static void dropGraphComputerView(final TinkerGraph graph) {
//  graph.graphComputerView = null;
// }
//
// public static Map<String, List<VertexProperty>> getProperties(final TinkerVertex vertex) {
//  return null == vertex.properties ? Collections.emptyMap() : vertex.properties;
// }

  static autoUpdateIndex(element, key, newValue, oldValue) {
    const graph = element.graph();
    if (element.type === Edge.TYPE) {
      if (graph.edgeIndex) { graph.edgeIndex.autoUpdate(key, newValue, oldValue, element); }
    } else if (graph.vertexIndex) { graph.vertexIndex.autoUpdate(key, newValue, oldValue, element); }
  }


  static removeElementIndex(element) {
    const graph = element.graph();
    if (element.type === Edge.TYPE) {
      if (graph.edgeIndex) { graph.edgeIndex.removeElement(element); }
    } else if (graph.vertexIndex) { graph.vertexIndex.removeElement(element); }
  }


  static removeIndex(element, key, value) {
    const graph = element.graph();
    if (element instanceof TinkerVertex) {

      if (graph.vertexIndex !== null) { graph.vertexIndex.remove(key, value, element); }
    } else if (graph.edgeIndex !== null) { graph.edgeIndex.remove(key, value, element); }
  }


  static getEdges(vertex, direction, ...edgeLabels) {
    if (!direction) {
      // vertex === tinkergraph
      return vertex._edges;
    }
    edgeLabels = ArrayUtils.checkArray(edgeLabels);
    const edges = new List();
    if (direction === Direction.OUT || direction === Direction.BOTH) {
      if (vertex.outEdges) {
        if (edgeLabels.length === 0) {
          vertex.outEdges.forEach(entity => edges.addAll(entity.getValue()));
        }
        else if (edgeLabels.length === 1) { edges.addAll(vertex.outEdges.getOrDefault(edgeLabels[0], new List())); }
        else { edgeLabels.map(id => edges.addAll(vertex.outEdges.getValue(id))); }
      }
    }
    if (direction === Direction.IN || direction === Direction.BOTH) {
      if (vertex.inEdges) {
        if (edgeLabels.length === 0) { vertex.inEdges.forEach(entity => edges.addAll(entity.getValue())); }
        else if (edgeLabels.length == 1) { edges.addAll(vertex.inEdges.getOrDefault(edgeLabels[0], new List())); }
        else { edgeLabels.map(edge => edges.addAll(vertex.inEdges.getByValue(edge))); }
      }
    }
    return edges.iterator();
  }

  static getVertices(vertex, direction, ...edgeLabels) {
    if (!direction) {
      // vertex === tinkergraph
      return vertex.vertices();
    }
    edgeLabels = ArrayUtils.checkArray(edgeLabels);

    const vertices = new List();
    if (direction === Direction.OUT || direction === Direction.BOTH) {
      if (vertex.outEdges) {
        if (edgeLabels.length === 0) {
          vertex.outEdges.forEach(entity => entity.getValue().forEach((edge) => vertices.add(edge._inVertex)));
        } else if (edgeLabels.length === 1) {
          vertex.outEdges.getOrDefault(edgeLabels[0], new List()).forEach(edge => vertices.add(edge._inVertex));
        } else {
          edgeLabels.map(id => vertex.outEdges.getValue(id).iterator()
          .filter(entity => entity).forEach(edge => vertices.add(edge._inVertex)));
        }
      }
    }
    if (direction === Direction.IN || direction === Direction.BOTH) {
      if (vertex.inEdges) {
        if (edgeLabels.length === 0) { vertex.inEdges.forEach(entity => entity.getValue().forEach(edge => vertices.add(edge._outVertex))); }
        else if (edgeLabels.length == 1) { vertex.inEdges.getOrDefault(edgeLabels[0], new List()).forEach(edge => vertices.add(edge._outVertex)); }
        else { edgeLabels.map(id => vertex.inEdges.getValue(id).iterator().filter(entity => entity).forEach(edge => vertices.add(edge._outVertex))); }
      }
    }

    return vertices.iterator();
  }

}
