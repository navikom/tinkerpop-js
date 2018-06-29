import { mixin, List, Optional, isNull } from '../../../util';
import Traversal from '../Traversal2';
import Bytecode from '../Bytecode';
import B_O_TraverserGenerator from '../traverser/B_O_TraverserGenerator';
import EmptyTraversalSideEffects from '../util/EmptyTraversalSideEffects';
import EmptyTraversalStrategies from '../util/EmptyTraversalStrategies';
import { EmptyStep } from '../step/util/EmptyStep';
import TraverserRequirement from '../traverser/TraverserRequirement';

const REQUIREMENTS = new List([TraverserRequirement.OBJECT]);
/**
 * AbstractLambdaTraversal
 * @param bypassTraversal
 * @constructor
 */
function AbstractLambdaTraversal(bypassTraversal) {
	this.bypassTraversal = bypassTraversal;
}
AbstractLambdaTraversal.prototype = {
	constructor: AbstractLambdaTraversal,
	setBypassTraversal(bypassTraversal) {
		this.bypassTraversal = bypassTraversal;
	},

	getSteps() {
		return isNull(this.bypassTraversal) ? new List() : this.bypassTraversal.getSteps();
	},

	getBytecode() {
		return isNull(this.bypassTraversal) ? new Bytecode() : this.bypassTraversal.getBytecode();
	},

	addStep(step, index) {
		return isNull(this.bypassTraversal) ? this : this.bypassTraversal.addStep(index, step);
	},

	removeStep(index) {
		return isNull(this.bypassTraversal) ? this : this.bypassTraversal.removeStep(index);
	},

	applyStrategies() {
		if (!isNull(this.bypassTraversal))
			this.bypassTraversal.applyStrategies();
	},

	getTraverserGenerator() {
		return isNull(this.bypassTraversal) ? B_O_TraverserGenerator.instance() : this.bypassTraversal.getTraverserGenerator();
	},

	setSideEffects(sideEffects) {
		if (!isNull(this.bypassTraversal))
			this.bypassTraversal.setSideEffects(sideEffects);
	},

	getSideEffects() {
		return isNull(this.bypassTraversal) ? EmptyTraversalSideEffects.instance() : this.bypassTraversal.getSideEffects();
	},

	setStrategies(strategies) {
		if (!isNull(this.bypassTraversal))
			this.bypassTraversal.setStrategies(strategies);
	},

	getStrategies() {
		return isNull(this.bypassTraversal) ? EmptyTraversalStrategies.instance() : this.bypassTraversal.getStrategies();
	},

	setParent(step) {
		if (!isNull(this.bypassTraversal)) {
			this.bypassTraversal.setParent(step);
			step.integrateChild(this.bypassTraversal);
		}
	},

	getParent() {
		return isNull(this.bypassTraversal) ? EmptyStep.instance() : this.bypassTraversal.getParent();
	},

	clone() {
			const clone = Object.assign(Object.create(this), this);
			if (!isNull(this.bypassTraversal))
				clone.bypassTraversal = this.bypassTraversal.clone();
			return clone;

	},

	next() {
		if (!isNull(this.bypassTraversal))
			return this.bypassTraversal.next();
		throw ("The " + this.constructor.name + " can only be used as a predicate traversal");
	},

	nextTraverser() {
		if (!isNull(this.bypassTraversal))
			return this.bypassTraversal.nextTraverser();
		throw ("The " + this.constructor.name + " can only be used as a predicate traversal");
	},

	hasNext() {
		return isNull(this.bypassTraversal) || this.bypassTraversal.hasNext();
	},

	addStart(start) {
		if (!isNull(this.bypassTraversal))
			this.bypassTraversal.addStart(start);
	},

	isLocked() {
		return isNull(this.bypassTraversal) || this.bypassTraversal.isLocked();
	},

	getGraph() {
		return isNull(this.bypassTraversal) ? Optional.empty() : this.bypassTraversal.getGraph();
	},

	setGraph(graph) {
		if (!isNull(this.bypassTraversal))
			this.bypassTraversal.setGraph(graph);

	},

	getTraverserRequirements() {
		return isNull(this.bypassTraversal) ? REQUIREMENTS : this.bypassTraversal.getTraverserRequirements();
	},
	reset() {
		if (!isNull(this.bypassTraversal))
			this.bypassTraversal.reset();
	}
};

mixin(AbstractLambdaTraversal, Traversal.prototype);

export default AbstractLambdaTraversal;
