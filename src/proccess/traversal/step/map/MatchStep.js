import { mixin, List, IteratorUtils, ArrayUtils, Map, Optional, isNull } from '../../../../util';
import Function from '../../../../util/function/Function';
import Traversal from '../../Traversal';
import TraversalHelper from '../../util/TraversalHelper';
import PathUtil from '../../util/PathUtil';
import TraversalParent from '../TraversalParent';
import DefaultTraversal from '../../util/DefaultTraversal';
import AbstractStep from '../util/AbstractStep';
import ProfileStep from '../util/ProfileStep';
import Scoping from '../Scoping';
import PathProcessor from '../PathProcessor';
import ComputerAwareStep from './../util/ComputerAwareStep';
import ReducingBarrierStep from './../util/ReducingBarrierStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';
import TraversalUtil from '../../util/TraversalUtil';
import { TraversalFlatMapStep } from '../map/TraversalFlatMapStep';
import { StartStep } from '../sideEffects';
import { ConnectiveStep, WhereTraversalStep, WherePredicateStep, AndStep, NotStep } from '../filter';
import { ConnectiveStrategy } from '../../strategy/decoration/ConnectiveStrategy';
import PathRetractionStrategy from '../../strategy/optimization/PathRetractionStrategy';
import TraverserSet from '../../traverser/util/TraverserSet';
import Pop from '../../Pop';
import TraversalEngine from '../../TraversalEngine';

/**
 * RepeatStep
 * @param traversal
 * @constructor
 */
function MatchStep(traversal, connective, ...matchTraversals) {
	ComputerAwareStep.call(this, traversal);
	matchTraversals = ArrayUtils.checkArray(matchTraversals);
	this.matchTraversals = new List();
	this.first = true;
	this.matchStartLabels = new List();
	this.matchEndLabels = new List();
	this.scopeKeys = null;
	this.matchAlgorithmClass = MatchStep.CountMatchAlgorithm; // default is CountMatchAlgorithm (use MatchAlgorithmStrategy to change)

	this.dedups = null;
	this.dedupLabels = null;
	this.keepLabels = null;

	this.connective = connective;
	this.matchTraversals = new List(matchTraversals);
	this.matchTraversals.forEach((traversal) => this.configureStartAndEndSteps(traversal)); // recursively convert to MatchStep, MatchStartStep, or MatchEndStep
	this.matchTraversals.forEach((traversal) => this.integrateChild(traversal));
	this.computedStartLabel = Helper.computeStartLabel(this.matchTraversals);

}

MatchStep.prototype = Object.create(ComputerAwareStep.prototype);
MatchStep.prototype.constructor = MatchStep;

mixin(MatchStep, TraversalParent.prototype, Scoping.prototype, PathProcessor.prototype);

MatchStep.prototype.pullOutVariableStartStepToParent = function(whereStep) {
	return this.pullOutVariableStartStepToParent(
		new List(),
		whereStep.getLocalChildren().getValue(0), true).size() != 1 ? null
		: this.pullOutVariableStartStepToParent(
		new List(), whereStep.getLocalChildren().getValue(0), false).iterator().next();
};

MatchStep.prototype.pullOutVariableStartStepToParent = function(selectKeys, traversal, testRun) {
	const startStep = traversal.getStartStep();
	if (startStep instanceof WhereTraversalStep.WhereStartStep && !startStep.getScopeKeys().isEmpty()) {
		selectKeys.addAll(startStep.getScopeKeys());
		if (!testRun) startStep.removeScopeKey();
	} else if (startStep instanceof ConnectiveStep || startStep instanceof NotStep) {
		startStep.getLocalChildren().forEach(child => this.pullOutVariableStartStepToParent(selectKeys, child, testRun));
	}
	return selectKeys;
};
//////////////////

MatchStep.prototype.configureStartAndEndSteps = function(matchTraversal) {
	ConnectiveStrategy.instance().apply(matchTraversal);
	// START STEP to MatchStep OR MatchStartStep
	const startStep = matchTraversal.getStartStep();
	if (startStep instanceof ConnectiveStep) {
		const matchStep = new MatchStep(matchTraversal,
			startStep instanceof AndStep ? ConnectiveStep.Connective.AND : ConnectiveStep.Connective.OR,
			startStep.getLocalChildren().toArray());
		TraversalHelper.replaceStep(startStep, matchStep, matchTraversal);
		this.matchStartLabels.addAll(matchStep.matchStartLabels);
		this.matchEndLabels.addAll(matchStep.matchEndLabels);
	} else if (startStep instanceof NotStep) {
		const notTraversal = new DefaultTraversal();
		TraversalHelper.removeToTraversal(startStep, startStep.getNextStep(), notTraversal);
		matchTraversal.addStep(new WhereTraversalStep(matchTraversal, notTraversal), 0);
		this.configureStartAndEndSteps(matchTraversal);
	} else if (StartStep.isVariableStartStep(startStep)) {
		const label = startStep.getLabels().iterator().next();
		if (!this.matchStartLabels.contains(label))
			this.matchStartLabels.add(label);
		TraversalHelper.replaceStep(matchTraversal.getStartStep(), new MatchStep.MatchStartStep(matchTraversal, label), matchTraversal);
	} else if (startStep instanceof WhereTraversalStep) {  // necessary for GraphComputer so the projection is not select'd from a path
		const whereStep = startStep;
		TraversalHelper.insertBeforeStep(
			new MatchStep.MatchStartStep(matchTraversal, this.pullOutVariableStartStepToParent(whereStep)), whereStep, matchTraversal);             // where(as('a').out()) -> as('a').where(out())
	} else if (startStep instanceof WherePredicateStep) {  // necessary for GraphComputer so the projection is not select'd from a path
		const whereStep = startStep;
		TraversalHelper.insertBeforeStep(
			new MatchStep.MatchStartStep(matchTraversal, whereStep.getStartKey().orElse(null)), whereStep, matchTraversal);   // where('a',eq('b')) --> as('a').where(eq('b'))
		whereStep.removeStartKey();
	} else {
		throw ("All match()-traversals must have a single start label (i.e. variable): " + matchTraversal.constructor.name);
	}
	// END STEP to MatchEndStep
	const endStep = matchTraversal.getEndStep();
	if (endStep.getLabels().size() > 1)
		throw ("The end step of a match()-traversal can have at most one label: " + endStep.constructor.name);
	const label = endStep.getLabels().size() === 0 ? null : endStep.getLabels().iterator().next();
	if (!isNull(label)) endStep.removeLabel(label);
	const matchEndStep = new MatchStep.MatchEndStep(matchTraversal, label);
	if (!isNull(label)) this.matchEndLabels.add(label);
	Traversal.prototype.addStep.call(matchTraversal.asAdmin(), matchEndStep);

	// this turns barrier computations into locally computable traversals
	if (!TraversalHelper.getStepsOfAssignableClass(ReducingBarrierStep, matchTraversal).isEmpty()) {
		const newTraversal = new DefaultTraversal();
		TraversalHelper.removeToTraversal(matchTraversal.getStartStep().getNextStep(), matchTraversal.getEndStep(), newTraversal);
		TraversalHelper.insertAfterStep(
			new TraversalFlatMapStep(matchTraversal, newTraversal), matchTraversal.getStartStep(), matchTraversal);
	}
};


MatchStep.prototype.getConnective = function() {
	return this.connective;
};

MatchStep.prototype.addGlobalChild = function(globalChildTraversal) {
	this.configureStartAndEndSteps(globalChildTraversal);
	this.matchTraversals.add(this.integrateChild(globalChildTraversal));
};

MatchStep.prototype.removeGlobalChild = function(globalChildTraversal) {
	this.matchTraversals.remove(globalChildTraversal);
};

MatchStep.prototype.getGlobalChildren = function() {
	return this.matchTraversals;
};

MatchStep.prototype.setKeepLabels = function(labels) {
	this.keepLabels = labels.clone();
	if (!isNull(this.dedupLabels))
		this.keepLabels.addAll(this.dedupLabels);
};

MatchStep.prototype.getKeepLabels = function() {
	return this.keepLabels;
};

MatchStep.prototype.getMatchEndLabels = function() {
	return this.matchEndLabels;
};

MatchStep.prototype.getMatchStartLabels = function() {
	return this.matchStartLabels;
};

MatchStep.prototype.getScopeKeys = function() {
	if (isNull(this.scopeKeys)) {
		this.scopeKeys = new List();
		this.matchTraversals.forEach(traversal => {
			if (traversal.getStartStep().getScopeValue)
				this.scopeKeys.addAll(traversal.getStartStep().getScopeKeys());
			if (traversal.getEndStep().getScopeValue)
				this.scopeKeys.addAll(traversal.getEndStep().getScopeKeys());
		});
		this.scopeKeys.removeAll(this.matchEndLabels);
		this.scopeKeys.remove(this.computedStartLabel);
		this.scopeKeys = this.scopeKeys;
	}
	return this.scopeKeys;
};

MatchStep.prototype.setMatchAlgorithm = function(matchAlgorithmClass) {
	this.matchAlgorithmClass = matchAlgorithmClass;
};

MatchStep.prototype.getMatchAlgorithm = function() {
	if (isNull(this.matchAlgorithm))
		this.initializeMatchAlgorithm(TraversalEngine.Type.STANDARD);
	return this.matchAlgorithm;
};

MatchStep.prototype.clone = function() {
	const clone = ComputerAwareStep.prototype.clone.call(this);
	clone.matchTraversals = new List();
	for (let i = 0; i < this.matchTraversals.size(); i++) {
		const traversal = this.matchTraversals.getValue(i);
		clone.matchTraversals.add(traversal.clone());
	}
	if (!isNull(this.dedups)) clone.dedups = new List();
	clone.standardAlgorithmBarrier = new TraverserSet();
	return clone;
};

MatchStep.prototype.setTraversal = function(parentTraversal) {
	ComputerAwareStep.prototype.setTraversal.call(this, parentTraversal);
	for (let i = 0; i < this.matchTraversals.size(); i++) {
		const traversal = this.matchTraversals.getValue(i);
		this.integrateChild(traversal);
	}
};

MatchStep.prototype.setDedupLabels = function(labels) {
	if (!labels.isEmpty()) {
		this.dedups = new List();
		this.dedupLabels = new List(labels.toArray());
		if (!isNull(this.keepLabels))
			this.keepLabels.addAll(this.dedupLabels);
	}
};

MatchStep.prototype.isDuplicate = function(traverser) {
	if (isNull(this.dedups))
		return false;
	const path = traverser.path();
	for (let i = 0; i < this.dedupLabels.size(); i++) {
		const label = this.dedupLabels.getValue(i);
		if (!path.hasLabel(label))
			return false;
	}
	const objects = new List();
	for (let i = 0; i < this.dedupLabels.size(); i++) {
		const label = this.dedupLabels.getValue(i);
		objects.add(path.get(Pop.last, label));
	}
	return this.dedups.contains(objects);
};

MatchStep.prototype.hasMatched = function(connective, traverser) {
	let counter = 0;
	let matched = false;
	for (let i = 0; i < this.matchTraversals.size(); i++) {
		const matchTraversal = this.matchTraversals.getValue(i);

		if (traverser.getTags().contains(matchTraversal.getStartStep().getId())) {
			if (connective == ConnectiveStep.Connective.OR) {
				matched = true;
				break;
			}
			counter++;
		}
	}
	if (!matched)
		matched = this.matchTraversals.size() === counter;
	if (matched && this.dedupLabels !== null) {
		const path = traverser.path();
		const objects = new List();
		for (let i = 0; i < this.dedupLabels.size(); i++) {
			const label = this.dedupLabels.getValue(i);
			objects.add(path.get(Pop.last, label));
		}
		this.dedups.add(objects);
	}
	return matched;
};

MatchStep.prototype.getBindings = function(traverser) {
	const bindings = new Map();
	traverser.path().forEach((object, labels) => {
		for (let i = 0; i < labels.size(); i++) {
			const label = labels.getValue(i);
			if (this.matchStartLabels.contains(label) || this.matchEndLabels.contains(label))
				bindings.put(label, object);
		}
	});
	return bindings;
};

MatchStep.prototype.initializeMatchAlgorithm = function(traversalEngineType) {
	this.matchAlgorithm = new this.matchAlgorithmClass();
	this.matchAlgorithm.initialize(traversalEngineType, this.matchTraversals);
};

MatchStep.prototype.hasPathLabel = function(path, labels) {
	for (let i = 0; i < labels.size(); i++) {
		const label = labels.getValue(i);
		if (path.hasLabel(label))
			return true;
	}
	return false;
};

MatchStep.prototype.getReferencedLabelsMap = function() {
	if (isNull(this.referencedLabelsMap)) {
		this.referencedLabelsMap = new Map();
		for (let i = 0; i < this.matchTraversals.size(); i++) {
			const traversal = this.matchTraversals.getValue(i);
			const referencedLabels = new List();
			for (let i = 0; i < traversal.getSteps().size(); i++) {
				const step = traversal.getSteps().getValue(i);
				referencedLabels.addAll(PathUtil.getReferencedLabels(step));
			}
			this.referencedLabelsMap.put(traversal.getStartStep().getId(), referencedLabels);
		}
	}
	return this.referencedLabelsMap;
};

MatchStep.prototype.standardAlgorithmBarrier = new TraverserSet();

MatchStep.prototype.standardAlgorithm = function() {
	while (true) {
		if (this.first) {
			this.first = false;
			this.initializeMatchAlgorithm(TraversalEngine.Type.STANDARD);
			if (!isNull(this.keepLabels) &&
				this.keepLabels.containsAll(this.matchEndLabels) &&
				this.keepLabels.containsAll(this.matchStartLabels))
				this.keepLabels = null;
		} else {
			let stop = false;
			for (let i = 0; i < this.matchTraversals.size(); i++) {
				const matchTraversal = this.matchTraversals.getValue(i);
				while (matchTraversal.hasNext()) {
					this.standardAlgorithmBarrier.add(matchTraversal.nextTraverser());
					if (isNull(this.keepLabels) || this.standardAlgorithmBarrier.size() >= PathRetractionStrategy.MAX_BARRIER_SIZE) {
						stop = true;
						break;
					}
				}
				if (stop) break;
			}
		}
		let traverser;
		if (this.standardAlgorithmBarrier.isEmpty()) {
			traverser = this.starts.next();
			if (!traverser.getTags().contains(this.getId())) {
				traverser.getTags().add(this.getId()); // so the traverser never returns to this branch ever again
				if (!this.hasPathLabel(traverser.path(), this.matchStartLabels))
					traverser.addLabels(new List([this.computedStartLabel])); // if the traverser doesn't have a legal start, then provide it the pre-computed one
			}
		} else
			traverser = this.standardAlgorithmBarrier.remove();

		///
		if (!this.isDuplicate(traverser)) {
			if (this.hasMatched(this.connective, traverser))
				return IteratorUtils.of(traverser.split(this.getBindings(traverser), this));

			if (this.connective === ConnectiveStep.Connective.AND) {
				const matchTraversal = this.getMatchAlgorithm().apply(traverser);
				traverser.getTags().add(0, matchTraversal.getStartStep().getId());
				matchTraversal.addStart(traverser); // determine which sub-pattern the traverser should try next
			} else {  // OR
				for (let i = 0; i < this.matchTraversals.size(); i++) {
					const matchTraversal = this.matchTraversals.getValue(i);
					const split = traverser.split();
					split.getTags().add(matchTraversal.getStartStep().getId());
					matchTraversal.addStart(split);
				}
			}
		}
	}
};

MatchStep.prototype.computerAlgorithm = function() {
	while (true) {
		if (this.first) {
			this.first = false;
			this.initializeMatchAlgorithm(TraversalEngine.Type.COMPUTER);
			if (!isNull(this.keepLabels) &&
				this.keepLabels.containsAll(this.matchEndLabels) &&
				this.keepLabels.containsAll(this.matchStartLabels))
				this.keepLabels = null;
		}
		const traverser = this.starts.next();
		if (!traverser.getTags().contains(this.getId())) {
			traverser.getTags().add(this.getId()); // so the traverser never returns to this branch ever again
			if (!this.hasPathLabel(traverser.path(), this.matchStartLabels))
				traverser.addLabels(new List([this.computedStartLabel])); // if the traverser doesn't have a legal start, then provide it the pre-computed one
		}
		///
		if (!this.isDuplicate(traverser)) {
			if (this.hasMatched(this.connective, traverser)) {
				traverser.setStepId(this.getNextStep().getId());
				traverser.addLabels(this.labels);
				return IteratorUtils.of(traverser.split(this.getBindings(traverser), this));
			}
			if (this.connective === ConnectiveStep.Connective.AND) {
				const matchTraversal = this.getMatchAlgorithm().apply(traverser); // determine which sub-pattern the traverser should try next
				traverser.getTags().add(matchTraversal.getStartStep().getId());
				traverser.setStepId(matchTraversal.getStartStep().getId()); // go down the traversal match sub-pattern
				return IteratorUtils.of(traverser);
			} else { // OR
				const traversers = new List();
				for (let i = 0; i < this.matchTraversals.size(); i++) {
					const matchTraversal = this.matchTraversals.getValue(i);
					const split = traverser.split();
					split.getTags().add(matchTraversal.getStartStep().getId());
					split.setStepId(matchTraversal.getStartStep().getId());
					traversers.add(split);
				}
				return traversers.iterator();
			}
		}
	}
};

MatchStep.prototype.getRequirements = function() {
	return this.getSelfAndChildRequirements(TraverserRequirement.LABELED_PATH, TraverserRequirement.SIDE_EFFECTS);
};

MatchStep.prototype.reset = function() {
	ComputerAwareStep.prototype.reset.call(this);
	this.first = true;
};


MatchStep.TraversalType = {
	WHERE_PREDICATE: 0,
	WHERE_TRAVERSAL: 1,
	MATCH_TRAVERSAL: 2,
};

//////////////////////////////
/**
 * MatchStartStep
 * @param traversal
 * @param selectKey
 * @constructor
 */
MatchStep.MatchStartStep = function(traversal, selectKey) {
	AbstractStep.call(this, traversal);
	this.selectKey = selectKey;
}

MatchStep.MatchStartStep.prototype = {
	constructor: MatchStep.MatchStartStep,

	processNextStart() {
		if (isNull(this.parent))
			this.parent = this.getTraversal().getParent();

		const traverser = this.starts.next();

		this.parent.getMatchAlgorithm().recordStart(traverser, this.getTraversal());
		const result = isNull(this.selectKey)
			? traverser : traverser.split(traverser.path().get(Pop.last, this.selectKey), this);
		return result
	},

	getSelectKey() {
		return Optional.ofNullable(this.selectKey);
	},

	getScopeKeys() {
		if (isNull(this.scopeKeys)) { // computer the first time and then save resultant keys
			this.scopeKeys = new List();
			if (!isNull(this.selectKey))
				this.scopeKeys.add(this.selectKey);
			if (this.getNextStep() instanceof WhereTraversalStep || this.getNextStep() instanceof WherePredicateStep)
				this.scopeKeys.addAll(this.getNextStep().getScopeKeys());
			this.scopeKeys = this.scopeKeys.clone();
		}
		return this.scopeKeys;
	}
};

mixin(MatchStep.MatchStartStep, AbstractStep.prototype, Scoping.prototype);

MatchStep.MatchEndStep = function(traversal, matchKey) {
	ComputerAwareStep.EndStep.call(this, traversal);
	this.matchKey = matchKey;
	this.matchKeyCollection = isNull(matchKey) ? new List() : new List([this.matchKey]);
};

MatchStep.MatchEndStep.prototype = {
	constructor: MatchStep.MatchEndStep,
	retractUnnecessaryLabels(traverser) {
		if (isNull(this.parent.getKeepLabels()))
			return traverser;

		const keepers = new List(this.parent.getKeepLabels().toArray());
		const tags = traverser.getTags();
		for (let i = 0; i < this.parent.matchTraversals.size(); i++) { // get remaining traversal patterns for the traverser
			const matchTraversal = this.parent.matchTraversals.get(i)
			const startStepId = matchTraversal.getStartStep().getId();
			if (!tags.contains(startStepId)) {
				keepers.addAll(this.parent.getReferencedLabelsMap().get(startStepId)); // get the reference labels required for those remaining traversals
			}
		}
		return PathProcessor.processTraverserPathLabels(traverser, keepers); // remove all reference labels that are no longer required
	},

	processNextStart() {
		if (isNull(this.parent))
			this.parent = this.getTraversal().getParent().asStep();

		while (true) {
			const traverser = this.starts.next();
			// no end label
			if (isNull(this.matchKey)) {
				// if (this.traverserStepIdAndLabelsSetByChild) -- traverser equality is based on stepId, lets ensure they are all at the parent
				traverser.setStepId(this.parent.getId());
				this.parent.getMatchAlgorithm().recordEnd(traverser, this.getTraversal());
				return this.retractUnnecessaryLabels(traverser);
			}
			// path check
			const path = traverser.path();

			if (!path.hasLabel(this.matchKey) || traverser.get() === path.get(Pop.last, this.matchKey)) {
				// if (this.traverserStepIdAndLabelsSetByChild) -- traverser equality is based on stepId and thus, lets ensure they are all at the parent
				traverser.setStepId(this.parent.getId());
				traverser.addLabels(this.matchKeyCollection.clone());

				this.parent.getMatchAlgorithm().recordEnd(traverser, this.getTraversal());
				const result = this.retractUnnecessaryLabels(traverser);
				return result;
			}
		}
	},

	getMatchKey() {
		return Optional.ofNullable(this.matchKey);
	},

	getScopeKeys() {
		return this.matchKeyCollection;
	}
}

mixin(MatchStep.MatchEndStep, ComputerAwareStep.EndStep.prototype, Scoping.prototype);

//////////////////////////////

class Helper {

	static getEndLabel(traversal) {
		const endStep = traversal.getEndStep();
		return endStep instanceof ProfileStep ? endStep.getPreviousStep().getMatchKey() :
			endStep.getMatchKey();
	}

	static getStartLabels(traversal) {
		return traversal.getStartStep().getScopeKeys();
	}

	static hasStartLabels(traverser, traversal) {
		const startLabels = Helper.getStartLabels(traversal);

		for (let i = 0; i < startLabels.size(); i++) {
			const label = startLabels.getValue(i);
			//console.log('hasStartLabels', traverser.path(), startLabels, label, traversal)
			if (!traverser.path().hasLabel(label))
				return false;
		}
		return true;
	}

	static hasEndLabel(traverser, traversal) {
		const endLabel = Helper.getEndLabel(traversal);
		return endLabel.isPresent() && traverser.path().hasLabel(endLabel);
	}

	static hasExecutedTraversal(traverser, traversal) {
		return traverser.getTags().contains(traversal.getStartStep().getId());
	}

	static getTraversalType(traversal) {
		const nextStep = traversal.getStartStep().getNextStep();
		if (nextStep instanceof WherePredicateStep)
			return MatchStep.TraversalType.WHERE_PREDICATE;
		else if (nextStep instanceof WhereTraversalStep)
			return MatchStep.TraversalType.WHERE_TRAVERSAL;
		else
			return MatchStep.TraversalType.MATCH_TRAVERSAL;
	}

	static computeStartLabel(traversals) {
		const sort = [];
		for (let i = 0; i < traversals.size(); i++) {
			const traversal = traversals.getValue(i);

			Helper.getStartLabels(traversal).iterator().filter(startLabel =>
				!sort.includes(startLabel)).forEach(entity => sort.push(entity));

			Helper.getEndLabel(traversal).ifPresent(endLabel => {
				if (!sort.includes(endLabel))
					sort.push(endLabel);
			});
		}
		sort.sort((a, b) => {
			for (let i = 0; i < traversals.size(); i++) {
				const traversal = traversals.getValue(i);
				const endLabel = Helper.getEndLabel(traversal);
				if (endLabel.isPresent()) {
					const startLabels = Helper.getStartLabels(traversal);
					if (a === endLabel && startLabels.contains(b))
						return 1;
					else if (b === endLabel && startLabels.contains(a))
						return -1;
				}
			}
			return 0;
		});

		sort.sort((a, b) => {
			for (let i = 0; i < traversals.size(); i++) {
				const traversal = traversals.getValue(i);
				const endLabel = Helper.getEndLabel(traversal);
				if (endLabel.isPresent()) {
					const startLabels = Helper.getStartLabels(traversal);
					if (a === endLabel && startLabels.contains(b))
						return 1;
					else if (b === endLabel && startLabels.contains(a))
						return -1;
				}
			}
			return 0;
		});
		return sort[0];
	}
}

//////////////////////////////

MatchStep.MatchAlgorithm = function() {
};

MatchStep.MatchAlgorithm.prototype = {
	constructor: MatchStep.MatchAlgorithm,

};

mixin(MatchStep.MatchAlgorithm, Function.prototype);

///////////////////////////////

MatchStep.CountMatchAlgorithm = function() {
	this.counter = 0;
}

MatchStep.CountMatchAlgorithm.prototype = {
	constructor: MatchStep.CountMatchAlgorithm,
	initialize(traversalEngineType, traversals) {
		this.onComputer = false;
		this.bundles = traversals.iterator().map((traversal) => new MatchStep.CountMatchAlgorithm.Bundle(traversal));
	},

	apply(traverser) {
		let startLabelsBundle = null;
		for (let i = 0; i < this.bundles.size(); i++) {
			const bundle = this.bundles.get(i);
			if (!Helper.hasExecutedTraversal(traverser, bundle.traversal) && Helper.hasStartLabels(traverser, bundle.traversal)) {
				if (bundle.traversalType !== MatchStep.TraversalType.MATCH_TRAVERSAL || Helper.hasEndLabel(traverser, bundle.traversal))
					return bundle.traversal;
				else if (isNull(startLabelsBundle))
					startLabelsBundle = bundle;
			}
		}
		if (!isNull(startLabelsBundle)) return startLabelsBundle.traversal;
		throw ("apply error");

	},

	recordStart(traverser, traversal) {
		this.getBundle(traversal).startsCount++;
	},

	recordEnd(traverser, traversal) {
		this.getBundle(traversal).incrementEndCount();
		if (!this.onComputer) {  // if on computer, sort on a per traverser-basis with bias towards local star graph
			if (this.counter < 200 || this.counter % 250 === 0) // aggressively sort for the first 200 results -- after that, sort every 250
				this.bundles.sort((a, b) => a.traversalType - b.traversalType).sort((a, b) => a.multiplicity - b.multiplicity);

			this.counter++;
		}
	},

	getBundle(traversal) {
		for (let i = 0; i < this.bundles.size(); i++) {
			const bundle = this.bundles.get(i);
			if (bundle.traversal === traversal)
				return bundle;
		}
		throw ("No equivalent traversal could be found in CountMatchAlgorithm: " + traversal.constructor.name);
	}
};

mixin(MatchStep.CountMatchAlgorithm, MatchStep.MatchAlgorithm.prototype);

MatchStep.CountMatchAlgorithm.Bundle = function(traversal) {
	this.traversal = traversal;
	this.traversalType = Helper.getTraversalType(traversal);
	this.startsCount = 0;
	this.endsCount = 0;
	this.multiplicity = 0.0;
}

MatchStep.CountMatchAlgorithm.Bundle.prototype = {
	constructor: MatchStep.CountMatchAlgorithm.Bundle,
	incrementEndCount() {
		this.multiplicity = ++this.endsCount / this.startsCount;
	}
};

export { MatchStep };

