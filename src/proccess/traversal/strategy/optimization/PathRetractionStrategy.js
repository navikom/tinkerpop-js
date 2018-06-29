import { mixin, HashSet, List, Pair } from '../../../../util';
import TraversalStrategy from '../../TraversalStrategy';
import TraversalHelper from '../../util/TraversalHelper';
import PathUtil from '../../util/PathUtil';
import { MatchStep, NoOpBarrierStep, SelectOneStep } from '../../step/map';
import { FilterStep, DedupGlobalStep } from '../../step/filter';
import { RepeatStep } from '../../step/branch';
import RepeatUnrollStrategy from './RepeatUnrollStrategy';
import MatchPredicateStrategy from './MatchPredicateStrategy';
import TraverserRequirement from '../../traverser/TraverserRequirement';


const PRIORS = new List([
	RepeatUnrollStrategy.instance(), MatchPredicateStrategy.instance()]);
const MAX_BARRIER_SIZE = 2500;

/**
 * PathRetractionStrategy
 * @param standardBarrierSize
 * @constructor
 */
function PathRetractionStrategy(standardBarrierSize) {
	this.standardBarrierSize = standardBarrierSize;
}

PathRetractionStrategy.prototype = {
	constructor: PathRetractionStrategy,
	position: 6,
	apply(traversal) {

		// do not apply this strategy if there are lambdas as you can't introspect to know what path information the lambdas are using
		// do not apply this strategy if a PATH requirement step is being used (in the future, we can do PATH requirement lookhead to be more intelligent about its usage)
		if (TraversalHelper.anyStepRecursively(step => step.lambdaHolderType
			|| step.getRequirements().contains(TraverserRequirement.PATH), TraversalHelper.getRootTraversal(traversal)))
			return;

		const onGraphComputer = TraversalHelper.onGraphComputer(traversal);
		const foundLabels = new List();
		const keepLabels = new List();

		const steps = traversal.getSteps();
		for (let i = steps.size() - 1; i >= 0; i--) {
			const currentStep = steps.get(i);
			// maintain our list of labels to keep, repeatedly adding labels that were found during
			// the last iteration
			keepLabels.addAll(foundLabels);

			const labels = PathUtil.getReferencedLabels(currentStep);

			for (let j = 0; j < labels.size(); j++) {
				const label = labels.get(j);
				if (foundLabels.contains(label)){
					if(!keepLabels.contains(label))
						keepLabels.add(label);
				} else {
					foundLabels.add(label);
				}
			}
			// add the keep labels to the path processor
			if (currentStep.getKeepLabels) {
				const pathProcessor = currentStep;
				if (currentStep instanceof MatchStep &&
					(currentStep.getNextStep().constructor.name === 'EmptyStep') ||
					currentStep.getNextStep() instanceof DedupGlobalStep ||
					currentStep.getNextStep() instanceof SelectOneStep && currentStep.getNextStep().getNextStep().type === FilterStep.TYPE) {
					pathProcessor.setKeepLabels(currentStep.getMatchStartLabels());
					pathProcessor.getKeepLabels().addAll(currentStep.getMatchEndLabels());
				} else {
					if (!pathProcessor.getKeepLabels() || pathProcessor.getKeepLabels() === null)
						pathProcessor.setKeepLabels(keepLabels);
					else
						pathProcessor.getKeepLabels().addAll(new List(keepLabels));
				}

				if (currentStep.getTraversal().getParent() instanceof MatchStep) {
					pathProcessor.setKeepLabels(currentStep.getTraversal().getParent().asStep().getMatchStartLabels());
					pathProcessor.getKeepLabels().addAll(currentStep.getTraversal().getParent().asStep().getMatchEndLabels());
				}

				// OLTP barrier optimization that will try and bulk traversers after a path processor step to thin the stream
				if (!onGraphComputer && !(currentStep instanceof MatchStep) && !(currentStep.barrierType) && !(currentStep.getNextStep().barrierType) && !(currentStep.getTraversal().getParent() instanceof MatchStep) && !(currentStep.getNextStep().constructor.name === 'EmptyStep'))
					TraversalHelper.insertAfterStep(new NoOpBarrierStep(traversal, this.standardBarrierSize), currentStep, traversal);
			}
		}
		//console.log('PathRetractionStrategy1', foundLabels)
		keepLabels.addAll(foundLabels);

		// build a list of parent traversals and their required labels
		let parent = traversal.getParent().asStep();
		const parentKeeperPairs = new List();
		while (parent.constructor.name !== 'EmptyStep') {
			const parentKeepLabels = PathUtil.getReferencedLabels(parent);
			parentKeepLabels.addAll(PathUtil.getReferencedLabelsAfterStep(parent));
			parentKeeperPairs.add(new Pair(parent, parentKeepLabels));
			parent = parent.getTraversal().getParent().asStep();
		}

		// reverse the parent traversal list so that labels are kept from the top down
		parentKeeperPairs.reverse();

		let hasRepeat = false;

		const keeperTrail = new List();
		for (let i = 0; i < parentKeeperPairs.size(); i++) {
			const pair = parentKeeperPairs.get(i);
			let step = pair.getValue0();
			const levelLabels = pair.getValue1();

			if (step instanceof RepeatStep) {
				hasRepeat = true;
			}

			// if parent step is a TraversalParent itself and it has more than 1 child traversal
			// propagate labels to children
			if (step.propType === 'TraversalParent') {
				const children = new List();
				children.addAll(step.getGlobalChildren());
				children.addAll(step.getLocalChildren());
				// if this is the only child traversal, do not re-push labels
				if (children.size() > 1)
					this.applyToChildren(keepLabels, children);
			}

			// propagate requirements of keep labels back through the traversal's previous steps
			// to ensure that the label is not dropped before it reaches the step(s) that require it
			step = step.getPreviousStep();
			while (step.constructor.name !== 'EmptyStep') {
				if (step.setKeepLabels) {
					this.addLabels(step, keepLabels);
				}
				if (step.propType === 'TraversalParent') {
					const children = new List();
					children.addAll(step.getGlobalChildren());
					children.addAll(step.getLocalChildren());
					this.applyToChildren(keepLabels, children);
				}
				step = step.getPreviousStep();
			}

			// propagate keep labels forwards if future steps require a particular nested label
			while (step.constructor.name !== 'EmptyStep') {
				if (step.setKeepLabels) {
					const referencedLabels = PathUtil.getReferencedLabelsAfterStep(step);
					for (let j = 0; j < referencedLabels.size(); j++) {
						const ref = referencedLabels.get(j);
						if (levelLabels.contains(ref)) {
							if (!step.getKeepLabels() || step.getKeepLabels() === null) {
								const newKeepLabels = new List();
								newKeepLabels.add(ref);
								step.setKeepLabels(newKeepLabels);
							} else {
								step.getKeepLabels().add(ref);
							}
						}
					}
				}

				step = step.getNextStep();
			}

			keeperTrail.addAll(levelLabels);
		}

		for (let i = 0; i < traversal.getSteps().size(); i++) {
			const currentStep = traversal.getSteps().get(i);
			// go back through current level and add all keepers
			// if there is one more RepeatSteps in this traversal's lineage, preserve keep labels
			if (currentStep.getKeepLabels) {
				currentStep.getKeepLabels().addAll(keeperTrail);
				if (hasRepeat) {
					currentStep.getKeepLabels().addAll(keepLabels);
				}
			}
		}
	},

	applyToChildren(keepLabels, children) {
		for (let i = 0; i < children.size(); i++) {
			const child = children.get(i);
			TraversalHelper.applyTraversalRecursively((trav) => this.addLabels(trav, keepLabels), child);
		}
	},

	addLabels(traversal, keepLabels) {
		if (traversal.asAdmin) {
			for (let i = 0; i < traversal.getSteps().size(); i++) {
				const s = traversal.getSteps().get(i);
				if (s.setKeepLabels) {
					this.addLabels(s, keepLabels);
				}
			}
		} else {
			const s = traversal;
			if (s.getKeepLabels() === null) {
				s.setKeepLabels(keepLabels);
			} else {
				s.getKeepLabels().addAll(keepLabels);
			}
		}
	},

	applyPrior() {
		return PRIORS;
	}
};

mixin(PathRetractionStrategy, TraversalStrategy.OptimizationStrategy.prototype);

PathRetractionStrategy.MAX_BARRIER_SIZE = MAX_BARRIER_SIZE;

const INSTANCE = new PathRetractionStrategy(MAX_BARRIER_SIZE);

PathRetractionStrategy.instance = () => INSTANCE;

export default PathRetractionStrategy;

