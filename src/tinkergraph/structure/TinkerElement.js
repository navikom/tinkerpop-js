import { mixin } from '../../util';
import Element from '../../structure/Element';
import ElementHelper from '../../structure/util/ElementHelper';

/**
 * TinkerElement
 * @param id
 * @param label
 * @constructor
 */
function TinkerElement(id, label) {
  Element.call(this);
  this._id = id;
  this._label = label;
  this.removed = false;
}

TinkerElement.prototype = {
  constructor: TinkerElement,
  id() {
    return this._id;
  },

  label() {
    return this._label;
  },

  equals(object) {
    return ElementHelper.areEqual(this, object);
  },

  hashCode() {
    return ElementHelper.hashCode(this);
  }

};

mixin(TinkerElement, Element.prototype);

TinkerElement.elementAlreadyRemoved = (clazz, id) => {
  return (`${clazz.TYPE} with id ${id} was removed.`);
};

export { TinkerElement };
