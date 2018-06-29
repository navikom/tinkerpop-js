import { mixin, List, isNull } from '../../../util';
import B_O_S_SE_SL_Traverser from './B_O_S_SE_SL_Traverser';
import ImmutablePath from '../step/util/ImmutablePath';
import { ReferenceFactory } from '../../../structure/util/reference';

/**
 * B_LP_O_S_SE_SL_Traverser
 * @param t
 * @param step
 * @param initialBulk
 * @constructor
 */
function B_LP_O_S_SE_SL_Traverser(t, step, initialBulk) {
	B_O_S_SE_SL_Traverser.call(this, t, step, initialBulk);

	this._path = ImmutablePath.make();
	this._labels = step.getLabels();
	if (!this._labels.isEmpty()) this._path = this._path.extend(t, this._labels);

}

B_LP_O_S_SE_SL_Traverser.prototype = {
	constructor: B_LP_O_S_SE_SL_Traverser,

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
		clone._path = clone._path.clone();
		if(step){
			const labels = step.getLabels();
			if (!labels.isEmpty()) clone._path = clone._path.extend(r, labels);
		}
		return clone;
	},

	addLabels(labels) {
		if (!labels.isEmpty()) {
			this._path = this._path.isEmpty() || this.t !== this._path.head() ?
				this._path.extend(this.t, labels) :
				this._path.extend(labels);


		}
	},

	keepLabels(labels) {
		const retractLabels = new List();
		for (let i = 0; i < this._path.labels().size(); i++) {
			const stepLabels = this._path.labels().get(i);
			for (let j = 0; j < stepLabels.size(); j++) {
				const label = stepLabels.get(j);
				if (!labels.contains(label))
					retractLabels.add(label);
			}
		}
		this._path = this._path.retract(retractLabels);
	},

	dropLabels(labels) {
		if (!labels.isEmpty())
			this._path = this._path.retract(labels);
	},

	dropPath() {
		this.path = ImmutablePath.make();
	},

	equals(object) {
		return (object instanceof B_LP_O_S_SE_SL_Traverser)
			&& object.t === this.t
			&& object.future === this.future
			&& object._loops === this._loops
			&& (isNull(this._sack) || !isNull(this._sideEffects.getSackMerger()))
			&& object._path === this._path;
	}
};

mixin(B_LP_O_S_SE_SL_Traverser, B_O_S_SE_SL_Traverser.prototype);


export default B_LP_O_S_SE_SL_Traverser;