import { mixin } from '../../../util';
import { ReferenceFactory } from './';
import { Attachable } from '../Attachable';
import Property from '../../Property';

/**
 * ReferenceProperty
 * @param property
 * @constructor
 */
function ReferenceProperty(property) {
  this.element = ReferenceFactory.detach(property.element());
  this.key = property.key();
  this.value = property.value();
}

ReferenceProperty.prototype = {
  constructor: ReferenceProperty,
  key() {
    return this.key;
  },

  value() {
    return this.value;
  },

  isPresent() {
    return true;
  },

  element() {
    return this.element;
  },

  remove() {
    throw ('property Removal Not Supported');
  },
};

mixin(ReferenceProperty, Attachable.prototype, Property.prototype);

export default ReferenceProperty;
