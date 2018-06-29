import { mixin, Optional, Map, List, ArrayUtils, Collections, IteratorUtils } from '../../util';
import EmptyVertexProperty from '../../structure/util/empty/EmptyVertexProperty';
import EmptyProperty from '../../structure/util/empty/EmptyProperty';
import ElementHelper from '../../structure/util/ElementHelper';
import StringFactory from '../../structure/util/StringFactory';
import Vertex from '../../structure/Vertex';
import Direction from '../../structure/Direction';
import Edge from '../../structure/Edge';
import VertexProperty from '../../structure/VertexProperty';
import { TinkerHelper } from './TinkerHelper';
import { TinkerElement } from './TinkerElement';
import { TinkerVertexProperty } from './TinkerVertexProperty';


/**
 * TinkerVertex
 * @param id
 * @param label
 * @param graph
 * @constructor
 */
function TinkerVertex(id, label, graph) {
  TinkerElement.call(this, id, label);

  this._graph = graph;
}

TinkerVertex.prototype = {
  constructor: TinkerVertex,
  graph() {
    return this._graph;
  },

  property(cardinality, key, value, ...keyValues) {
    if(key === undefined){
      key = cardinality;
      const iterator = this.properties(key);
      return iterator.hasNext() ? iterator.next() : EmptyVertexProperty;
    }
    if(!VertexProperty.Cardinality.contains(cardinality)){
      if(value){
        keyValues = [value].concat(ArrayUtils.checkArray(keyValues));
      }
      value = key;
      key = cardinality;
      cardinality = this.graph().features().vertex().getCardinality(cardinality);
    }

    if (cardinality) {
      if (this.removed) throw TinkerElement.elementAlreadyRemoved(Vertex, this.id());
      ElementHelper.legalPropertyKeyValueArray(keyValues);
      ElementHelper.validateProperty(key, value);
      const optionalId = ElementHelper.getIdValue(keyValues);

      const optionalVertexProperty = ElementHelper.stageVertexProperty(this, cardinality, key, value, keyValues);
      if (optionalVertexProperty.isPresent()) return optionalVertexProperty.getValue();

      const idValue = optionalId.isPresent() ?
          optionalId.getValue() :
          this._graph.vertexPropertyIdManager.getNextId(this._graph);

      const vertexProperty = new TinkerVertexProperty(idValue, this, key, value);

      if (this._properties === undefined) this._properties = new Map();
      const list = this._properties.getOrDefault(key, new List());
      list.add(vertexProperty);
      this._properties.put(key, list);
      TinkerHelper.autoUpdateIndex(this, key, value, null);
      ElementHelper.attachProperties(vertexProperty, keyValues);
      return vertexProperty;
    }
    if (this.removed) return EmptyVertexProperty;
    if (this._properties !== null && this._properties.contains(key)) {
      const list = this._properties.getValue(key);

      if (list.size() > 1) { throw (`multiple Properties Exist For Provided Key (${key})`); }
      else {
        return list.getValue(0);
      }
    } else {
      return EmptyVertexProperty;
    }
  },

  keys() {
    if (!this._properties) return Collections.emptySet();
    return this._properties.keySet();
  },

  addEdge(label, vertex, ...keyValues) {
    if (!vertex) throw ('argument (vertex) Can Not Be Null');
    if (this.removed) throw TinkerElement.elementAlreadyRemoved('Vertex', this.id);
    keyValues = ArrayUtils.checkArray(keyValues);
    return TinkerHelper.addEdge(this._graph, this, vertex, label, keyValues);
  },

  remove() {
    const edges = new List();
    this.edges(Direction.BOTH).forEachRemaining(edge => edges.add(edge));
    edges.iterator().filter((edge) => !edge.removed).iterator().forEachRemaining((edge) => edge.remove());
    this._properties = null;
    TinkerHelper.removeElementIndex(this);
    this._graph._vertices.remove(this.id());
    this.removed = true;
  },

  edges(direction, ...edgeLabels) {
    edgeLabels = ArrayUtils.checkArray(edgeLabels);
    const edgeIterator = TinkerHelper.getEdges(this, direction, edgeLabels);
    return edgeIterator;
  },

  vertices(direction, ...edgeLabels) {
    edgeLabels = ArrayUtils.checkArray(edgeLabels);
    const vertices = TinkerHelper.getVertices(this, direction, edgeLabels);
    return vertices;
  },

  properties(...propertyKeys) {
    if (this.removed) return Collections.emptyIterator();
    propertyKeys = ArrayUtils.checkArray(propertyKeys);
    if (!this._properties) return Collections.emptyIterator();
    if (propertyKeys.length === 1) {
      const properties = this._properties.getOrDefault(propertyKeys[0], new List());

      if (properties.size() === 1) {
        return IteratorUtils.of(properties.getValue(0));
      } else if (properties.isEmpty()) {
        return Collections.emptyIterator();
      }
      return properties.iterator();
    }

    const props = new List();
    this._properties.keySet().filter(entry => ElementHelper.keyExists(entry.getKey(), propertyKeys))
    .map(entry => entry.getValue().forEach((p) => props.add(p)));
    return props.iterator();
  },

  toString() {
    return StringFactory.vertexString(this);
  }
};

mixin(TinkerVertex, TinkerElement.prototype, Vertex.prototype);

export { TinkerVertex };
