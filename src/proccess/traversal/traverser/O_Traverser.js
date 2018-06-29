import { List } from '../../../util';
import AbstractTraverser from './util/AbstractTraverser';

/**
 * O_Traverser
 * @param t
 * @constructor
 */
function O_Traverser(t) {
	AbstractTraverser.call(this, t);
}

O_Traverser.prototype = Object.create(AbstractTraverser.prototype);
O_Traverser.prototype.constructor = O_Traverser;

O_Traverser.prototype.getTags = function() {
	if (!this.tags) this.tags = new List();
	return this.tags;
};

O_Traverser.prototype.split = function(r, step) {
	const clone = AbstractTraverser.prototype.split.call(this, r, step);

	if (this.tags) {
		clone.tags = this.tags.clone();
	}
	return clone;
};

O_Traverser.prototype.merge = function(other) {
	if (!other.getTags().isEmpty()) {
		if (!this.tags) this.tags = new List();
		this.tags.addAll(other.getTags());
	}
};

export default O_Traverser;
