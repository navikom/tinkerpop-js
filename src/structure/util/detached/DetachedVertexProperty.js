import { mixin, Map, List, ArrayUtils } from '../../../util';
import EmptyGraph from '../empty/EmptyGraph';
import EmptyProperty from '../empty/EmptyProperty';
import Element from '../../Element';
import Vertex from '../../Vertex';
import VertexProperty from '../../VertexProperty';
import { DetachedFactory } from './DetachedFactory';
import { DetachedElement } from './DetachedElement';

/**
 * DetachedVertex
 * @param vertex
 * @param label
 * @param properties
 * @constructor
 */
function DetachedVertexProperty(element, label, value, properties, vertex) {
  if (typeof label === 'boolean') {
    DetachedElement.call(this, element);
    this._value = element.value();
    this._vertex = DetachedFactory.detach(element.element(), false);
    if (label && element.graph().features().vertex().supportsMetaProperties()) {
      const propertyIterator = element.properties();
      if (propertyIterator.hasNext()) {
        this._properties = new Map();
        propertyIterator.forEachRemaining(
          (property) => this._properties.put(property.getValue().key(), new List([DetachedFactory.detach(property.getValue())]))
        );
      }
    }
  } else {
    DetachedElement.call(this, element, label);
    this._value = value;

    if (vertex) this._vertex = DetachedFactory.detach(vertex, true);

    if (properties && !properties.isEmpty()) {
      this._properties = new Map();
      properties.keySet().forEachRemaining(
        (entry) => this._properties.put(entry.getKey(), new List([new DetachedProperty(entry.getKey(), entry.getValue(), this)]))
      );
    }
  }


}

DetachedVertexProperty.prototype = {
  constructor: DetachedVertexProperty,
  isPresent() {
    return true;
  },

  key() {
    return this._label;
  },

  value() {
    return this._value;
  },

  element() {
    return this._vertex;
  },

  remove() {
    throw ("property Removal Not Supported");
  }
};

mixin(DetachedVertexProperty, DetachedElement.prototype, VertexProperty.prototype);


export { DetachedVertexProperty }