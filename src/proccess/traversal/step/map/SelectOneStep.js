import { mixin, List, Map, ArrayUtils, isNull } from '../../../../util';
import TraversalParent from '../TraversalParent';
import Scoping from '../Scoping';
import ByModulating from '../../ByModulating';
import PathProcessor from '../../step/PathProcessor';
import TraversalRing from '../../util/TraversalRing';
import { MapStep } from './../map/MapStep';
import { MatchStep } from './../map/MatchStep';
import TraversalUtil from '../../util/TraversalUtil';
import TraversalHelper from '../../util/TraversalHelper';
import StringFactory from '../../../../structure/util/StringFactory';

/**
 * SelectOneStep
 * @param traversal
 * @param pop
 * @param selectKey
 * @constructor
 */
function SelectOneStep(traversal, pop, selectKey) {
	MapStep.call(this, traversal);
	this.selectTraversal = null;
	this.pop = pop;
	this.selectKey = selectKey;
}

SelectOneStep.prototype = Object.create(MapStep.prototype);
SelectOneStep.prototype.constructor = SelectOneStep;

mixin(SelectOneStep, Scoping.prototype,
	TraversalParent.prototype, PathProcessor.prototype, ByModulating.prototype);

SelectOneStep.prototype.map = function(traverser) {
	const end = this.getNullableScopeValue(this.pop, this.selectKey, traverser);
	return !isNull(end) ? TraversalUtil.applyNullable(end, this.selectTraversal) : null;
};

SelectOneStep.prototype.clone = function() {
	const clone = MapStep.prototype.clone.call(this);
	if (!isNull(this.selectTraversal))
		clone.selectTraversal = this.selectTraversal.clone();
	return clone;
};

SelectOneStep.prototype.setTraversal = function(parentTraversal) {
	MapStep.prototype.setTraversal.call(this, parentTraversal);
	this.integrateChild(this.selectTraversal);
};

SelectOneStep.prototype.getLocalChildren = function() {
	return isNull(this.selectTraversal) ? new List() : new List([this.selectTraversal]);
};

SelectOneStep.prototype.removeLocalChild = function(traversal) {
	if (this.selectTraversal === traversal)
		this.selectTraversal = null;
};

SelectOneStep.prototype.modulateBy = function(selectTraversal) {
	this.selectTraversal = this.integrateChild(selectTraversal);
};

SelectOneStep.prototype.getRequirements = function() {
	return this.getSelfAndChildRequirements(
		TraversalHelper.getLabels(TraversalHelper.getRootTraversal(this.traversal)).contains(this.selectKey) ?
			Scoping.TYPICAL_GLOBAL_REQUIREMENTS_ARRAY :
			Scoping.TYPICAL_LOCAL_REQUIREMENTS_ARRAY);
};

SelectOneStep.prototype.getScopeKeys = function() {
	return new List([this.selectKey]);
};

SelectOneStep.prototype.getPop = function() {
	return this.pop;
};

SelectOneStep.prototype.setKeepLabels = function(labels) {
	this.keepLabels = labels;
};

SelectOneStep.prototype.getKeepLabels = function() {
	return this.keepLabels;
};

SelectOneStep.prototype.processNextStart = function() {
	const traverser = MapStep.prototype.processNextStart.call(this);
	if (!(this.getTraversal().getParent() instanceof MatchStep)) {
		PathProcessor.processTraverserPathLabels(traverser, this.keepLabels);
	}
	return traverser;
};

SelectOneStep.prototype.toString = function() {
	return StringFactory.stepString(this, this.pop, this.selectKey, this.selectTraversal);
};

export { SelectOneStep };

