import { mixin, isNull } from '../../../util';
import B_O_Traverser from './B_O_Traverser';

/**
 * B_O_S_SE_SL_Traverser
 * @param t
 * @param step
 * @param initialBulk
 * @constructor
 */
function B_O_S_SE_SL_Traverser(t, step, initialBulk) {
	B_O_Traverser.call(this, t, initialBulk);

	this._sack = null;
	this._loops = 0;  // an optimization hack to use a short internally to save bits :)
	this._sideEffects = step.getTraversal().getSideEffects();
	if (null !== this._sideEffects.getSackInitialValue())
		this._sack = this._sideEffects.getSackInitialValue().get();
}

B_O_S_SE_SL_Traverser.prototype = Object.create(B_O_Traverser.prototype);
B_O_S_SE_SL_Traverser.prototype.constructor = B_O_S_SE_SL_Traverser;

B_O_S_SE_SL_Traverser.prototype.sack = function(object) {
	if (object) this._sack = object;
	return this._sack;
};

/////////////////

B_O_S_SE_SL_Traverser.prototype.loops = function() {
	return this._loops;
};

B_O_S_SE_SL_Traverser.prototype.incrLoops = function(stepLabel) {
	this._loops++;
};

B_O_S_SE_SL_Traverser.prototype.resetLoops = function() {
	this._loops = 0;
};

/////////////////

B_O_S_SE_SL_Traverser.prototype.getSideEffects = function() {
	return this._sideEffects;
};


B_O_S_SE_SL_Traverser.prototype.setSideEffects = function(sideEffects) {
	this._sideEffects = sideEffects;
};

/////////////////

B_O_S_SE_SL_Traverser.prototype.split = function(r, step) {
	const clone = B_O_Traverser.prototype.split.call(this, r, step);
	clone._sack = isNull(clone._sack) ? null
		: isNull(clone._sideEffects.getSackSplitter())
		? clone._sack : clone._sideEffects.getSackSplitter().apply(clone._sack);
	return clone;
};

B_O_S_SE_SL_Traverser.prototype.merge = function(other) {
	B_O_Traverser.prototype.merge.call(this, other);
	if (!isNull(this._sack) && !isNull(this._sideEffects.getSackMerger()))
		this._sack = this._sideEffects.getSackMerger().apply(this._sack, other.sack());

};

B_O_S_SE_SL_Traverser.prototype.equals = function(object) {
	return (object instanceof B_O_S_SE_SL_Traverser)
		&& object.t === this.t
		&& object.future === this.future
		&& object._loops === this._loops
		&& (isNull(this._sack) || !isNull(this._sideEffects.getSackMerger()))
};

export default B_O_S_SE_SL_Traverser;