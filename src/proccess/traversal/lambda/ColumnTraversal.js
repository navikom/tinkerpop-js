import { mixin } from '../../../util';
import AbstractLambdaTraversal from './AbstractLambdaTraversal';

/**
 * ColumnTraversal
 * @param column
 * @constructor
 */
function ColumnTraversal(column) {

	this.column = column;
}
ColumnTraversal.prototype = {
	constructor: ColumnTraversal,
	next() {
		return this.selection;
	},

	addStart(start) {
		this.selection = this.column.apply(start);
	},


	getColumn() {
		return this.column;
	}
};

mixin(ColumnTraversal, AbstractLambdaTraversal.prototype);

export default ColumnTraversal;
