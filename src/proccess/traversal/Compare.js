import { BiPredicate } from '../../util';


/**
 * Evaluates if the first object is equal to the second.  If both are of type {@link Number} but not of the
 * same class (i.e. double for the first object and long for the second object) both values are converted to
 * {@link BigDecimal} so that it can be evaluated via {@link BigDecimal#compareTo}.  Otherwise they are evaluated
 * via {@link Object#equals(Object)}.  Testing against {@link Number#doubleValue()} enables the compare
 * operations to be a bit more forgiving with respect to comparing different number types.
 */
class eq extends BiPredicate {
  constructor() {
    super()
  }

  test(first, second) {
    return !first ? !second : first === second;
  }

  /**
   * The negative of {@code eq} is {@link #neq}.
   */
  negate() {
    return Compare.neq;
  }
}

/**
 * Evaluates if the first object is not equal to the second.  If both are of type {@link Number} but not of the
 * same class (i.e. double for the first object and long for the second object) both values are converted to
 * {@link BigDecimal} so that it can be evaluated via {@link BigDecimal#equals}.  Otherwise they are evaluated
 * via {@link Object#equals(Object)}.  Testing against {@link Number#doubleValue()} enables the compare
 * operations to be a bit more forgiving with respect to comparing different number types.
 */
class neq extends BiPredicate {
  constructor() {
    super()
  }

  test(first, second) {
    return !Compare.eq.test(first, second);
  }

  /**
   * The negative of {@code eq} is {@link #neq}.
   */
  negate() {
    return Compare.eq;
  }
}

/**
 * Evaluates if the first object is greater than the second.  If both are of type {@link Number} but not of the
 * same class (i.e. double for the first object and long for the second object) both values are converted to
 * {@link BigDecimal} so that it can be evaluated via {@link BigDecimal#compareTo}.  Otherwise they are evaluated
 * via {@link Comparable#compareTo(Object)}.  Testing against {@link BigDecimal#compareTo} enables the compare
 * operations to be a bit more forgiving with respect to comparing different number types.
 */
class gt extends BiPredicate {
  constructor() {
    super()
  }

  test(first, second) {
    return first > second;
  }

  /**
   * The negative of {@code eq} is {@link #neq}.
   */
  negate() {
    return Compare.lte;
  }
}

/**
 * Evaluates if the first object is greater-equal to the second.  If both are of type {@link Number} but not of the
 * same class (i.e. double for the first object and long for the second object) both values are converted to
 * {@link BigDecimal} so that it can be evaluated via {@link BigDecimal#compareTo}.  Otherwise they are evaluated
 * via {@link Comparable#compareTo(Object)}.  Testing against {@link BigDecimal#compareTo} enables the compare
 * operations to be a bit more forgiving with respect to comparing different number types.
 */
class gte extends BiPredicate {
  constructor() {
    super()
  }

  test(first, second) {
    return !first ? !second : !Compare.lt.test(first, second);
  }

  /**
   * The negative of {@code eq} is {@link #neq}.
   */
  negate() {
    return Compare.lt;
  }
}

/**
 * Evaluates if the first object is less than the second.  If both are of type {@link Number} but not of the
 * same class (i.e. double for the first object and long for the second object) both values are converted to
 * {@link BigDecimal} so that it can be evaluated via {@link BigDecimal#compareTo}.  Otherwise they are evaluated
 * via {@link Comparable#compareTo(Object)}.  Testing against {@link BigDecimal#compareTo} enables the compare
 * operations to be a bit more forgiving with respect to comparing different number types.
 */
class lt extends BiPredicate {
  constructor() {
    super()
  }

  test(first, second) {
    return first < second;
  }

  /**
   * The negative of {@code eq} is {@link #neq}.
   */
  negate() {
    return Compare.gte;
  }
}

/**
 * Evaluates if the first object is less-equal to the second.  If both are of type {@link Number} but not of the
 * same class (i.e. double for the first object and long for the second object) both values are converted to
 * {@link BigDecimal} so that it can be evaluated via {@link BigDecimal#compareTo}.  Otherwise they are evaluated
 * via {@link Comparable#compareTo(Object)}.  Testing against {@link BigDecimal#compareTo} enables the compare
 * operations to be a bit more forgiving with respect to comparing different number types.
 */
class lte extends BiPredicate {
  constructor() {
    super()
  }

  test(first, second) {
    return !first ? !second : second && !Compare.gt.test(first, second);
  }

  /**
   * The negative of {@code eq} is {@link #neq}.
   */
  negate() {
    return Compare.gt;
  }
}

/**
 * {@link Compare} is a {@link BiPredicate} that determines whether the first argument is {@code ===}, {@code !==},
 * {@code >}, {@code >=}, {@code <}, {@code <=} to the second argument.
 * @type {{eq: eq, neq: neq, gt: gt, gte: gte, lt: lt, lte: lte}}
 */
const Compare = {
  eq: new eq(),
  neq: new neq(),
  gt: new gt(),
  gte: new gte(),
  lt: new lt(),
  lte: new lte(),
};

export default Compare;