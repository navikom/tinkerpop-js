import { mixin } from '../../../util';
import Element from '../../Element';
import EmptyGraph from '../empty/EmptyGraph';
import ElementHelper from '../ElementHelper';
function ReferenceElement(object) {
  Element.call(this);
  this.id = object.id;
}

ReferenceElement.prototype = {
  constructor: ReferenceElement,
  id() {
    return this.id;
  },

  label() {
    return '';
  },

  graph() {
    return EmptyGraph.instance();
  },

  hashCode() {
    return ElementHelper.hashCode(this);
  },

  equals(other) {
    // return ElementHelper.areEqual(this, other);
  },

  getValue() {
    return this;
  },
};

mixin(ReferenceElement, Element.prototype);

export { ReferenceElement };
