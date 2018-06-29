import { mixin } from '../../../../util';
import { FilterStep } from './FilterStep';

/**
 *
 * @param traversal
 * @param classFilter
 * @param allowClasses
 * @constructor
 */
function ClassFilterStep(traversal, classFilter, allowClasses) {
	FilterStep.call(this, traversal);
	this.classFilter = classFilter;
	this.allowClasses = allowClasses;
}

ClassFilterStep.prototype = {
	constructor: ClassFilterStep,
	filter(traverser) {
		return this.allowClasses == this.classFilter.isInstance(traverser.get());
	}
};

mixin(ClassFilterStep, FilterStep.prototype);

export { ClassFilterStep };
