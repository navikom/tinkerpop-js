import { Map, HashSet, List, Collections, Comparator } from '../../util';
import TraversalStrategy from './TraversalStrategy';

const STRATEGY_CATEGORIES = new List([
  TraversalStrategy.DecorationStrategy,
  TraversalStrategy.OptimizationStrategy,
  TraversalStrategy.ProviderOptimizationStrategy,
  TraversalStrategy.FinalizationStrategy,
  TraversalStrategy.VerificationStrategy]);

function TraversalStrategies() {
}

TraversalStrategies.prototype = {
  constructor: TraversalStrategies,
  /**
   * Return the {@link TraversalStrategy} instance associated with the provided class.
   *
   * @param traversalStrategyClass the class of the strategy to get
   * @param <T>                    the strategy class type
   * @return an optional containing the strategy instance or not
   */
  getStrategy(traversalStrategyClass) {
    console.log('TraversalStrategies', traversalStrategyClass);
  },
};

TraversalStrategies.sortStrategies = (strategies) => {
  //const dependencyMap = new HashSet();
  //const strategiesByCategory = new HashSet();
  //const strategyClasses = new List();
  //Initialize data structure
  //strategies.forEach(s => {
  //  strategyClasses.add(s);
  //  Collections.putMultiMap(strategiesByCategory, s.getTraversalCategory(), s);
  //});

  //Initialize all the dependencies
  //strategies.forEach(strategy => {
  //  strategy.applyPrior().forEach(s => {
  //    if (strategyClasses.contains(s)) Collections.putMultiMap(dependencyMap, strategy, s);
  //  });
  //  strategy.applyPost().forEach(s => {
  //    if (strategyClasses.contains(s)) Collections.putMultiMap(dependencyMap, s, strategy);
  //  });
  //});

  //Add dependencies by category
  //const strategiesInPreviousCategories = new List();
  //for (let i = 0; i < STRATEGY_CATEGORIES.size(); i++) {
  //  const category = STRATEGY_CATEGORIES.get(i);
  //
  //  const strategiesInThisCategory = strategiesByCategory.value(category);
  //  if(!strategiesInThisCategory) continue;
  //  for (let j = 0; j < strategiesInThisCategory.size(); j++) {
  //    const strategy = strategiesInThisCategory.get(j);
  //    for (let h = 0; h < strategiesInPreviousCategories.size(); h++) {
  //      Collections.putMultiMap(dependencyMap, strategy, strategiesInPreviousCategories.get(h));
  //    }
  //  }
  //  strategiesInPreviousCategories.addAll(strategiesInThisCategory);
  //}

  //Finally sort via t-sort
  //const unprocessedStrategyClasses = strategies.clone();
  //const sortedStrategyClasses = new List();
  //const seenStrategyClasses = new List();
  //
  //while (!unprocessedStrategyClasses.isEmpty()) {
  //  const strategy = unprocessedStrategyClasses.get(0);
  //  visit(dependencyMap, sortedStrategyClasses, seenStrategyClasses, unprocessedStrategyClasses, strategy);
  //}

  //const sortedStrategies = new List();
  //We now have a list of sorted strategy classes
  //for (let i = 0; i < sortedStrategyClasses.size(); i++) {
  //  for (let j = 0; j < strategies.size(); j++) {
  //    const strategy = strategies.get(j);
  //    if (strategy === sortedStrategyClasses.get(i)) {
  //      sortedStrategies.add(strategy);
  //    }
  //  }
  //}
  strategies.toArray().sort((a, b) => {
    return Comparator.compare(a.position, b.position)
  });
  return strategies;
};

const visit = (dependencyMap, sortedStrategyClasses, seenStrategyClases,
                             unprocessedStrategyClasses, strategyClass) => {
  if (seenStrategyClases.contains(strategyClass)) {
    throw ("Cyclic dependency between traversal strategies: ["
      + seenStrategyClases.toString() + ']');
  }


  if (unprocessedStrategyClasses.contains(strategyClass)) {
    seenStrategyClases.add(strategyClass);

    const dependencies = dependencyMap.value(strategyClass);
    if(dependencies){
      for (let i = 0; i < dependencies.size(); i++) {
        visit(dependencyMap, sortedStrategyClasses, seenStrategyClases, unprocessedStrategyClasses, dependencies.get(i));
      }
    }
    seenStrategyClases.remove(strategyClass);
    unprocessedStrategyClasses.remove(strategyClass);

    sortedStrategyClasses.add(strategyClass);
  }
};

export default TraversalStrategies;
