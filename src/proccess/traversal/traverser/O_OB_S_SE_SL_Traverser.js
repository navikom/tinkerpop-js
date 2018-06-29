import { mixin, List } from '../../../util';
import O_Traverser from './O_Traverser';

const HALT = 'HALT';

function O_OB_S_SE_SL_Traverser(t, step) {
	O_Traverser.call(this, t);

	this._sack = null;
	this._loops = 0;  // an optimization hack to use a short internally to save bits :)
	this._sideEffects = step.getTraversal().getSideEffects();
	this.future = HALT;
	this._bulk = 1;
	if (this._sideEffects.getSackInitialValue()) {
		this._sack = this._sideEffects.getSackInitialValue();
	}
}

O_OB_S_SE_SL_Traverser.prototype = {
	constructor: O_OB_S_SE_SL_Traverser,

	setBulk(count) {
		this._bulk = count > 0 ? 1 : 0;
	},

	bulk() {
		return this._bulk;
	},

	sack() {
		return this._sack;
	},

	setSack(object) {
		this._sack = object;
	},

	// ///////////////

	loops() {
		return this._loops;
	},

	incrLoops(stepLabel) {
		this._loops++;
	},

	resetLoops() {
		this._loops = 0;
	},

	// ///////////////

	getStepId() {
		return this.future;
	},

	setStepId(stepId) {
		this.future = stepId;
	},

	// ///////////////

	getSideEffects() {
		return this._sideEffects;
	},


	setSideEffects(sideEffects) {
		this._sideEffects = sideEffects;
	},

	// ///////////////

	split(r, step) {
		const clone = O_Traverser.split.call(this, r, step);
		clone._sack = !clone._sack ? null : !clone._sideEffects.getSackSplitter()
			? clone._sack : clone._sideEffects.getSackSplitter().apply(clone._sack);
		return clone;
	},


	merge(other) {
		O_Traverser.merge.call(this, other);
		if (this._sack && this._sideEffects.getSackMerger()) {
			this._sack = this._sideEffects.getSackMerger().apply(this._sack, other.sack());
		}
	},

	// ///////////////


	equals(object) {
		return object instanceof O_OB_S_SE_SL_Traverser
			&& object.t === this.t
			&& object.future === this.future
			&& object._loops === this._loops
			&& (!this._sack || (this._sideEffects && this._sideEffects.getSackMerger()));
	},

};

mixin(O_OB_S_SE_SL_Traverser, O_Traverser.prototype);

export default O_Traverser;
