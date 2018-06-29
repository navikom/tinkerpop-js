import { mixin, List, isNull } from '../../../util';
import Traversal from '../Traversal';
import TraversalParent from '../step/TraversalParent';
import TraversalHelper from '../util/TraversalHelper';
import Bytecode from '../Bytecode';
import EmptyGraph from '../../../structure/util/empty/EmptyGraph';
import { instanceEmptyStep, EmptyStep } from '../step/util/EmptyStep';
import StepPosition from '../util/StepPosition';
import EmptyTraverser from '../traverser/util/EmptyTraverser';
import DefaultTraversalSideEffects from '../util/DefaultTraversalSideEffects';
import TraverserRequirement from '../traverser/TraverserRequirement';
import DefaultTraverserGeneratorFactory from '../traverser/util/DefaultTraverserGeneratorFactory';


/**
 * DefaultTraversal
 * @param graph
 * @param traversalStrategies
 * @param bytecode
 * @constructor
 */
function DefaultTraversal(graph, traversalStrategies, bytecode) {
	Traversal.call(this);

	this.lastTraverser = new EmptyTraverser();

	// List of steps
	this.steps = new List();
	// steps will be repeatedly retrieved from this traversal so wrap them once in an immutable list that can be reused
	this.unmodifiableSteps = this.steps;
	this.strategies = traversalStrategies;

	this.finalEndStep = EmptyStep.instance();
	this.stepPosition = new StepPosition();
	this._sideEffects = new DefaultTraversalSideEffects();

	this.graph = graph || EmptyGraph.instance();
	this.bytecode = bytecode || new Bytecode();
	this.parent = EmptyStep.instance();
	this.locked = false;
}

DefaultTraversal.prototype = {
	constructor: DefaultTraversal,
	asAdmin() {
		return this;
	},
	getBytecode() {
		return this.bytecode;
	},
	getTraverserGenerator() {
		if (!this.generator) {
			this.generator = (this.parent instanceof EmptyStep) ?
				DefaultTraverserGeneratorFactory.instance().getTraverserGenerator(this.getTraverserRequirements()) :
				TraversalHelper.getRootTraversal(this).getTraverserGenerator();
		}
		return this.generator;
	},

	applyStrategies() {
		if (this.locked) throw ('traversal Is Locked');
		TraversalHelper.reIdSteps(this.stepPosition, this);
		this.strategies.applyStrategies(this);

		const hasGraph = this.graph;
		for (let i = 0, j = this.steps.size(); i < j; i++) { // "foreach" can lead to ConcurrentModificationExceptions
			const step = this.steps.getValue(i);

			//console.log('applyStrategies', step, step.propType === TraversalParent.TYPE)
			if (step.propType === TraversalParent.TYPE) {
				for (let h = 0; h < step.getGlobalChildren().size(); h++) {
					const globalChild = step.getGlobalChildren().getValue(h);
					globalChild.setStrategies(this.strategies);
					globalChild.setSideEffects(this._sideEffects);
					if (hasGraph) globalChild.setGraph(this.graph);
					globalChild.applyStrategies();
				}
				for (let h = 0; h < step.getLocalChildren().size(); h++) {
					const localChild = step.getLocalChildren().getValue(h);
					localChild.setStrategies(this.strategies);
					localChild.setSideEffects(this._sideEffects);
					if (hasGraph) localChild.setGraph(this.graph);
					localChild.applyStrategies();
				}
			}
		}
		this.finalEndStep = this.getEndStep();
		// finalize requirements
		if (this.getParent() instanceof EmptyStep) {
			this.requirements = null;
			this.getTraverserRequirements();
		}
		this.locked = true;
	},

	getTraverserRequirements() {
		if (isNull(this.requirements)) {
			// if (!this.locked) this.applyStrategies();
			this.requirements = new List();

			for (let i = 0; i < this.getSteps().size(); i++) {
				const step = this.getSteps().getValue(i);
				//console.log('getTraverserRequirements', step, step.getRequirements())
				this.requirements.addAll(step.getRequirements());
			}
			if (!this.getSideEffects().keys().isEmpty()) {
				this.requirements.add(TraverserRequirement.SIDE_EFFECTS);
			}
			if (this.getSideEffects().getSackInitialValue()) {
				this.requirements.add(TraverserRequirement.SACK);
			}
			if (this.requirements.contains(TraverserRequirement.ONE_BULK)) {
				this.requirements.remove(TraverserRequirement.BULK);
			}

			this.requirements = this.requirements.clone();

		}
		return this.requirements;
	},

	getSteps() {
		return this.unmodifiableSteps;
	},

	nextTraverser() {
		try {
			if (!this.locked) this.applyStrategies();
			if (this.lastTraverser.bulk() > 0) {
				const temp = this.lastTraverser;
				this.lastTraverser = EmptyTraverser.instance();
				return temp;
			}
			return this.finalEndStep.next();
		} catch (err) {
			console.log('DefaultTraversal nextTraverser', err);
		}
	},

	hasNext() {
		if (!this.locked) this.applyStrategies();
		//console.log('DefaultTraversal', this.finalEndStep)
		const has = this.lastTraverser.bulk() > 0 || this.finalEndStep.hasNext();
		return has;
	},

	next() {
		if (!this.locked) this.applyStrategies();
		if (this.lastTraverser.bulk() === 0) {
			this.lastTraverser = this.finalEndStep.next();
		}

		this.lastTraverser.setBulk(this.lastTraverser.bulk() - 1);
		return this.lastTraverser.get();
	},

	reset() {
		this.steps.forEach((entity) => entity.reset());
		this.lastTraverser = new EmptyTraverser();
	},

	addStart(start) {
		if (!this.locked) this.applyStrategies();
		if (!this.steps.isEmpty()) this.steps.getByIndex(0).addStart(start);
	},

	addStarts(starts) {
		if (!this.locked) this.applyStrategies();
		if (!this.steps.isEmpty()) this.steps.getByIndex()[0].addStarts(starts);
	},

	getStartStep() {
		return this.steps.isEmpty() ? EmptyStep.instance() : this.steps.getByIndex(0);
	},

	getEndStep() {
		//console.log('DefaultTraversal', this.steps)
		return this.steps.isEmpty() ? EmptyStep.instance() : this.steps.getByIndex(this.steps.size() - 1);
	},

	isLocked() {
		return this.locked;
	},

	setSideEffects(sideEffects) {
		this._sideEffects = sideEffects;
	},

	getSideEffects() {
		return this._sideEffects;
	},

	setStrategies(strategies) {
		this.strategies = strategies;
	},

	getStrategies() {
		return this.strategies;
	},

	addStep(step, index) {
		if (this.locked) throw ('traversal Is Locked');
		//console.log('DefaultTraversal addStep', this, step, index);
		step.setId(this.stepPosition.nextXId());
		this.steps.add(index, step);
		const previousStep = this.steps.size() > 0 && index !== 0 ? this.steps.getByIndex(index - 1) : null;
		const nextStep = this.steps.size() > index + 1 ? this.steps.getByIndex(index + 1) : null;
		step.setPreviousStep(!isNull(previousStep) ? previousStep : EmptyStep.instance());
		step.setNextStep(!isNull(nextStep) ? nextStep : EmptyStep.instance());
		if (!isNull(previousStep)) previousStep.setNextStep(step);
		if (!isNull(nextStep)) nextStep.setPreviousStep(step);
		step.setTraversal(this);
		return this;
	},

	removeStep(index) {
		if (this.locked) throw ('traversal Is Locked');
		if (isNaN(index)) {
			index = TraversalHelper.stepIndex(index, this)
		}
		const previousStep = this.steps.size() > 0 && index != 0 ? this.steps.getByIndex(index - 1) : null;
		const nextStep = this.steps.size() > index + 1 ? this.steps.getByIndex(index + 1) : null;
		this.steps.remove(index);
		if (previousStep) previousStep.setNextStep(isNull(nextStep) ? EmptyStep.instance() : nextStep);
		if (nextStep) nextStep.setPreviousStep(isNull(previousStep) ? EmptyStep.instance() : previousStep);
		return this;
	},
	setParent(step) {
		this.parent = step;
	},

	getParent() {
		return this.parent;
	},

	getGraph() {
		return this.graph;
	},

	setGraph(graph) {
		this.graph = graph;
	},

	clone() {
		const clone = Object.assign(Object.create(this), this);
		clone.lastTraverser = EmptyTraverser.instance();
		clone.steps = new List();
		clone.unmodifiableSteps = clone.steps;
		clone.sideEffects = this.sideEffects ? this.sideEffects.clone() : undefined;
		clone.strategies = this.strategies;
		for (let i = 0; i < this.steps.size(); i++) {
			const step = this.steps.getValue(i);
			const clonedStep = step.clone();
			clonedStep.setTraversal(clone);
			const previousStep = clone.steps.isEmpty() ? EmptyStep.instance() : clone.steps.getValue(clone.steps.size() - 1);
			clonedStep.setPreviousStep(previousStep);
			previousStep.setNextStep(clonedStep);
			clone.steps.add(clonedStep);
		}
		clone.finalEndStep = clone.getEndStep();
		return clone;
	}
};

mixin(DefaultTraversal, Traversal.prototype);

export default DefaultTraversal;
