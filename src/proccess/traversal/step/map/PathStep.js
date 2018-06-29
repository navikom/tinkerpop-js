import { mixin, ArrayUtils, List, Map } from '../../../../util';
import { MapStep } from './MapStep';
import TraversalParent from '../TraversalParent';
import TraversalUtil from '../../util/TraversalUtil';
import ByModulating from '../../ByModulating';
import PathProcessor from '../../step/PathProcessor';
import TraversalRing from '../../util/TraversalRing';
import MutablePath from '../util/MutablePath';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * PathStep
 * @param traversal
 * @constructor
 */
function PathStep(traversal) {
	MapStep.call(this, traversal);
	this.traversalRing = new TraversalRing();
}
PathStep.prototype = {
	constructor: PathStep,
	map(traverser) {
		let path;
		if (this.traversalRing.isEmpty())
			path = traverser.path();
		else {
			path = MutablePath.make();
			traverser.path()
				.forEach((object, labels) => path.extend(TraversalUtil.applyNullable(object, this.traversalRing.next()), labels));
		}
		this.traversalRing.reset();
		return path;
	},

	clone() {
		const clone = MapStep.prototype.clone.call(this);
		clone.traversalRing = this.traversalRing.clone();
		return clone;
	},

	setTraversal(parentTraversal) {
		MapStep.prototype.setTraversal.call(this, parentTraversal);
		this.traversalRing.getTraversals().forEach((traversal) => this.integrateChild(traversal));
	},


	reset() {
		MapStep.prototype.reset.call(this);
		this.traversalRing.reset();
	},

	getLocalChildren() {
		return this.traversalRing.getTraversals();
	},

	modulateBy(pathTraversal) {
		this.traversalRing.addTraversal(this.integrateChild(pathTraversal));
	},

	getRequirements() {
		return this.getSelfAndChildRequirements(TraverserRequirement.PATH);
	},

	setKeepLabels(labels) {
		this.keepLabels = labels;
	},

	processNextStart() {
		return PathProcessor.processTraverserPathLabels(MapStep.prototype.processNextStart.call(this), this.keepLabels);
	},

	getKeepLabels() {
		return this.keepLabels;
	}
};

mixin(PathStep,
	MapStep.prototype,
	TraversalParent.prototype,
	PathProcessor.prototype,
	ByModulating.prototype
);

export { PathStep };
