import { mixin, List } from '../../../util';

/**
 * ConnectiveP
 * @param predicates
 * @constructor
 */
function ConnectiveP(predicates) {

  this._predicates = predicates;
  if (this._predicates.size() < 2) {
    throw (`The provided ConnectiveP array must have at least two arguments: ${this._predicates.size()}`);
  }
}
ConnectiveP.prototype = {
  constructor: ConnectiveP,
  type: 'ConnectiveP',
  getPredicates() {
    return this._predicates;
  },

  getBiPredicate() {
    return null;
  },
  negate(p) {

    const negated = new List();
    for (let i = 0; i < this._predicates.size(); i++) {
      const predicate = this._predicates.getValue(i);
      negated.add(predicate.negate());
    }
    if (p) {
      p._predicates = negated;
      return p;
    } else {
      this._predicates = negated;
    }

    return this;
  },

  /**
   * Gets the current value to be passed to the predicate for testing.
   */
  getValue() {
    return this.value;
  },

  setValue(value) {
    this.value = value;
  },

  test(testValue) {
    //console.log('ConnectiveP', this.biPredicate, testValue, this.value)
    return this.biPredicate.test(testValue, this.value);
  },

  and(predicate) {
    if (!(predicate instanceof P))
      throw ("Only P predicates can be and'd together");
    return new AndP(new List(this, predicate));
  },

  or(predicate) {
    if (!(predicate instanceof P))
      throw ("Only P predicates can be or'd together");
    return new OrP(new List(this, predicate));
  },
  clone() {
    const clone = Object.assign(Object.create(this), this);
    clone.predicates = new List();
    for (let i = 0; i < this.predicates.size(); i++) {
      const p = this.predicates.get(i);
      clone.predicates.add(p.clone());
    }
    return clone;
  }
};

//mixin(ConnectiveP, P.prototype);

export default ConnectiveP;