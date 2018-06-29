import { mixin } from '../../../util';
import VertexProperty from '../../VertexProperty';
import EmptyProperty from './EmptyProperty';
import { Collections } from '../../../util';

/**
 * EmptyVertexProperty
 * @constructor
 */
function EmptyVertexProperty() {
  VertexProperty.call(this);
}

EmptyVertexProperty.prototype = {
  constructor: EmptyVertexProperty,
  element() {
    throw ('property Does Not Exist');
  },

  id() {
    throw ('property Does Not Exist');
  },

  graph() {
    throw ('property Does Not Exist');
  },

  property() {
    return EmptyProperty;
  },


  key() {
    throw ('property Does Not Exist');
  },

  value() {
    throw ('property Does Not Exist');
  },

  isPresent() {
    return false;
  },

  remove() {

  },

  properties() {
    return Collections.emptyIterator();
  },
};

mixin(EmptyVertexProperty, VertexProperty.prototype);

const emptyVertexProperty = new EmptyVertexProperty();
export default emptyVertexProperty;
