import { mixin, Map, List, ArrayUtils } from '../../../util';
import EmptyGraph from '../empty/EmptyGraph';
import EmptyProperty from '../empty/EmptyProperty';
import Element from '../../Element';
import Vertex from '../../Vertex';
import Property from '../../Property';
import { DetachedFactory } from './DetachedFactory';

/**
 * DetachedProperty
 * @param vertex
 * @param label
 * @param properties
 * @constructor
 */
function DetachedProperty(element, value, elem) {
  if (element instanceof Property) {
    this._key = element.key();
    this._value = element.value();
    this._element = DetachedFactory.detach(element.element(), false);
  } else {
    const key = element;
    this._key = key;
    this._value = value;
    this._element = elem ? DetachedFactory.detach(elem, false) : null;
  }

}

DetachedProperty.prototype = {
  constructor: DetachedProperty,
  getValue() {
    return this;
  },

  isPresent() {
    return true;
  },

  key() {
    return this._key;
  },

  value() {
    return this._value;
  },

  element() {
    return this._element;
  },

  remove() {
    throw ("property Removal Not Supported");
  }
};

mixin(DetachedProperty, Property.prototype);


export { DetachedProperty }
