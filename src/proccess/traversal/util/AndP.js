import { mixin, BiPredicate, List } from '../../../util';
import P from '../P';
import ConnectiveP from './ConnectiveP';
import OrP from './OrP';
import StringFactory from '../../../structure/util/StringFactory';

/**
 * AndP
 * @param predicates
 * @constructor
 */
function AndP(predicates) {

  ConnectiveP.call(this, predicates);
  this._predicates = new List();
  for (let i = 0; i < predicates.size(); i++) {
    this.and(predicates.getValue(i));
  }
  this.biPredicate = new AndBiPredicate(this);
}

AndP.prototype = {
  constructor: AndP,
  and(predicate) {
    //console.log(predicate)
    if (!(predicate instanceof P))
      throw ("Only P predicates can be and'd together");
    else if (predicate instanceof AndP)
      this._predicates.addAll(predicate.getPredicates());
    else
      this._predicates.add(predicate);
    return this;
  },

  negate() {
    ConnectiveP.prototype.negate.call(this);
    return new OrP(this._predicates);
  },
  clone() {
    const clone = ConnectiveP.prototype.clone.call(this);
    clone.biPredicate = new AndBiPredicate(clone);
    return clone;
  },
  toString() {
    return "and(" + StringFactory.removeEndBrackets(this._predicates) + ")";
  }
};

class AndBiPredicate extends BiPredicate {
  constructor(andP) {
    super()
    this.andP = andP;
  }

  test(valueA, valueB) {
    for (let i = 0; i < this.andP._predicates.size(); i++) {
      const predicate = this.andP._predicates.getValue(i);

      if (!predicate.test(valueA))
        return false;
    }
    return true;
  }
}

mixin(AndP, ConnectiveP.prototype);

AndP.TYPE = 'AndP';

export default AndP;