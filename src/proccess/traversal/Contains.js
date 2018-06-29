import { BiPredicate } from '../../util';

/**
 * The first object is within the {@link Collection} provided in the second object.
 */
class within extends BiPredicate {
  constructor() {
    super()
  }

  test(first, second) {
    return second.contains(first);
  }

  /**
   * The negative of {@code eq} is {@link #neq}.
   */
  negate() {
    return Contains.without;
  }

  toString(){
    return this.constructor.name;
  }
}

/**
 * The first object is not within the {@link Collection} provided in the second object.
 */
class without extends BiPredicate {
  constructor() {
    super()
  }

  test(first, second) {
    return !second.contains(first);
  }

  /**
   * The negative of {@code eq} is {@link #neq}.
   */
  negate() {
    return Contains.within;
  }

  toString(){
    return this.constructor.name;
  }
}

/**
 * {@link Contains} is a {@link BiPredicate} that evaluates whether the first object is contained within (or not
 * within) the second collection object. For example:
 * <p/>
 * <pre>
 * gremlin Contains.within [gremlin, blueprints, furnace] === true
 * gremlin Contains.without [gremlin, rexster] === false
 * rexster Contains.without [gremlin, blueprints, furnace] === true
 * </pre>
 * @type {{eq: eq, neq: neq, gt: gt, gte: gte, lt: lt, lte: lte}}
 */
const Contains = {
  within: new within(),
  without: new without(),
};

export default Contains;