import { mixin } from '../../../util';
import AbstractLambdaTraversal from './AbstractLambdaTraversal';

/**
 * TrueTraversal
 * @constructor
 */
function TrueTraversal() {
}
TrueTraversal.prototype = {
	constructor: TrueTraversal,

	clone() {
		return TrueTraversal.instance();
	}
};

mixin(TrueTraversal, AbstractLambdaTraversal.prototype);

const INSTANCE = new TrueTraversal();

TrueTraversal.instance = () => INSTANCE;

export default TrueTraversal;
