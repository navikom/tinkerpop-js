import { mixin } from '../../../util';
import B_O_S_SE_SL_Traverser from './B_O_S_SE_SL_Traverser';
import ImmutablePath from '../step/util/ImmutablePath';
import { ReferenceFactory } from '../../../structure/util/reference';

/**
 * B_LP_O_P_S_SE_SL_Traverser
 * @param t
 * @param step
 * @param initialBulk
 * @constructor
 */
function B_LP_O_P_S_SE_SL_Traverser(t, step, initialBulk) {
	B_O_S_SE_SL_Traverser.call(this, t, step, initialBulk);

	this._path = ImmutablePath.make().extend(t, step.getLabels());
}

B_LP_O_P_S_SE_SL_Traverser.prototype = {
	constructor: B_LP_O_P_S_SE_SL_Traverser,
	path() {
		return this._path;
	},

	/////////////////

	detach() {
		B_O_S_SE_SL_Traverser.prototype.detach.call(this);
		this._path = ReferenceFactory.detach(this._path);
		return this;
	},

	/////////////////

	split(r, step) {
		const clone = B_O_S_SE_SL_Traverser.prototype.split.call(this, r, step);

		if (r) {
			clone._path = clone._path.clone().extend(r, step.getLabels());
		} else {
			clone._path = clone._path.clone();
		}

		return clone;
	},

	addLabels(labels) {
		this._path = this._path.extend(labels);
	},

	equals(object) {
		return (object instanceof B_LP_O_P_S_SE_SL_Traverser)
			&& object.t === this.t
			&& object.future === this.future
			&& object._loops === this._loops
			&& (this._sack === undefined || null === this._sack || null !== this._sideEffects.getSackMerger())
			&& object._path === this._path;
	}
};

mixin(B_LP_O_P_S_SE_SL_Traverser, B_O_S_SE_SL_Traverser.prototype);


export default B_LP_O_P_S_SE_SL_Traverser;
