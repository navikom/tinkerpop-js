import { mixin } from '../util';
import Element from './Element';
import Property from './Property';

/**
 * A {@code VertexProperty} is similar to a {@link Property} in that it denotes a key/value pair associated with an
 * {@link Vertex}, however it is different in the sense that it also represents an entity that it is an {@link Element}
 * that can have properties of its own.
 * <p/>
 * A property is much like a Java8 {@link java.util.Optional} in that a property can be not present (i.e. empty).
 * The key of a property is always a String and the value of a property is an arbitrary object.
 * Each underlying graph engine will typically have constraints on what objects are allowed to be used as values.
 * @constructor
 */
function VertexProperty() {
  Property.call(this);
}

VertexProperty.prototype = {
  constructor: VertexProperty,
  type: 'VertexProperty',
  /**
   * Gets the {@link Vertex} that owns this {@code VertexProperty}.
   */
  element() {
    throw new Error('Must be overloaded');
  },

  /**
   * {@inheritDoc}
   */
  graph() {
    return this.element().graph();
  },

  /**
   * {@inheritDoc}
   */
  label() {
    return this.key();
  },

  /**
   * {@inheritDoc}
   */
  properties() {
    throw new Error('Must be overloaded');
  },
};

mixin(VertexProperty, Property.prototype, Element.prototype);

VertexProperty.Cardinality = {
  single: 'single', list: 'list', sets: 'set',
};

VertexProperty.Cardinality.contains = (value) =>
value in VertexProperty.Cardinality || Object.values(VertexProperty.Cardinality).indexOf(value) > -1;

VertexProperty.TYPE = 'VertexProperty';

export default VertexProperty;

const list = VertexProperty.Cardinality.list;
export { list }
