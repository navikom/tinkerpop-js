import { mixin, Map, List, ArrayUtils, Collections } from '../../../util';
import EmptyVertexProperty from '../empty/EmptyVertexProperty';
import Element from '../../Element';
import Vertex from '../../Vertex';
import VertexProperty from '../../VertexProperty';
import ElementHelper from '../ElementHelper';
import { DetachedFactory } from './DetachedFactory';
import { DetachedElement } from './DetachedElement';
import { DetachedVertexProperty } from './DetachedVertexProperty';

/**
 * DetachedVertex
 * @param vertex
 * @param label
 * @param properties
 * @constructor
 */
function DetachedVertex(vertex, label, properties) {
  DetachedElement.call(this, vertex, label);

  if (properties instanceof Map && !properties.isEmpty()) {
    this._properties = new Map();
    properties.forEach(
      (entry) => this._properties.put(
        entry.getKey(), entry.getValue().map((m) => VertexProperty.TYPE === m.type
          ? m
          : new DetachedVertexProperty(m.id(), entry.getKey(), m.value(), m.getOrDefault(DetachedVertex.PROPERTIES, new Map()), this))
      )
    );
  } else {
    if (properties) {
      const propertyIterator = vertex.properties();
      if (propertyIterator.hasNext()) {
        this._properties = new Map();
        propertyIterator.forEachRemaining((property) => {
          const list = this._properties.getOrDefault(property.getValue().key(), new list());
          list.add(DetachedFactory.detach(property.getValue(), true));
          this._properties.put(property.getValue().key(), list);
        });
      }
    }
  }
}

DetachedVertex.prototype = {
  constructor: DetachedVertex,


  property(key, value, ...keyValues) {
    if (!value) {
      if (this._properties && this._properties.containsKey(key)) {
        const list = this._properties.getValue(key);
        if (list.size() > 1)
          throw (`multiple Properties Exist For Provided Key(${key})`);
        else
          return list.getValue(0);
      } else
        return EmptyVertexProperty;
    } else {
      throw ("property Addition Not Supported");
    }

  },


  addEdge(label, inVertex, ...keyValues) {
    throw ("edge Additions Not Supported");
  },

  properties(...propertyKeys) {
    return DetachedElement.properties.call(this, propertyKeys);
  },

  edges(direction, ...edgeLabels) {
    return Collections.emptyIterator();
  },

  vertices(direction, ...labels) {
    return Collections.emptyIterator();
  },

  remove() {
    throw ("vertex Removal Not Supported");
  }
};

mixin(DetachedVertex, DetachedElement.prototype, Vertex.prototype);

DetachedVertex.ID = "id";
DetachedVertex.VALUE = "value";
DetachedVertex.PROPERTIES = "properties";

export { DetachedVertex }
