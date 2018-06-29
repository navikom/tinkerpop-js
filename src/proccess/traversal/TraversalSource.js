function TraversalSource() {

}
TraversalSource.prototype = {
  constructor: TraversalSource,
  /**
   * Get the {@link TraversalStrategies} associated with this traversal source.
   *
   * @return the traversal strategies of the traversal source
   */
  getStrategies() {
    throw new Error('Must be overloaded');
  },

  /**
   * Get the {@link Graph} associated with this traversal source.
   *
   * @return the graph of the traversal source
   */
  getGraph() {
    throw new Error('Must be overloaded');
  },

  /**
   * Get the {@link Bytecode} associated with the current state of this traversal source.
   *
   * @return the traversal source byte code
   */
  getBytecode() {
    throw new Error('Must be overloaded');
  },

  // ///////////////////////////

  /**
   * Add an arbitrary collection of {@link TraversalStrategy} instances to the traversal source.
   *
   * @param traversalStrategyClasses a collection of traversal strategy classes to remove
   * or
   *
   * Remove an arbitrary collection of {@link TraversalStrategy} classes from the traversal source.
   *
   * @param traversalStrategies a collection of traversal strategies to add
   * @return a new traversal source with updated strategies
   */
  withStrategies(...traversalStrategies) {
    // const clone = this.clone();
    // clone.getStrategies().addStrategies(traversalStrategies);
    // clone.getBytecode().addSource(TraversalSource.Symbols.withStrategies, traversalStrategies);
    // for (final TraversalStrategy traversalStrategy : traversalStrategies) {
    //  if (traversalStrategy instanceof VertexProgramStrategy) {
    //    ((VertexProgramStrategy) traversalStrategy).addGraphComputerStrategies(clone);
    //  }
    // }
    // return clone;
  },


  /**
   * Add a {@link Computer} that will generate a {@link GraphComputer} from the {@link Graph} that will be used to execute the traversal.
   * This adds a {@link VertexProgramStrategy} to the strategies.
   *
   * @param computer a builder to generate a graph computer from the graph
   * @return a new traversal source with updated strategies
   */
  withComputer(computer) {
    // return this.withStrategies(new VertexProgramStrategy(computer));
  },

  /**
   * Add a {@link GraphComputer} class used to execute the traversal.
   * This adds a {@link VertexProgramStrategy} to the strategies.
   *
   * @param graphComputerClass the graph computer class
   * @return a new traversal source with updated strategies
   */
  withComputer(graphComputerClass) {
    // return this.withStrategies(new VertexProgramStrategy(Computer.compute(graphComputerClass)));
  },


  /**
   * Add a sideEffect to be used throughout the life of a spawned {@link Traversal}.
   * This adds a {@link org.apache.tinkerpop.gremlin.process.traversal.strategy.decoration.SideEffectStrategy} to the strategies.
   *
   * @param key          the key of the sideEffect
   * @param initialValue a supplier that produces the initial value of the sideEffect
   * @param reducer      a reducer to merge sideEffect mutations into a single result
   * @return a new traversal source with updated strategies
   */
  withSideEffect(key, initialValue, reducer) {
    // const clone = this.clone();
    // SideEffectStrategy.addSideEffect(clone.getStrategies(), key, initialValue, reducer);
    // clone.getBytecode().addSource(TraversalSource.Symbols.withSideEffect, key, initialValue, reducer);
    // return clone;
  },


  /**
   * Add a sack to be used throughout the life of a spawned {@link Traversal}.
   * This adds a {@link org.apache.tinkerpop.gremlin.process.traversal.strategy.decoration.SackStrategy} to the strategies.
   *
   * @param initialValue  a supplier that produces the initial value of the sideEffect
   * @param splitOperator the sack split operator
   * @param mergeOperator the sack merge operator
   * @return a new traversal source with updated strategies
   */
  withSack(initialValue, splitOperator, mergeOperator) {
    // const clone = this.clone();
    // clone.getStrategies().addStrategies(SackStrategy.build().initialValue(initialValue).splitOperator(splitOperator).mergeOperator(mergeOperator).create());
    // clone.getBytecode().addSource(TraversalSource.Symbols.withSack, initialValue, splitOperator, mergeOperator);
    // return clone;
  },


  getAnonymousTraversalClass() {
    // return Optional.empty();
  },

  clone() {
    console.log(this);
    throw new Error('Must be overloaded');
  },
};

export default TraversalSource;
