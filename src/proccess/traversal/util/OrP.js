import { mixin, BiPredicate, List } from '../../../util';
import P from '../P';
import ConnectiveP from './ConnectiveP';
import AndP from './AndP';
import StringFactory from '../../../structure/util/StringFactory';

/**
 * OrP
 * @param predicates
 * @constructor
 */
function OrP (predicates) {

  ConnectiveP.call(this, predicates);

  this._predicates = new List();
  for (let i = 0; i < predicates.size(); i++) {
    this.or(predicates.getValue(i));
  }
  this.biPredicate = new OrBiPredicate(this);
}

OrP.prototype = {
  constructor: OrP,

  or(predicate) {
    if (!(predicate instanceof P))
      throw("Only P predicates can be or'd together");
    else if (predicate instanceof OrP)
      this._predicates.addAll(predicate.predicates());
    else
      this._predicates.add(predicate);
    return this;
  },

  negate() {
    ConnectiveP.prototype.negate.call(this);

    return new AndP(this._predicates);
  },
  clone() {
    const clone = ConnectiveP.prototype.clone.call(this);
    clone.biPredicate = new OrBiPredicate(clone);
    return clone;
  },
  toString() {
    return "or(" + StringFactory.removeEndBrackets(this._predicates) + ")";
  }
};

mixin(OrP, ConnectiveP.prototype);

class OrBiPredicate extends BiPredicate {
  constructor(orP) {
    super();
    this.orP = orP;
  }

  test(valueA, valueB) {
    for (let i = 0; i < this.orP._predicates.size(); i++) {
      const predicate = this.orP._predicates.getValue(i);
      if (predicate.test(valueA))
        return true;
    }
    return false;
  }
}

export default OrP;