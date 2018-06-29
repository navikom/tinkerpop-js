import AbstractStep from '../util/AbstractStep';
import { Collections } from '../../../../util';

/**
 * FlatMapStep
 * @param traversal
 * @constructor
 */
function FlatMapStep(traversal) {
	AbstractStep.call(this, traversal);

	this.head = null;
	this.iterator = Collections.emptyIterator();
}

FlatMapStep.prototype = Object.create(AbstractStep.prototype);
FlatMapStep.prototype.constructor = FlatMapStep;


FlatMapStep.prototype.flatMapType = 'FlatMapStep';
FlatMapStep.prototype.processNextStart = function() {
	while (!this.iterator.hasNext()) {
		this.head = this.starts.next();
		//console.log('processNextStart', this.head)
		this.iterator = this.flatMap(this.head);
	}

	const split = this.head.split(this.iterator.next(), this);
	return split;

};

FlatMapStep.prototype.flatMap = function(traverser) {
	throw new Error('Must be overloaded');
};

FlatMapStep.prototype.reset = function() {
	AbstractStep.prototype.reset.call(this);
	this.iterator = Collections.emptyIterator();

};

export { FlatMapStep };
