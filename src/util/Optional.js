/**
 * Optional
 */
export class Optional {

  static get EMPTY() {
    return new Optional();
  }

  constructor(value) {
    this._value = value || null;
  }

  static empty() {
    return Optional.EMPTY;
  }

  /**
   * Returns an {@code Optional} with the specified present non-null value.
   *
   * @param <T> the class of the value
   * @param value the value to be present, which must be non-null
   * @return an {@code Optional} with the value present
   * @throws NullPointerException if value is null
   */
  static of(value) {
    return new Optional(value);
  }

  /**
   * Returns an {@code Optional} describing the specified value, if non-null,
   * otherwise returns an empty {@code Optional}.
   *
   * @param <T> the class of the value
   * @param value the possibly-null value to describe
   * @return an {@code Optional} with a present value if the specified value
   * is non-null, otherwise an empty {@code Optional}
   */
  static ofNullable(value) {
    return value === null ? Optional.empty() : Optional.of(value);
  }

  /**
   * If a value is present in this {@code Optional}, returns the value,
   * otherwise throws {@code NoSuchElementException}.
   *
   * @return the non-null value held by this {@code Optional}
   * @throws NoSuchElementException if there is no value present
   *
   * @see Optional#isPresent()
   */
  getValue() {
    if (this._value === null) {
      throw ('No value present');
    }
    return this._value;
  }

  /**
   * Return {@code true} if there is a value present, otherwise {@code false}.
   *
   * @return {@code true} if there is a value present, otherwise {@code false}
   */
  isPresent() {
    return this._value !== null;
  }

  /**
   * If a value is present, invoke the specified consumer with the value,
   * otherwise do nothing.
   *
   * @param consumer block to be executed if a value is present
   * @throws NullPointerException if value is present and {@code consumer} is
   * null
   */
  ifPresent(consumer) {
    if (this._value != null) { consumer(this._value); }
  }

  /**
   * If a value is present, and the value matches the given predicate,
   * return an {@code Optional} describing the value, otherwise return an
   * empty {@code Optional}.
   *
   * @param predicate a predicate to apply to the value, if present
   * @return an {@code Optional} describing the value of this {@code Optional}
   * if a value is present and the value matches the given predicate,
   * otherwise an empty {@code Optional}
   * @throws NullPointerException if the predicate is null
   */
  filter(predicate) {
    if (!this.isPresent()) { return this; }
    return predicate(this._value) ? this : Optional.empty();
  }

  /**
   * If a value is present, apply the provided mapping function to it,
   * and if the result is non-null, return an {@code Optional} describing the
   * result.  Otherwise return an empty {@code Optional}.
   *
   * @apiNote This method supports post-processing on optional values, without
   * the need to explicitly check for a return status.  For example, the
   * following code traverses a stream of file names, selects one that has
   * not yet been processed, and then opens that file, returning an
   * {@code Optional<FileInputStream>}:
   *
   * <pre>{@code
   *     Optional<FileInputStream> fis =
     *         names.stream().filter(name -> !isProcessedYet(name))
     *                       .findFirst()
     *                       .map(name -> new FileInputStream(name));
     * }</pre>
   *
   * Here, {@code findFirst} returns an {@code Optional<String>}, and then
   * {@code map} returns an {@code Optional<FileInputStream>} for the desired
   * file if one exists.
   *
   * @param <U> The type of the result of the mapping function
   * @param mapper a mapping function to apply to the value, if present
   * @return an {@code Optional} describing the result of applying a mapping
   * function to the value of this {@code Optional}, if a value is present,
   * otherwise an empty {@code Optional}
   * @throws NullPointerException if the mapping function is null
   */
  map(mapper) {
    if (!this.isPresent()) { return Optional.empty(); }

    return mapper(this._value);
  }

  /**
   * If a value is present, apply the provided {@code Optional}-bearing
   * mapping function to it, return that result, otherwise return an empty
   * {@code Optional}.  This method is similar to {@link #map(Function)},
   * but the provided mapper is one whose result is already an {@code Optional},
   * and if invoked, {@code flatMap} does not wrap it with an additional
   * {@code Optional}.
   *
   * @param <U> The type parameter to the {@code Optional} returned by
   * @param mapper a mapping function to apply to the value, if present
   *           the mapping function
   * @return the result of applying an {@code Optional}-bearing mapping
   * function to the value of this {@code Optional}, if a value is present,
   * otherwise an empty {@code Optional}
   * @throws NullPointerException if the mapping function is null or returns
   * a null result
   */
  flatMap(mapper) {
    return this.map(mapper);
  }

  /**
   * Return the value if present, otherwise return {@code other}.
   *
   * @param other the value to be returned if there is no value present, may
   * be null
   * @return the value, if present, otherwise {@code other}
   */
  orElse(other) {
    return this._value !== null ? this._value : other;
  }

  /**
   * Return the value if present, otherwise invoke {@code other} and return
   * the result of that invocation.
   *
   * @param other a {@code Supplier} whose result is returned if no value
   * is present
   * @return the value if present otherwise the result of {@code other.get()}
   * @throws NullPointerException if value is not present and {@code other} is
   * null
   */
  orElseGet(other) {
    return this._value !== null ? this._value : other.value();
  }

  /**
   * Return the contained value, if present, otherwise throw an exception
   * to be created by the provided supplier.
   *
   * @apiNote A method reference to the exception constructor with an empty
   * argument list can be used as the supplier. For example,
   * {@code IllegalStateException::new}
   *
   * @param <X> Type of the exception to be thrown
   * @param exceptionSupplier The supplier which will return the exception to
   * be thrown
   * @return the present value
   * @throws X if there is no value present
   * @throws NullPointerException if no value is present and
   * {@code exceptionSupplier} is null
   */
  orElseThrow(exceptionSupplier) {
    if (this._value !== null) {
      return this._value;
    }
    throw exceptionSupplier;
  }

  /**
   * Indicates whether some other object is "equal to" this Optional. The
   * other object is considered equal if:
   * <ul>
   * <li>it is also an {@code Optional} and;
   * <li>both instances have no value present or;
   * <li>the present values are "equal to" each other via {@code equals()}.
   * </ul>
   *
   * @param obj an object to be tested for equality
   * @return {code true} if the other object is "equal to" this object
   * otherwise {@code false}
   */
  equals(obj) {
    if (this === obj) {
      return true;
    }

    if (!(obj instanceof Optional)) {
      return false;
    }

    const other = obj;
    return this._value === other._value;
  }
}
