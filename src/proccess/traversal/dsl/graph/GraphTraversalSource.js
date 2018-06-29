import { mixin, ArrayUtils, Logger } from '../../../../util';
import Traversal from '../../Traversal';
import TraversalSource from '../../TraversalSource';
import Bytecode from '../../Bytecode';
import { AddVertexStartStep, GraphStep } from '../../step/map';
import { InjectStep } from '../../step/sideEffects';
import Vertex from '../../../../structure/Vertex';
import Edge from '../../../../structure/Edge';
import GlobalCache from '../../GlobalCache';

/**
 * GraphTraversalSource
 * @param graph
 * @param traversalStrategies
 * @constructor
 */
function GraphTraversalSource(graph, traversalStrategies) {
  this.graph = graph;
  this.strategies = traversalStrategies || GlobalCache.getStrategies();
  this.bytecode = new Bytecode();
}

GraphTraversalSource.prototype = {
  constructor: GraphTraversalSource,
  getAnonymousTraversalClass() {
    return this.graph.anonymous;
  },

  getStrategies() {
    return this.strategies;
  },

  getGraph() {
    return this.graph;
  },

  getBytecode() {
    return this.bytecode;
  },

  clone() {
    try {
      const clone = Object.assign(Object.create(this), this);
      clone.strategies = this.strategies && this.strategies.clone();
      clone.bytecode = this.bytecode.clone();
      return clone;
    } catch (e) {
      throw (e);
    }
  },

// // CONFIGURATIONS

  withStrategies(...traversalStrategies) {
    return TraversalSource.prototype.withStrategies.call(this, traversalStrategies);
  },


  withSideEffect(key, initialValue, reducer) {
    if (reducer) {
      return TraversalSource.prototype.withSideEffect.call(this, key, initialValue, reducer);
    }
    return TraversalSource.prototype.withSideEffect.call(this, key, initialValue);
  },


  withSack(initialValue, splitOperator, mergeOperator) {
    if (mergeOperator) {
      return TraversalSource.prototype.withSack.call(this, initialValue, splitOperator, mergeOperator);
    } else if (splitOperator) {
      return TraversalSource.prototype.withSack.call(this, initialValue, splitOperator);
    }
    return TraversalSource.prototype.withSack.call(this, initialValue);
  },

  withBulk(useBulk) {
    if (useBulk) { return this; }
    const clone = this.clone();
    clone.bytecode.addSource(GraphTraversalSource.Symbols.withBulk, useBulk);
    return clone;
  },

  withPath() {
    const clone = this.clone();
    // RequirementsStrategy.addRequirements(clone.getStrategies(), TraverserRequirement.PATH);
    // clone.bytecode.addSource(Symbols.withPath);
    return clone;
  },

// // SPAWNS

  addV(label) {
    const clone = this.clone();
    const traversal = this.getAnonymousTraversalClass().start(clone);
    if (label) {
      clone.bytecode.addStep('addV', label);
    } else {
      clone.bytecode.addStep('addV');
      label = null;
    }
    return Traversal.prototype.addStep.call(traversal, new AddVertexStartStep(traversal, label));
  },

  inject(...starts) {
    starts = ArrayUtils.checkArray(starts);
    const clone = this.clone();
    clone.bytecode.addStep('inject', starts);
    const traversal = this.getAnonymousTraversalClass().start(clone);
    return Traversal.prototype.addStep.call(traversal, new InjectStep(traversal, starts));
  },

  V(...vertexIds) {
    const logger = Logger.init();
    logger.start();
    vertexIds = ArrayUtils.checkArray(vertexIds);
    const clone = this.clone();
    clone.bytecode.addStep('V', vertexIds);
    const traversal = this.getAnonymousTraversalClass().start(clone);
    const output = Traversal.prototype.addStep.call(traversal, new GraphStep(traversal, Vertex, true, vertexIds));
    //logger.info('GraphTraversalSource::V');
    return output;
  },

  E(...edgesIds) {
    const logger = Logger.init();
    logger.start();
    const clone = this.clone();
    clone.bytecode.addStep('E', edgesIds);
    const traversal = this.getAnonymousTraversalClass().start(clone);
    const output = Traversal.prototype.addStep.call(traversal, new GraphStep(traversal, Edge, true, edgesIds));
    logger.info('GraphTraversalSource::E');
    return output;
  },
};

mixin(GraphTraversalSource, TraversalSource.prototype);

GraphTraversalSource.Symbols = {
  withBulk: 'withBulk',
  withPath: 'withPath',
};

export default GraphTraversalSource;
