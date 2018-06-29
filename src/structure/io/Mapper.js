/**
 * Represents a low-level serialization class that can be used to map classes to serializers.  These implementation
 * create instances of serializers from other libraries (e.g. creating a {@code Kryo} instance).
 *
 */
export default class Mapper {
  /**
   * Adds a vendor supplied {@link IoRegistry} to the {@code Mapper.Builder} which enables it to check for
   * vendor custom serializers to add to the {@link Mapper}.  All {@link Io} implementations should expose
   * this method via this {@link Builder} so that it is compatible with {@link Graph#io}. Successive calls
   * to this method will add multiple registries.  Registry order must be respected when doing so.  In
   * other words, data written with {@link IoRegistry} {@code A} added first and {@code B} second must be read
   * by a {@code Mapper} with that same registry ordering.  Attempting to add {@code B} before {@code A} will
   * result in errors.
   */
  addRegistries(registries) {
    let b = this;
    for (let i = 0; i < registries.size(); i++) {
      const registry = registries.getValue(i);
      b = this.addRegistry(registry);
    }
    return b;
  }
}