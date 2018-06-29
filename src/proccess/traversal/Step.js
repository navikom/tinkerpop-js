import { List } from '../../util';

/**
 * A {@link Step} denotes a unit of computation within a {@link Traversal}.
 * A step takes an incoming object and yields an outgoing object.
 * Steps are chained together in a {@link Traversal} to yield a lazy function chain of computation.
 * <p/>
 * In the constructor of a Step, never store explicit sideEffect objects in {@link TraversalSideEffects}.
 * If a sideEffect needs to be registered with the {@link Traversal}, use SideEffects.registerSupplier().
 *
 * <S> The incoming object type of the step
 * <E> The outgoing object type of the step
 */
function Step() {

}

Step.prototype = {
  constructor: Step,
  getRequirements() {
    return new List();
  },

  reset() {
    console.log('Step reset', 'Must be overloaded');
  },
};

export default Step;
