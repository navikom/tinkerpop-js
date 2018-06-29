import { mixin, List, Map, ArrayUtils } from '../../../../util';
import TraversalParent from '../TraversalParent';
import ByModulating from '../../ByModulating';
import TraversalRing from '../../util/TraversalRing';
import { MapStep } from './../map/MapStep';
import TraversalUtil from '../../util/TraversalUtil';
import StringFactory from '../../../../structure/util/StringFactory';

/**
 * ProjectStep
 * @param traversal
 * @constructor
 */
function ProjectStep(traversal, projectKeys) {
	MapStep.call(this, traversal);
	this.projectKeys = new List(projectKeys);
	this.traversalRing = new TraversalRing();
}
ProjectStep.prototype = Object.create(MapStep.prototype);
ProjectStep.prototype.constructor = ProjectStep;

mixin(ProjectStep, TraversalParent.prototype, ByModulating.prototype);

ProjectStep.prototype.map = function(traverser) {
	const end = new Map();
	for (let i = 0; i < this.projectKeys.size(); i++) {
		const projectKey = this.projectKeys.get(i);
		end.put(projectKey, TraversalUtil.applyNullable(traverser, this.traversalRing.next()));
	}
	this.traversalRing.reset();
	return end;
};

ProjectStep.prototype.reset = function() {
	MapStep.prototype.reset.call(this);
	this.traversalRing.reset();
};

ProjectStep.prototype.toString = function() {
	return StringFactory.stepString(this, this.projectKeys, this.traversalRing);
};

ProjectStep.prototype.clone = function() {
	const clone = MapStep.prototype.clone();
	clone.traversalRing = this.traversalRing.clone();
	return clone;
};

ProjectStep.prototype.setTraversal = function(parentTraversal) {
	MapStep.prototype.setTraversal.call(this, parentTraversal);
	this.traversalRing.getTraversals().forEach((t) => this.integrateChild(t));
};

ProjectStep.prototype.getLocalChildren = function() {
	return this.traversalRing.getTraversals();
};

ProjectStep.prototype.modulateBy = function(selectTraversal) {
	this.traversalRing.addTraversal(this.integrateChild(selectTraversal));
};

ProjectStep.prototype.getProjectKeys = function() {
	return this.projectKeys;
};

ProjectStep.prototype.getRequirements = function() {
	return this.getSelfAndChildRequirements();
};

export { ProjectStep };

