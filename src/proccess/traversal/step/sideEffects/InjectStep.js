import { mixin, ArrayIterator, ArrayUtils} from '../../../../util';
import { StartStep } from './StartStep';

/**
 * InjectStep
 * @param traversal
 * @param injections
 * @constructor
 */
function InjectStep(traversal, ...injections) {
	StartStep.call(this, traversal)
	this.injections = ArrayUtils.checkArray(injections);
	this.start = new ArrayIterator(this.injections);
}
InjectStep.prototype = {
	constructor: InjectStep,


	clone() {
		const clone = StartStep.prototype.clone.call(this);
		clone.start = new ArrayIterator(clone.injections);
		return clone;
	},

	reset() {
		StartStep.prototype.reset();
		this.start = new ArrayIterator(this.injections);
	}
};

mixin(InjectStep, StartStep.prototype);

export { InjectStep };
