
/**
 * A {@code Traverser} represents the current state of an object flowing through a {@link Traversal}.
 * A traverser maintains a reference to the current object, a traverser-local "sack", a traversal-global sideEffect,
 * a bulk count, and a path history.
 * <p/>
 * Different types of traversers can exist depending on the semantics of the traversal and the desire for
 * space/time optimizations of the developer.
 *
 * @constructor
 */
function Traverser() {
}

Traverser.prototype = {
  constructor: Traverser,
  /**
   * Get the object that the traverser is current at.
   *
   * @return The current object of the traverser
   */
  getValue() {
    console.log('Traverser', this);
    throw new Error('Must be overloaded');
  },

  /**
   * Get the sack local sack object of this traverser.
   *
   * @param <S> the type of the sack object
   * @return the sack object
   */
  sack() {
    throw new Error('Must be overloaded');
  },


  /**
   * Get the current path of the traverser.
   *
   * @return The path of the traverser
   */
  path() {
    return undefined;
  },

  /**
   * Return the number of times the traverser has gone through a looping section of a traversal.
   *
   * @return The number of times the traverser has gone through a loop
   */
  loops() {
    throw new Error('Must be overloaded');
  },

  /**
   * A traverser may represent a grouping of traversers to allow for more efficient data propagation.
   *
   * @return the number of traversers represented in this traverser.
   */
  bulk() {
    throw new Error('Must be overloaded');
  },

  /**
   * Get a particular value from the side-effects of the traverser (thus, traversal).
   *
   * @param sideEffectKey the key of the value to get from the sideEffects
   * @param sideEffectValue the value to set for the sideEffect key
   * @return the object in the sideEffects of the respective key
   */
  sideEffects(sideEffectKey, sideEffectValue) {
    if (sideEffectValue) {
      this.asAdmin().getSideEffects().add(sideEffectKey, sideEffectValue);
    } else {
      return this.asAdmin().getSideEffects().get(sideEffectKey);
    }
  },

  setSideEffects(sideEffects){
    this._sideEffects = sideEffects;
  },

  /**
   * If the underlying object of the traverser is comparable, compare it with the other traverser.
   *
   * @param other the other traverser that presumably has a comparable internal object
   * @return the comparison of the two objects of the traversers
   * @throws ClassCastException if the object of the traverser is not comparable
   */
  compareTo(other) {
    return this.getValue().compareTo(other.getValue());
  },

  /**
   * Typecast the traverser to a "system traverser" so {@link Traverser.Admin} methods can be accessed.
   * This is used as a helper method to avoid the awkwardness of <code>((Traverser.Administrative)traverser)</code>.
   * The default implementation simply returns "this" type casted to {@link Traverser.Admin}.
   *
   * @return The type-casted traverser
   */
  asAdmin() {
    return this;
  },

  /**
   * Traverser cloning is important when splitting a traverser at a bifurcation point in a traversal.
   */
  clone() {
    throw new Error('Must be overloaded');
  },
};

export default Traverser;
