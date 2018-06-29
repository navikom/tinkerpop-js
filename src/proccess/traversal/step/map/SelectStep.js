import { mixin, List, Map, ArrayUtils, isNull } from '../../../../util';
import TraversalParent from '../TraversalParent';
import Scoping from '../Scoping';
import ByModulating from '../../ByModulating';
import PathProcessor from '../../step/PathProcessor';
import TraversalRing from '../../util/TraversalRing';
import { MapStep } from './../map/MapStep';
import TraversalUtil from '../../util/TraversalUtil';
import TraversalHelper from '../../util/TraversalHelper';

/**
 * SelectStep
 * @param traversal
 * @param pop
 * @param selectKeys
 * @constructor
 */
function SelectStep(traversal, pop, selectKeys) {
	MapStep.call(this, traversal);
	this.traversalRing = new TraversalRing();
	this.pop = pop;
	this.selectKeys = ArrayUtils.checkArray(selectKeys);
	this.selectKeysSet = new List(this.selectKeys);
	if (this.selectKeys.length < 2)
		throw ("At least two select keys must be provided: " + this.constructor.name);

}
SelectStep.prototype = {
	constructor: SelectStep,
	map(traverser) {
		const bindings = new Map();
		for (let i = 0; i < this.selectKeys.length; i++) {
			const selectKey = this.selectKeys[i];
			const end = this.getNullableScopeValue(this.pop, selectKey, traverser);
			if (!isNull(end))
				bindings.put(selectKey, TraversalUtil.applyNullable(end, this.traversalRing.next()));
			else {
				this.traversalRing.reset();
				return null;
			}
		}
		this.traversalRing.reset();
		//console.log('map', traverser, traverser.get(), bindings)
		return bindings;
	},

	reset() {
		MapStep.prototype.reset.call(this);
		this.traversalRing.reset();
	},

	clone() {
		const clone = MapStep.prototype.clone.call(this);
		clone.traversalRing = this.traversalRing.clone();
		return clone;
	},

	setTraversal(parentTraversal) {
		MapStep.prototype.setTraversal.call(this, parentTraversal);
		this.traversalRing.getTraversals().forEach((t) => this.integrateChild(t));
	},

	getLocalChildren() {
		return this.traversalRing.getTraversals();
	},

	modulateBy(selectTraversal) {
		this.traversalRing.addTraversal(this.integrateChild(selectTraversal));
	},

	getRequirements() {
		return this.getSelfAndChildRequirements(
			TraversalHelper.getLabels(
				TraversalHelper.getRootTraversal(this.traversal)).iterator()
				.filter((entry) => this.selectKeys.includes(entry.getValue())).size() > 0 ?
				Scoping.TYPICAL_GLOBAL_REQUIREMENTS_ARRAY :
				Scoping.TYPICAL_LOCAL_REQUIREMENTS_ARRAY);
	},

	getScopeKeys() {
		return this.selectKeysSet;
	},

	getByTraversals() {
		const map = new Map();
		this.traversalRing.reset();
		for (let i = 0; i < this.selectKeys.length; i++) {
			map.put(this.selectKeys[i], this.traversalRing.next());
		}
		return map;
	},

	getPop() {
		return this.pop;
	},

	setKeepLabels(labels) {
		this.keepLabels = labels;
	},

	getKeepLabels() {
		return this.keepLabels;
	},

	processNextStart() {
		return PathProcessor.processTraverserPathLabels(MapStep.prototype.processNextStart.call(this), this.keepLabels);
	}
};

mixin(SelectStep, MapStep.prototype, Scoping.prototype,
	TraversalParent.prototype, PathProcessor.prototype, ByModulating.prototype);

export { SelectStep };
