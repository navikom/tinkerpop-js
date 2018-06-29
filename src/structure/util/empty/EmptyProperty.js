import { mixin } from '../../../util';
import Property from '../../Property';
function EmptyProperty() {
  Property.call(this);
}

EmptyProperty.prototype = {
  constructor: EmptyProperty,
  key() {
    throw ('property Does No tExist');
  },

  value() {
    throw ('property Does No tExist');
  },

  isPresent() {
    return false;
  },

  element() {
    throw ('property Does No tExist');
  },

  remove() {

  },
};

mixin(EmptyProperty, Property.prototype);

const emptyProperty = new EmptyProperty();
export default emptyProperty;
