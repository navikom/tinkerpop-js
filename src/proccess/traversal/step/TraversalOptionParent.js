import TraversalParent from './TraversalParent';

/**
 * TraversalOptionParent
 * @constructor
 */
function TraversalOptionParent() {
	TraversalParent.call(this);
}

TraversalOptionParent.prototype = Object.create(TraversalParent.prototype);
TraversalOptionParent.prototype.constructor = TraversalOptionParent;

TraversalOptionParent.Pick = {
	any: 'any',
	none: 'none'
};

export default TraversalOptionParent;

const any = TraversalOptionParent.Pick.any;
const none = TraversalOptionParent.Pick.none;
export { any, none}