import { mixin } from '../../../util';
import { ReferenceElement, ReferenceVertex } from './';
import VertexProperty from '../../VertexProperty';
import { Collections } from '../../../util';

/**
 * ReferenceVertexProperty
 * @param vertexProperty
 * @constructor
 */
function ReferenceVertexProperty(vertexProperty) {
  ReferenceElement.call(this, vertexProperty);

  this.vertex = new ReferenceVertex(vertexProperty.element());
  this.label = vertexProperty.key();
  this.value = vertexProperty.value();
}

ReferenceVertexProperty.prototype = {
  constructor: ReferenceVertexProperty,
  key() {
    return this.label;
  },

  label() {
    return this.label;
  },

  value() {
    return this.value;
  },

  isPresent() {
    return true;
  },

  element() {
    return this.vertex;
  },

  property() {
    throw ('property Addition Not Supported');
  },

  remove() {
    throw ('property Addition Not Supported');
  },

  properties(...propertyKeys) {
    return Collections.emptyIterator();
  },
};

mixin(ReferenceVertexProperty, ReferenceElement.prototype, VertexProperty.prototype);

export { ReferenceVertexProperty };
