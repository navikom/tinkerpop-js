/**
 * A {@link Traversal} can maintain global sideEffects.
 * Unlike {@link Traverser} "sacks" which are local sideEffects,
 * TraversalSideEffects are accessible by all {@link Traverser}
 * instances within the {@link Traversal}.
 *
 * @constructor
 */
function TraversalSideEffects() {

}

TraversalSideEffects.prototype = {
  constructor: TraversalSideEffects,
  exists(key) {
    return this.keys().contains(key);
  },
  isEmpty() {
    return this.keys().size() == 0;
  },
};

export default TraversalSideEffects;
