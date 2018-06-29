/**
 * Property
 * @constructor
 */
function Property() {

}

Property.prototype = {
  constructor: Property,
  type: 'Property',
  propType: 'Property',
  /**
   * The key of the property.
   *
   * @return The property key
   */
  key() {
    throw new Error('Must be overloaded');
  },

  /**
   * The value of the property.
   *
   * @return The property value
   * @throws NoSuchElementException thrown if the property is empty
   */
  value() {
    throw new Error('Must be overloaded');
  },

  /**
   * Whether the property is empty or not.
   *
   * @return True if the property exists, else false
   */
  isPresent() {
    throw new Error('Must be overloaded');
  },

  /**
   * If the property is present, the consume the value as specified by the {@link Consumer}.
   *
   * @param consumer The consumer to process the existing value.
   */
  ifPresent(consumer) {
    if (this.isPresent()) { consumer.accept(this.value()); }
  },

  /**
   * If the value is present, return the value, else return the provided value.
   *
   * @param otherValue The value to return if the property is not present
   * @return A value
   */
  orElse(otherValue) {
    return this.isPresent() ? this.value() : otherValue;
  },

  /**
   * If the value is present, return the value, else generate a value given the {@link Supplier}.
   *
   * @param valueSupplier The supplier to use to generate a value if the property is not present
   * @return A value
   */
  orElseGet(valueSupplier) {
    return this.isPresent() ? this.value() : valueSupplier.getValue();
  },


  /**
   * Get the element that this property is associated with.
   *
   * @return The element associated with this property (i.e. {@link Vertex}, {@link Edge}, or {@link VertexProperty}).
   */
  getElement() {
    throw new Error('Must be overloaded');
  },

  /**
   * Remove the property from the associated element.
   */
  remove() {
    throw new Error('Must be overloaded');
  },
};

Property.TYPE = 'Property';
export default Property;
