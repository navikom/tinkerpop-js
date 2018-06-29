import { mixin, ArrayUtils, List, Map, Optional } from '../../../../util';
import { FilterStep } from './FilterStep';
import TraversalParent from '../TraversalParent';
import TraversalUtil from '../../util/TraversalUtil';
import TraversalRing from '../../util/TraversalRing';
import TraversalHelper from '../../util/TraversalHelper';
import Scoping from '../Scoping';
import ByModulating from '../../ByModulating';
import PathProcessor from '../../step/PathProcessor';
import Pop from '../../Pop';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * WherePredicateStep
 * @param traversal
 * @param startKey
 * @param predicate
 * @constructor
 */
function WherePredicateStep(traversal, startKey, predicate) {
	FilterStep.call(this, traversal);
	this.scopeKeys = new List();
	this.traversalRing = new TraversalRing();
	this.startKey = startKey || null;
	if (null !== this.startKey)
		this.scopeKeys.add(this.startKey);
	this.predicate = predicate;
	this.selectKeys = new List();
	this.configurePredicates(this.predicate);
}
WherePredicateStep.prototype = {
	constructor: WherePredicateStep,
	configurePredicates(predicate) {
		if (predicate.getPredicates)
			predicate.getPredicates().forEach((p) => this.configurePredicates(p));
		else {
			const selectKey = (predicate.getValue() instanceof List ? predicate.getValue().iterator().next() : predicate.getValue());
			this.selectKeys.add(selectKey);
			this.scopeKeys.add(selectKey);
		}
	},

	setPredicateValues(predicate, traverser, selectKeysIterator) {
		if (predicate.getPredicates)
			predicate.getPredicates().forEach((p) => this.setPredicateValues(p, traverser, selectKeysIterator));
		else
			predicate.setValue(
				TraversalUtil.applyNullable(this.getScopeValue(Pop.last, selectKeysIterator.next(), traverser), this.traversalRing.next())
			);
	},

	getPredicate() {
		return Optional.ofNullable(this.predicate);
	},

	getStartKey() {
		return Optional.ofNullable(this.startKey);
	},

	removeStartKey() {
		this.selectKeys.remove(this.startKey);
		this.startKey = null;
	},

	filter(traverser) {
		const value = null === this.startKey ?
			TraversalUtil.applyNullable(traverser, this.traversalRing.next()) :
			TraversalUtil.applyNullable(this.getScopeValue(Pop.last, this.startKey, traverser), this.traversalRing.next());
		this.setPredicateValues(this.predicate, traverser, this.selectKeys.iterator());
		this.traversalRing.reset();
		return this.predicate.test(value);
	},

	getScopeKeys() {
		return this.scopeKeys;
	},

	clone() {
		const clone = FilterStep.prototype.clone.call(this);
		clone.predicate = this.predicate.clone();
		clone.traversalRing = this.traversalRing.clone();
		return clone;
	},

	setTraversal(parentTraversal) {
		FilterStep.prototype.setTraversal.call(this, parentTraversal);
		this.traversalRing.getTraversals().forEach((t) => this.integrateChild(t));
	},

	getRequirements() {
		const requirements =
			TraversalHelper.getLabels(
				TraversalHelper.getRootTraversal(this.traversal)).iterator()
				.filter((entry) => this.scopeKeys.contains(entry.getValue())).size() > 0
				? Scoping.TYPICAL_GLOBAL_REQUIREMENTS :
				Scoping.TYPICAL_LOCAL_REQUIREMENTS;
		return this.getSelfAndChildRequirements(requirements.toArray());
	},

	getLocalChildren() {
		return this.traversalRing.getTraversals();
	},

	processNextStart() {
		return PathProcessor.processTraverserPathLabels(FilterStep.prototype.processNextStart.call(this), this.keepLabels);
	},

	setKeepLabels(labels) {
		this.keepLabels = labels;
	},

	getKeepLabels() {
		return this.keepLabels;
	},

	modulateBy(traversal) {
		this.traversalRing.addTraversal(this.integrateChild(traversal));
	}
};

mixin(WherePredicateStep,
	FilterStep.prototype,
	Scoping.prototype,
	PathProcessor.prototype,
	ByModulating.prototype,
	TraversalParent.prototype
);

export { WherePredicateStep };
