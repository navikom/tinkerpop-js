import { mixin, Map, List, ArrayUtils, Collections, IteratorUtils } from '../../../util';
import EmptyVertexProperty from '../empty/EmptyVertexProperty';
import Element from '../../Element';
import Edge from '../../Edge';
import Property from '../../Property';
import Direction from '../../Direction';
import ElementHelper from '../ElementHelper';
import { DetachedFactory } from './DetachedFactory';
import { DetachedElement } from './DetachedElement';
import { DetachedVertex } from './DetachedVertex';
import { DetachedProperty } from './DetachedProperty';


/**
 * DetachedEdge
 * @param edge
 * @param label
 * @param properties
 * @param outV
 * @param inV
 * @constructor
 */
function DetachedEdge(edge, label, properties, outV, inV) {
  if(edge instanceof Edge){
    DetachedElement.call(this, edge);
    this._outVertex = DetachedFactory.detach(edge.outVertex(), false);
    this._inVertex = DetachedFactory.detach(edge.inVertex(), false);

    // only serialize properties if requested, the graph supports it and there are meta properties present.
    // this prevents unnecessary object creation of a new HashMap of a new HashMap which will just be empty.
    // it will use Collections.emptyMap() by default
    if (typeof label === 'boolean' && label) {
      const propertyIterator = edge.properties();
      if (propertyIterator.hasNext()) {
        this._properties = new Map();
        propertyIterator.forEachRemaining(
          (property) => this._properties.put(property.getValue().key(), new List([DetachedFactory.detach(property.getValue())]))
        );
      }
    }
  } else {
    const id = edge;
    DetachedElement.call(this, id, label);
    this._outVertex = new DetachedVertex(outV.getValue0(), outV.getValue1(), new Map());
    this._inVertex = new DetachedVertex(inV.getValue0(), inV.getValue1(), new Map());
    if (properties && !properties.isEmpty()) {
      this._properties = new Map();
      properties.forEach(
        (entry) => {
          if (Property.TYPE === entry.getValue().type) {
            this._properties.put(entry.getKey(), new List([entry.getValue()]));
          } else {
            this._properties.put(entry.getKey(), new DetachedProperty(entry.getKey(), entry.getValue(), this));
          }
        }
      );
    }
  }

}

DetachedEdge.prototype = {
  constructor: DetachedEdge,
  inVertex() {
    return this._inVertex;
  },

  outVertex() {
    return this._outVertex;
  },

  vertices(direction) {
  switch (direction) {
    case Direction.OUT:
      return IteratorUtils.of(this._outVertex);
    case Direction.IN:
      return IteratorUtils.of(this._inVertex);
    default:
      return IteratorUtils.of(this._outVertex, this._inVertex);
  }
},

remove() {
  throw ("edge Removal Not Supported");
},

properties(...propertyKeys) {
  return DetachedElement.properties.call(this, propertyKeys);
}
};

mixin(DetachedEdge, DetachedElement.prototype, Edge.prototype);



export { DetachedEdge }
