import { mixin, List } from '../../../util';
import B_O_S_SE_SL_Traverser from './B_O_S_SE_SL_Traverser';
import ImmutablePath from '../step/util/ImmutablePath';
import { ReferenceFactory } from '../../../structure/util/reference';

/**
 * LP_O_OB_P_S_SE_SL_Traverser
 * @param t
 * @param step
 * @constructor
 */
function LP_O_OB_P_S_SE_SL_Traverser(t, step) {
	B_O_S_SE_SL_Traverser.call(this, t, step);

	this._path = ImmutablePath.make().extend(t, step.getLabels());
}

LP_O_OB_P_S_SE_SL_Traverser.prototype = {
	constructor: LP_O_OB_P_S_SE_SL_Traverser,

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
			clone.path = clone.path.clone().extend(r, step.getLabels());
		} else {
			clone.path = clone.path.clone();
		}

		return clone;
	},

	addLabels(labels) {
		if (!labels.isEmpty())
			this._path = this._path.extend(labels);
	},

	keepLabels(labels) {
		const retractLabels = new List();
		for (let i = 0; i < this._path.labels().size(); i++) {
			const stepLabels = this._path.labels().get(i);
			for (let j = 0; j < stepLabels.size(); j++) {
				const l = stepLabels.get(j);
				if (!labels.contains(l))
					retractLabels.add(l);
			}
		}
		this._path = this._path.retract(retractLabels);
	},

	dropLabels(labels) {
		if (!labels.isEmpty())
			this._path = this._path.retract(labels);
	},

	dropPath() {
		this._path = ImmutablePath.make();
	},

	equals(object) {
		return (object instanceof LP_O_OB_P_S_SE_SL_Traverser)
			&& object.t === this.t
			&& object.future === this.future
			&& object._loops === this._loops
			&& (this._sack === undefined || null === this._sack || null !== this._sideEffects.getSackMerger())
			&& object._path === this._path;
	}
};

mixin(LP_O_OB_P_S_SE_SL_Traverser, B_O_S_SE_SL_Traverser.prototype);


export default LP_O_OB_P_S_SE_SL_Traverser;
