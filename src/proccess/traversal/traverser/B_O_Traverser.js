import O_Traverser from './O_Traverser';

const HALT = 'HALT';

/**
 * B_O_Traverser
 * @param t
 * @param step
 * @constructor
 */
function B_O_Traverser(t, initialBulk) {
	O_Traverser.call(this, t);

	this.future = HALT;
	this._bulk = initialBulk;
}

B_O_Traverser.prototype = Object.create(O_Traverser.prototype);
B_O_Traverser.prototype.constructor = B_O_Traverser;

B_O_Traverser.prototype.setBulk = function(count) {
	this._bulk = count;
};

B_O_Traverser.prototype.bulk = function() {
	return this._bulk;
};

B_O_Traverser.prototype.merge = function(other) {
	O_Traverser.prototype.merge.call(this, other);
	this._bulk = this._bulk + other.bulk();
};

B_O_Traverser.prototype.getStepId = function() {
	return this.future;
};

B_O_Traverser.prototype.setStepId = function(stepId) {
	this.future = stepId;
};

B_O_Traverser.prototype.equals = function(object) {
	return object instanceof B_O_Traverser &&
		object.t === this.t && object.future === this.future;
};

export default B_O_Traverser;
