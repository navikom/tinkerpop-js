/**
 * Represents a predicate (boolean-valued function) of two arguments.  This is
 * the two-arity specialization of {@link Predicate}.
 *
 * <p>This is a <a href="package-summary.html">functional interface</a>
 * whose functional method is {@link #test(Object, Object)}.
 *
 * @param <T> the type of the first argument to the predicate
 * @param <U> the type of the second argument the predicate
 *
 * @see Predicate
 */
export class BiPredicate {
  /**
   * Returns a composed predicate that represents a short-circuiting logical
   * AND of this predicate and another.  When evaluating the composed
   * predicate, if this predicate is {@code false}, then the {@code other}
   * predicate is not evaluated.
   *
   * <p>Any exceptions thrown during evaluation of either predicate are relayed
   * to the caller; if evaluation of this predicate throws an exception, the
   * {@code other} predicate will not be evaluated.
   *
   * @param other a predicate that will be logically-ANDed with this
   *              predicate
   * @return a composed predicate that represents the short-circuiting logical
   * AND of this predicate and the {@code other} predicate
   */
  and(other) {
    return (t, u) => this.test(t, u) && other.test(t, u);
  }

  /**
   * Returns a predicate that represents the logical negation of this
   * predicate.
   *
   * @return a predicate that represents the logical negation of this
   * predicate
   */
  negate() {
    return (t, u) => !this.test(t, u);
  }

  /**
   * Returns a composed predicate that represents a short-circuiting logical
   * OR of this predicate and another.  When evaluating the composed
   * predicate, if this predicate is {@code true}, then the {@code other}
   * predicate is not evaluated.
   *
   * <p>Any exceptions thrown during evaluation of either predicate are relayed
   * to the caller; if evaluation of this predicate throws an exception, the
   * {@code other} predicate will not be evaluated.
   *
   * @param other a predicate that will be logically-ORed with this
   *              predicate
   * @return a composed predicate that represents the short-circuiting logical
   * OR of this predicate and the {@code other} predicate
   */
  or(other) {
    return (t, u) => this.test(t, u) || other.test(t, u);
  }

  toString(){
    return this.constructor.name;
  }
}
