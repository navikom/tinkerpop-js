import { mixin, Collections, Map, IteratorUtils, ArrayUtils, isNull } from '../../util';
import { TinkerElement } from './TinkerElement';
import StringFactory from '../../structure/util/StringFactory';
import VertexProperty from '../../structure/VertexProperty';
import EmptyProperty from '../../structure/util/empty/EmptyProperty';
import ElementHelper from '../../structure/util/ElementHelper';
import { TinkerHelper } from './TinkerHelper';
import { TinkerProperty } from './TinkerProperty';

/**
 * TinkerVertexProperty
 * @param id
 * @param vertex
 * @param key
 * @param value
 * @param propertyKeyValues
 * @constructor
 */
function TinkerVertexProperty(id, vertex, key, value, ...propertyKeyValues) {
  TinkerElement.call(this, id, key);

  this._id = id;
  this.vertex = vertex;
  this._key = key;
  this._value = value;
  this._properties = null;
  ElementHelper.legalPropertyKeyValueArray(propertyKeyValues);
  ElementHelper.attachProperties(this, propertyKeyValues);
}

TinkerVertexProperty.prototype = {
  constructor: TinkerVertexProperty,

  key() {
    return this._key;
  },

  value(key) {
    if(isNull(key)){
      return this._value;
    } else {
      return this.property(key).value();
    }
  },

  isPresent() {
    return true;
  },

  id() {
    return this._id;
  },

  equals(object) {
    return ElementHelper.areEqual(this, object);
  },

  keys() {
    return this._properties == null ? Collections.emptySet() : this._properties.keySet();
  },

  property(key, value) {
    if (value) {
      if (this.removed) throw (`element Already Removed VertexProperty id (${this._id})`);
      const property = new TinkerProperty(this, key, value);
      if (this._properties === null) this._properties = new Map();
      this._properties.put(key, property);
      return property;
    }
    return this._properties == null ? EmptyProperty : this._properties.getOrDefault(key, EmptyProperty);
  },


  element() {
    return this.vertex;
  },

  remove() {

    if (this.vertex._properties !== null && this.vertex._properties.contains(this.key())) {

      this.vertex._properties.getValue(this._key).remove(this);

      if (this.vertex._properties.getValue(this._key).size() === 0) {

        this.vertex._properties.remove(this._key);
        TinkerHelper.removeIndex(this.vertex, this._key, this._value);
      }

      this.vertex.properties(this._key).forEachRemaining((property) => {

        if (property.value() === this._value) {
          TinkerHelper.removeIndex(this.vertex, this._key, this._value);
        }
      });
      this._properties = null;
      this.removed = true;
    }
  },

  properties(...propertyKeys) {
    propertyKeys = ArrayUtils.checkArray(propertyKeys)
    if (this._properties === null) return Collections.emptyIterator();
    if (propertyKeys.length === 1) {
      const property = this._properties.getOrDefault(propertyKeys[0], null);
      return property === null ? Collections.emptyIterator() : IteratorUtils.of(property);
    }
    return this._properties.keySet().filter(entry => ElementHelper.keyExists(entry.getKey(), propertyKeys))
      .map(entry => entry.getValue()).iterator();
  },
  toString() {
    return StringFactory.propertyString(this);
  }
};

mixin(TinkerVertexProperty, TinkerElement.prototype, VertexProperty.prototype);


export { TinkerVertexProperty };
