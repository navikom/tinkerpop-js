import { mixin, Collections, ArrayUtils } from '../../../util';
import EmptyGraph from '../empty/EmptyGraph';
import EmptyProperty from '../empty/EmptyProperty';
import Element from '../../Element';
import Vertex from '../../Vertex';
import ElementHelper from '../ElementHelper';

/**
 * DetachedElement
 * @param element
 * @param label
 * @constructor
 */
function DetachedElement(element, label) {
  this._id = element.id() || element;
  this._label = label || element.label() || Vertex.DEFAULT_LABEL;
}

DetachedElement.prototype = {
  constructor: DetachedElement,
  graph() {
    return EmptyGraph.instance();
  },

  id() {
    return this._id;
  },

  label() {
    return this._label;
  },

  property(key, value) {
    if (value) {
      throw ("property Addition Not Supported");
    } else {
      return this._properties && this._properties.containsKey(key)
        ? this._properties.getValue(key).getValue(0) : EmptyProperty;
    }

  },

  properties(...propertyKeys) {
    propertyKeys = ArrayUtils.checkArray(propertyKeys);
    return !this._properties ?
      Collections.emptyIterator() :
      this._properties.keySet().filter(
        (entry) => ElementHelper.keyExists(entry.getKey(), propertyKeys)
      ).iterator();
  }
};

mixin(DetachedElement, Element.prototype);

export { DetachedElement }
