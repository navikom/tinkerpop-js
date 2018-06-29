import { map } from './dsl/graph';
import Order from './Order';
import ElementValueTraversal from './lambda/ElementValueTraversal';
import TokenTraversal from './lambda/TokenTraversal';
import FunctionTraverser from './lambda/FunctionTraverser';
import IdentityTraversal from './lambda/IdentityTraversal';
import ColumnTraversal from './lambda/ColumnTraversal';
import T from '../../structure/T';
import Column from '../../structure/Column';

/**
 * ByModulating
 * @constructor
 */
function ByModulating() {

}

ByModulating.prototype = {
	constructor: ByModulating,

	modulateBy(first, second) {
		if (arguments.length === 0) {
			this.modulateBy(new IdentityTraversal());
		} else if (arguments.length === 1) {
			if (typeof first === 'string') {
				this.modulateBy(new ElementValueTraversal(first));
			} else if (T.contains(first)) {
				this.modulateBy(new TokenTraversal(first));
			} else if (first.compare) {
				this.modulateBy(new IdentityTraversal(), first);
			} else if (Order.contains(first)) {
				this.modulateBy(new IdentityTraversal(), first);
			} else if (first.asAdmin) {
				this.modulateBy(first);
			} else {
				this.modulateBy(map(new FunctionTraverser(first)).asAdmin());
			}
		} else {

			if (typeof first === 'string' && second.compare) {
				this.modulateBy(new ElementValueTraversal(first), second);
			} else if (T.contains(first) && second.compare) {
				this.modulateBy(new TokenTraversal(first), second);
			} else if (Column.has(first) && second.compare) {
				this.modulateBy(new ColumnTraversal(first), second);
			} else if (first.V && second.compare) {
				this.modulateBy(first, second);
			} else if (first.asAdmin) {
				this.modulateBy(first, second);
			} else {

				this.modulateBy(map(new FunctionTraverser(first)).asAdmin(), second);
			}
		}
	},

};

export default ByModulating;