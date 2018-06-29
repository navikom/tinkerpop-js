import { mixin, ArrayIterator, isNull } from '../../../../util';
import AbstractStep from './../util/AbstractStep';

/**
 * StartStep
 * @param traversal
 * @param start
 * @constructor
 */
function StartStep(traversal, start) {
	AbstractStep.call(this, traversal);

	this.first = true;
	this.start = start;

}
StartStep.prototype = {
	constructor: StartStep,

	getStart() {
		return this.start;
	},


	processNextStart() {
		if (this.first) {
			if (!isNull(this.start)) {
				if (this.start instanceof ArrayIterator)
					this.starts.add(this.getTraversal().getTraverserGenerator().generateIterator(this.start, this, 1));
				else
					this.starts.add(this.getTraversal().getTraverserGenerator().generate(this.start, this, 1));
			}
			this.first = false;
		}
		return this.starts.next();
	},

};

mixin(StartStep, AbstractStep.prototype);

StartStep.isVariableStartStep = (step) => {
	return step instanceof StartStep && !step.start && step.labels.size() === 1;
};

export { StartStep };

