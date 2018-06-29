import { mixin, List } from '../../../util';
import O_OB_S_SE_SL_Traverser from './O_OB_S_SE_SL_Traverser';
import { ReferenceFactory } from '../../../structure/util/reference';
import ImmutablePath from '../step/util/ImmutablePath';

const HALT = 'HALT';

/**
 *
 * @param t
 * @param step
 * @constructor
 */
function LP_O_OB_S_SE_SL_Traverser(t, step) {
  O_OB_S_SE_SL_Traverser.call(this, t, step);

  this._path = ImmutablePath.make();
  const labels = step.getLabels();
  if (!labels.isEmpty()) this._path = this._path.extend(t, labels);
}

LP_O_OB_S_SE_SL_Traverser.prototype = {
  constructor: LP_O_OB_S_SE_SL_Traverser,

  path() {
    return this._path;
  },

  // ///////////////

  detach() {
    O_OB_S_SE_SL_Traverser.detach.call(this);
    this._path = ReferenceFactory.detach(this._path);
    return this;
  },

// ///////////////

  split(r, step) {
    const clone = LP_O_OB_S_SE_SL_Traverser.split.call(this, r, step);
    clone._path = clone._path.clone();
    const labels = step.getLabels();
    if (!labels.isEmpty()) clone._path = clone._path.extend(r, labels);
    return clone;
  },

  addLabels(labels) {
    if (!labels.isEmpty()) {
      this._path = this._path.isEmpty() || !this.t === this._path.head() ?
        this._path.extend(this.t, labels) :
        this._path.extend(labels);
    }
  },


// ///////////////


  equals(object) {
    return object instanceof LP_O_OB_S_SE_SL_Traverser
      && object.t === this.t
      && object.future === this.future
      && object._loops === this._loops
      && (!this._sack || (this._sideEffects && this._sideEffects.getSackMerger()));
  },

};

mixin(LP_O_OB_S_SE_SL_Traverser, O_OB_S_SE_SL_Traverser.prototype);

export default LP_O_OB_S_SE_SL_Traverser;
