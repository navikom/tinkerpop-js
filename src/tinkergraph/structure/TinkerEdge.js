import { mixin, Map, Collections, IteratorUtils, ArrayUtils } from '../../util';
import StringFactory from '../../structure/util/StringFactory';
import { TinkerElement } from './TinkerElement';
import Edge from '../../structure/Edge';
import T from '../../structure/T';
import Direction from '../../structure/Direction';
import { TinkerHelper } from './TinkerHelper';
import { TinkerProperty } from './TinkerProperty';
import ElementHelper from '../../structure/util/ElementHelper';
import EmptyProperty from '../../structure/util/empty/EmptyProperty';

/**
 * TinkerEdge
 * @param id
 * @param outVertex
 * @param label
 * @param inVertex
 * @constructor
 */
function TinkerEdge(id, outVertex, label, inVertex) {
  TinkerElement.call(this, id, label);
  this._outVertex = outVertex;
  this._inVertex = inVertex;
  TinkerHelper.autoUpdateIndex(this, T.label.getAccessor(), this._label, null);
}

TinkerEdge.prototype = {
  constructor: TinkerEdge,

  property(key, value) {
    if (this.removed) throw TinkerElement.elementAlreadyRemoved(Edge, this.id());
    if (value) {
      ElementHelper.validateProperty(key, value);
      const oldProperty = TinkerElement.prototype.property.call(this, key);
      const newProperty = new TinkerProperty(this, key, value);
      if (!this._properties) this._properties = new Map();
      this._properties.put(key, newProperty);
      TinkerHelper.autoUpdateIndex(this, key, value, oldProperty.isPresent() ? oldProperty.getValue() : null);
      return newProperty;
    }
    return (!this._properties ? EmptyProperty : this._properties.getOrDefault(key, EmptyProperty));
  },


  keys() {
    return !this._properties ? Collections.emptySet() : this._properties.keySet();
  },

  remove() {
    const outVertex = this._outVertex;
    const inVertex = this._inVertex;

    if (outVertex && outVertex.outEdges) {
      const edges = outVertex.outEdges.value(this.label());
      if (edges) {
        edges.remove(this);
        if(edges.isEmpty()){
          outVertex.outEdges.remove(this.label())
        }
      }
    }
    if (inVertex && inVertex.inEdges) {
      const edges = inVertex.inEdges.value(this.label());
      if (edges) {
        edges.remove(this);
        if(edges.isEmpty()){
          inVertex.inEdges.remove(this.label());
        }
      }
    }
    TinkerHelper.removeElementIndex(this);
    this.graph()._edges.remove(this.id());
    this._properties = null;
    this.removed = true;
  },


  outVertex() {
    return this._outVertex;
  },

  inVertex() {
    return this._inVertex;
  },

  vertices(direction) {
    if (this.removed) return Collections.emptyIterator();
    switch (direction) {
      case Direction.OUT:
        return IteratorUtils.of(this._outVertex);
      case Direction.IN:
        return IteratorUtils.of(this._inVertex);
      default:
        return IteratorUtils.of(this._outVertex, this._inVertex);
    }
  },

  graph() {
    return this._inVertex.graph();
  },

  toString() {
    return StringFactory.edgeString(this);
  },

  properties(...propertyKeys) {
    if (!this._properties) return Collections.emptyIterator();
    propertyKeys = ArrayUtils.checkArray(propertyKeys);
    if (propertyKeys.length === 1) {
      const property = this._properties.getValue(propertyKeys[0]);
      return !property ? Collections.emptyIterator() : IteratorUtils.of(property);
    } return this._properties.keySet()
      .filter((entry) => ElementHelper.keyExists(entry.getKey(), propertyKeys))
      .map((entry) => entry.getValue()).iterator();
  },
};

mixin(TinkerEdge, TinkerElement.prototype, Edge.prototype);

export { TinkerEdge };
