import { v4 } from 'uuid';
import { mixin } from '../../../util';
import Traverser from '../Traverser';

/**
 * ProjectedTraverser
 * @param baseTraverser
 * @param projections
 * @constructor
 */
function ProjectedTraverser(baseTraverser, projections) {
	this.baseTraverser = baseTraverser;
	this.projections = projections;
	this.uuid = v4();
}

ProjectedTraverser.prototype = {
	constructor: ProjectedTraverser,

	getProjections() {
		return this.projections;
	},

	merge(other) {
		this.baseTraverser.merge(other);
	},

	split(r, step) {
		return new ProjectedTraverser(this.baseTraverser.split(r, step), this.projections);
	},

	addLabels(labels) {
		this.baseTraverser.addLabels(labels);
	},

	keepLabels(labels) {
		this.baseTraverser.keepLabels(labels);
	},

	dropLabels(labels) {
		this.baseTraverser.dropLabels(labels);
	},

	dropPath() {
		this.baseTraverser.dropPath();
	},

	set(t) {
		this.baseTraverser.set(t);
	},

	incrLoops(stepLabel) {
		this.baseTraverser.incrLoops(stepLabel);
	},

	resetLoops() {
		this.baseTraverser.resetLoops();
	},

	getStepId() {
		return this.baseTraverser.getStepId();
	},

	setStepId(stepId) {
		this.baseTraverser.setStepId(stepId);
	},

	setBulk(count) {
		this.baseTraverser.setBulk(count);
	},

	detach() {
		this.baseTraverser = this.baseTraverser.detach();
		return this;
	},

	attach(method) {
		return this.baseTraverser.attach(method);
	},

	setSideEffects(sideEffects) {
		this.baseTraverser.setSideEffects(sideEffects);
	},

	getSideEffects() {
		return this.baseTraverser.getSideEffects();
	},

	getTags() {
		return this.baseTraverser.getTags();
	},

	get() {
		return this.baseTraverser.get();
	},

	sack(object) {
		this.baseTraverser.sack(object);
	},

	path() {
		return this.baseTraverser.path();
	},

	loops() {
		return this.baseTraverser.loops();
	},

	bulk() {
		return this.baseTraverser.bulk();
	},

	clone() {
		const clone = Object.assign(Object.create(this), this);
		clone.baseTraverser = this.baseTraverser.clone();
		return clone;
	}
};

mixin(ProjectedTraverser, Traverser.prototype);

ProjectedTraverser.tryUnwrap = (traverser) => {
	return traverser instanceof ProjectedTraverser ? traverser.baseTraverser : traverser;
};

export default ProjectedTraverser;
