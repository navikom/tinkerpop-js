/**
 * BinaryOperator
 */
export default class BinaryOperator {
  /**
   * Returns a {@link BinaryOperator} which returns the lesser of two elements
   * according to the specified {@code Comparator}.
   *
   * @param <T> the type of the input arguments of the comparator
   * @param comparator a {@code Comparator} for comparing the two values
   * @return a {@code BinaryOperator} which returns the lesser of its operands,
   *         according to the supplied {@code Comparator}
   */
  static minBy(comparator) {
    return (a, b) => comparator.sort((a, b) => a < b);
  }

  /**
   * Returns a {@link BinaryOperator} which returns the greater of two elements
   * according to the specified {@code Comparator}.
   *
   * @param <T> the type of the input arguments of the comparator
   * @param comparator a {@code Comparator} for comparing the two values
   * @return a {@code BinaryOperator} which returns the greater of its operands,
   *         according to the supplied {@code Comparator}
   */
  static maxBy(comparator) {
    return (a, b) => comparator.sort((a, b) => a > b);
  }
}