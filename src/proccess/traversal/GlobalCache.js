import { Map } from '../../util';
import DefaultTraversalStrategies from './util/DefaultTraversalStrategies';
import { ConnectiveStrategy } from './strategy';
import IncidentToAdjacentStrategy from './strategy/optimization/IncidentToAdjacentStrategy';
import RepeatUnrollStrategy from './strategy/optimization/RepeatUnrollStrategy';
import InlineFilterStrategy from './strategy/optimization/InlineFilterStrategy';
import AdjacentToIncidentStrategy from './strategy/optimization/AdjacentToIncidentStrategy';
import FilterRankingStrategy from './strategy/optimization/FilterRankingStrategy';
import MatchPredicateStrategy from './strategy/optimization/MatchPredicateStrategy';
import RangeByIsCountStrategy from './strategy/optimization/RangeByIsCountStrategy';
import PathRetractionStrategy from './strategy/optimization/PathRetractionStrategy';
import LazyBarrierStrategy from './strategy/optimization/LazyBarrierStrategy';
import ProfileStrategy from './strategy/finalization/ProfileStrategy';

/**
 * GlobalCache
 */
const GlobalCache = (() => {
  const _GRAPH_CACHE = new Map();
  const graphStrategies = new DefaultTraversalStrategies();
  graphStrategies.addStrategies(
    ConnectiveStrategy.instance(),
    InlineFilterStrategy.instance(),
    IncidentToAdjacentStrategy.instance(),
    AdjacentToIncidentStrategy.instance(),
    FilterRankingStrategy.instance(),
    MatchPredicateStrategy.instance(),
    RepeatUnrollStrategy.instance(),
    RangeByIsCountStrategy.instance(),
    PathRetractionStrategy.instance(),
    LazyBarrierStrategy.instance(),
    ProfileStrategy.instance()
  );
  _GRAPH_CACHE.put('EmptyGraph', new DefaultTraversalStrategies());
  _GRAPH_CACHE.put('Graph', graphStrategies);
  return class {
    static get GRAPH_CACHE() {
      return _GRAPH_CACHE;
    }

    static registerStrategies(graphOrGraphComputerClass, traversalStrategies) {
      _GRAPH_CACHE.put(graphOrGraphComputerClass, traversalStrategies);
    }
    static getStrategies(graphOrGraphComputerClass) {
      const traversalStrategies = _GRAPH_CACHE.getValue(graphOrGraphComputerClass);
      return !traversalStrategies ? _GRAPH_CACHE.getValue('Graph') : traversalStrategies;
    }
  };
})();


export default GlobalCache;
