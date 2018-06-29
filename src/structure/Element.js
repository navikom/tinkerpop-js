import { List, IteratorUtils, ArrayUtils } from '../util';
import EmptyProperty from './util/empty/EmptyProperty';
import EmptyGraph from './util/empty/EmptyGraph';

/**
 * Element
 * @constructor
 */
function Element() {

}

Element.prototype = {
  constructor: Element,
  id() {
    throw new Error('Must be overloaded');
  },

  label() {
    throw new Error('Must be overloaded');
  },

  graph() {
    return EmptyGraph.instance();
  },
  /**
   * Get the keys of the properties associated with this element.
   * The default implementation iterators the properties and stores the keys into a {@link HashSet}.
   *
   * @return The property key set
   */
  keys() {
    const keys = [];
    this.properties().forEach(property => keys.push(property.key()));
    return keys;
  },

  /**
   * Get a {@link Property} for the {@code Element} given its key.
   * The default implementation calls the raw {@link Element#properties}.
   */
  property(key, value) {
    if (value) {
      throw new Error('Must be overloaded');
    } else {
      const iterator = this.properties(key);
      return iterator.hasNext() ? iterator.next() : EmptyProperty;
    }
  },
  /**
   * Get the value of a {@link Property} given it's key.
   * The default implementation calls {@link Element#property} and then returns the associated value.
   *
   * @throws NoSuchElementException if the property does not exist on the {@code Element}.
   */
  value(key) {
    if (this.type === Element.TYPES.VERTEX) {
      const iterator = this.properties(key);
      if(!iterator.hasNext()) throw('Property does not exist');
      return iterator.next().value()
    }
    return this.property(key).value();
  },

  /**
   * Get the values of properties as an {@link Iterator}.
   */
  values(...propertyKeys) {
    propertyKeys = ArrayUtils.checkArray(propertyKeys);
    const list = new List();
    IteratorUtils.map(this.properties(propertyKeys),
      (entity) => list.add(entity instanceof List ? entity.getValue(0).value() : entity.value()));

    return list.iterator();
  },

  properties() {
    throw new Error('Must be overloaded');
  },
};

Element.TYPES = {
  VERTEX: 'Vertex',
  EDGE: 'Edge',
  VERTEX_PROPERTY: 'VertexProperty'
};

export default Element;
