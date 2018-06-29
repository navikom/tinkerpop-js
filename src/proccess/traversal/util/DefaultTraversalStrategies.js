import { mixin, List, ArrayUtils, Collections, Optional } from '../../../util';
import TraversalStrategies from '../TraversalStrategies';

/**
 *
 * @constructor
 */
function DefaultTraversalStrategies() {
  this.traversalStrategies = new List();
}

DefaultTraversalStrategies.prototype = {
  constructor: DefaultTraversalStrategies,


  addStrategies(...strategies) {
    strategies = ArrayUtils.checkArray(strategies);

    const concurrent = new List(this.traversalStrategies);
    for (let i = 0; i < strategies.length; i++) {
      const addStrategy = strategies[i];
      for (let j = 0; j < concurrent.size(); j++) {
        const currentStrategy = concurrent.getValue(j);
        if (addStrategy === currentStrategy) {
          this.traversalStrategies.remove(currentStrategy);
        }
      }
    }

    Collections.addAll(this.traversalStrategies, strategies);
    this.traversalStrategies = TraversalStrategies.sortStrategies(this.traversalStrategies);
    return this;
  },

  removeStrategies(...strategyClasses) {
    strategyClasses = ArrayUtils.checkArray(strategyClasses);
    let removed = false;
    for (let i = 0; i < strategyClasses.length; i++) {
      const strategyClass = strategyClasses[i];
      const strategy = this.traversalStrategies.iterator().filter(s => s === strategyClass).getValue(0);
      if (strategy.isPresent()) {
        this.traversalStrategies.remove(strategy.getValue());
        removed = true;
      }
    }
    if (removed) { this.traversalStrategies = TraversalStrategies.sortStrategies(this.traversalStrategies); }
    return this;
  },

  toList() {
    return this.traversalStrategies;
  },

  getStrategy(traversalStrategyClass) {
    for (let i = 0; i < this.traversalStrategies.size(); i++) {
      const traversalStrategy = this.traversalStrategies.getValue(i);
      if (traversalStrategyClass === traversalStrategy) { return Optional.of(traversalStrategy); }
    }
    return Optional.empty();
  },

  applyStrategies(traversal) {
    for (let i = 0; i < this.traversalStrategies.size(); i++) {
      const traversalStrategy = this.traversalStrategies.get(i);
      traversalStrategy.apply(traversal);
    }
  },

  clone() {
    try {
      const clone = Object.assign(Object.create(this), this);
      clone.traversalStrategies = new List(this.traversalStrategies.array);
      return clone;
    } catch (e) {
      throw (e);
    }
  },
};

mixin(DefaultTraversalStrategies, TraversalStrategies.prototype);

export default DefaultTraversalStrategies;
