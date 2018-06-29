import { mixin, Collections, BaseConfiguration, List } from '../../util';

/**
 * A {@link TraversalStrategy} defines a particular atomic operation for mutating a {@link Traversal} prior to its evaluation.
 * There are 6 pre-defined "traversal categories": {@link DecorationStrategy},
 * {@link OptimizationStrategy}, {@link ProviderOptimizationStrategy}, {@link FinalizationStrategy}, and {@link VerificationStrategy}.
 * Strategies within a category are sorted amongst themselves and then category sorts are applied in the ordered specified previous.
 * That is, decorations are applied, then optimizations, then provider optimizations, then finalizations, and finally, verifications.
 * If a strategy does not fit within the specified categories, then it can simply implement {@link TraversalStrategy} and can have priors/posts that span categories.
 * <p/>
 * A traversal strategy should be a final class as various internal operations on a strategy are based on its ability to be assigned to more general classes.
 * A traversal strategy should typically be stateless with a public static <code>instance()</code> method.
 * However, at limit, a traversal strategy can have a state defining constructor (typically via a "builder"), but that state can not mutate once instantiated.
 *
 * @constructor
 */
function TraversalStrategy() {

}

TraversalStrategy.prototype = {
  constructor: TraversalStrategy,


  apply(traversal) {
    throw ('Must be overloaded');
  },

  /**
   * The set of strategies that must be executed before this strategy is executed.
   * If there are no ordering requirements, the default implementation returns an empty set.
   *
   * @return the set of strategies that must be executed prior to this one.
   */
  applyPrior() {
    return new List();
  },

  /**
   * The set of strategies that must be executed after this strategy is executed.
   * If there are no ordering requirements, the default implementation returns an empty set.
   *
   * @return the set of strategies that must be executed post this one
   */
  applyPost() {
    return new List();
  },

  /**
   * The type of traversal strategy -- i.e. {@link DecorationStrategy}, {@link OptimizationStrategy},
   * {@link FinalizationStrategy}, or {@link VerificationStrategy}.
   *
   * @return the traversal strategy category class
   */
  getTraversalCategory() {
    return TraversalStrategy;
  },

	/**
   * The path for strategies sorting
   * @returns {string}
   */
  getTraversalCategoryPath() {
    return '';
  },

  /**
   * Get the configuration representation of this strategy.
   * This is useful for converting a strategy into a serialized form.
   *
   * @return the configuration used to create this strategy
   */
  getConfiguration() {
    return new BaseConfiguration();
  },

  compareTo(otherTraversalCategory) {
    return 0;
  },

};

TraversalStrategy.STRATEGY = 'strategy';

/**
 * DecorationStrategy
 * Implemented by strategies that adds "application logic" to the traversal (e.g. {@link PartitionStrategy}).
 * @constructor
 */
TraversalStrategy.DecorationStrategy = function () {

};

TraversalStrategy.DecorationStrategy.prototype = {
  constructor: TraversalStrategy.DecorationStrategy,

  getTraversalCategory() {
    return TraversalStrategy.DecorationStrategy;
  },

  getTraversalCategoryPath() {
    return 'decoration';
  },

  compareTo(otherTraversalCategory) {
    if (otherTraversalCategory === TraversalStrategy.DecorationStrategy) { return 0; }
    else if (otherTraversalCategory === TraversalStrategy.OptimizationStrategy) { return -1; }
    else if (otherTraversalCategory === TraversalStrategy.ProviderOptimizationStrategy) { return -1; }
    else if (otherTraversalCategory === TraversalStrategy.FinalizationStrategy) { return -1; }
    else if (otherTraversalCategory === TraversalStrategy.VerificationStrategy) { return -1; }
    return 0;
  },
};

mixin(TraversalStrategy.DecorationStrategy, TraversalStrategy.prototype);

/**
 * OptimizationStrategy
 * Implemented by strategies that rewrite the traversal to be more efficient, but with the same semantics
 * (e.g. {@link RangeByIsCountStrategy}). During a re-write ONLY TinkerPop steps should be used.
 * For strategies that utilize provider specific steps, use {@link ProviderOptimizationStrategy}.
 * @constructor
 */
TraversalStrategy.OptimizationStrategy = function () {

};

TraversalStrategy.OptimizationStrategy.prototype = {
  constructor: TraversalStrategy.OptimizationStrategy,

  getTraversalCategory() {
    return TraversalStrategy.OptimizationStrategy;
  },

  getTraversalCategoryPath() {
    return 'optimization';
  },

  compareTo(otherTraversalCategory) {
    if (otherTraversalCategory === TraversalStrategy.DecorationStrategy) { return 1; }
    else if (otherTraversalCategory === TraversalStrategy.OptimizationStrategy) { return 0; }
    else if (otherTraversalCategory === TraversalStrategy.ProviderOptimizationStrategy) { return -1; }
    else if (otherTraversalCategory === TraversalStrategy.FinalizationStrategy) { return -1; }
    else if (otherTraversalCategory === TraversalStrategy.VerificationStrategy) { return -1; }
    return 0;
  },
};

mixin(TraversalStrategy.OptimizationStrategy, TraversalStrategy.prototype);

/**
 * ProviderOptimizationStrategy
 * Implemented by strategies that rewrite the traversal to be more efficient, but with the same semantics.
 * This is for graph system/language/driver providers that want to rewrite a traversal using provider specific steps.
 * @constructor
 */
TraversalStrategy.ProviderOptimizationStrategy = function () {

};

TraversalStrategy.ProviderOptimizationStrategy.prototype = {
  constructor: TraversalStrategy.ProviderOptimizationStrategy,

  getTraversalCategory() {
    return TraversalStrategy.ProviderOptimizationStrategy;
  },

  getTraversalCategoryPath() {
    return 'optimization';
  },

  compareTo(otherTraversalCategory) {
    if (otherTraversalCategory === TraversalStrategy.DecorationStrategy) { return 1; }
    else if (otherTraversalCategory === TraversalStrategy.OptimizationStrategy) { return 1; }
    else if (otherTraversalCategory === TraversalStrategy.ProviderOptimizationStrategy) { return 0; }
    else if (otherTraversalCategory === TraversalStrategy.FinalizationStrategy) { return -1; }
    else if (otherTraversalCategory === TraversalStrategy.VerificationStrategy) { return -1; }
    return 0;
  },
};
mixin(TraversalStrategy.ProviderOptimizationStrategy, TraversalStrategy.prototype);

/**
 * FinalizationStrategy
 * Implemented by strategies that do final behaviors that require a fully compiled traversal to work (e.g.
 * {@link ProfileStrategy}).
 * @constructor
 */
TraversalStrategy.FinalizationStrategy = function () {

};

TraversalStrategy.FinalizationStrategy.prototype = {
  constructor: TraversalStrategy.FinalizationStrategy,

  getTraversalCategory() {
    return TraversalStrategy.FinalizationStrategy;
  },

  getTraversalCategoryPath() {
    return 'finalization';
  },

  compareTo(otherTraversalCategory) {
    if (otherTraversalCategory === TraversalStrategy.DecorationStrategy) { return 1; }
    else if (otherTraversalCategory === TraversalStrategy.OptimizationStrategy) { return 1; }
    else if (otherTraversalCategory === TraversalStrategy.ProviderOptimizationStrategy) { return 1; }
    else if (otherTraversalCategory === TraversalStrategy.FinalizationStrategy) { return 0; }
    else if (otherTraversalCategory === TraversalStrategy.VerificationStrategy) { return -1; }
    return 0;
  },
};
mixin(TraversalStrategy.FinalizationStrategy, TraversalStrategy.prototype);

/**
 * VerificationStrategy
 * Implemented by strategies where there is no more behavioral tweaking of the traversal required.  Strategies that
 * implement this category will simply analyze the traversal and throw exceptions if the traversal is not correct
 * for the execution context (e.g. {@link LambdaRestrictionStrategy}).
 * @constructor
 */
TraversalStrategy.VerificationStrategy = function () {

};

TraversalStrategy.VerificationStrategy.prototype = {
  constructor: TraversalStrategy.VerificationStrategy,

  getTraversalCategory() {
    return TraversalStrategy.VerificationStrategy;
  },

  getTraversalCategoryPath() {
    return 'verification';
  },

  compareTo(otherTraversalCategory) {
    if (otherTraversalCategory === TraversalStrategy.DecorationStrategy) { return 1; }
    else if (otherTraversalCategory === TraversalStrategy.OptimizationStrategy) { return 1; }
    else if (otherTraversalCategory === TraversalStrategy.ProviderOptimizationStrategy) { return 1; }
    else if (otherTraversalCategory === TraversalStrategy.FinalizationStrategy) { return 1; }
    return 0;
  },
};

mixin(TraversalStrategy.VerificationStrategy, TraversalStrategy.prototype);
export default TraversalStrategy;
