import { mixin, List, isNull } from '../../../../util';
import TraversalParent from '../TraversalParent';
import ByModulating from '../../ByModulating';
import CollectingBarrierStep from './../util/CollectingBarrierStep';
import TraverserSet from '../../traverser/util/TraverserSet';
import TraversalUtil from '../../util/TraversalUtil';
import TraverserRequirement from '../../traverser/TraverserRequirement';
import ConstantTraversal from '../../lambda/ConstantTraversal';
import ProjectedTraverser from '../../traverser/ProjectedTraverser';
import StringFactory from '../../../../structure/util/StringFactory';

/**
 * SampleGlobalStep
 * @param traversal
 * @param amountToSample
 * @constructor
 */
function SampleGlobalStep(traversal, amountToSample) {
	CollectingBarrierStep.call(this, traversal);

	this.probabilityTraversal = new ConstantTraversal(1.0);
	this.amountToSample = amountToSample;
}

SampleGlobalStep.prototype = Object.create(CollectingBarrierStep.prototype);
SampleGlobalStep.prototype.constructor = SampleGlobalStep;

mixin(SampleGlobalStep, TraversalParent.prototype, ByModulating.prototype);

SampleGlobalStep.prototype.getLocalChildren = function() {
	return new List([this.probabilityTraversal]);
};

SampleGlobalStep.prototype.modulateBy = function(probabilityTraversal) {
	this.probabilityTraversal = this.integrateChild(probabilityTraversal);
};

SampleGlobalStep.prototype.toString = function() {
	return StringFactory.stepString(this, this.amountToSample, this.probabilityTraversal);
};

SampleGlobalStep.prototype.processAllStarts = function() {
	while (this.starts.hasNext()) {
		this.traverserSet.add(this.createProjectedTraverser(this.starts.next()));
	}
};

SampleGlobalStep.prototype.barrierConsumer = function(traverserSet) {
	// return the entire traverser set if the set is smaller than the amount to sample
	if (traverserSet.bulkSize() <= this.amountToSample)
		return;
	//////////////// else sample the set
	let totalWeight = 0.0;

	traverserSet.values().forEach((s) => {
		totalWeight = totalWeight + s.getProjections().get(0) * s.bulk()
	});

	///////
	const sampledSet = new TraverserSet();
	let runningAmountToSample = 0;
	while (runningAmountToSample < this.amountToSample) {
		let reSample = false;
		let runningWeight = 0.0;
		const traversers = traverserSet.values();
		for (let j = 0; j < traversers.size(); j++){
			const s = traversers.get(j);
			let sampleBulk = sampledSet.contains(s) ? sampledSet.get(s).bulk() : 0;
			if (sampleBulk < s.bulk()) {
				const currentWeight = s.getProjections().get(0);
				for (let i = 0; i < (s.bulk() - sampleBulk); i++) {
					runningWeight = runningWeight + currentWeight;
					if (Math.random() <= ((runningWeight / totalWeight))) {
						const split = s.split();
						split.setBulk(1);
						sampledSet.add(split);
						runningAmountToSample++;
						totalWeight = totalWeight - currentWeight;
						reSample = true;
						break;
					}
				}
				if (reSample || (runningAmountToSample >= this.amountToSample))
					break;
			}
		}
	}
	traverserSet.clear();
	traverserSet.addAll(sampledSet);
};

SampleGlobalStep.prototype.createProjectedTraverser = function(traverser) {
	return new ProjectedTraverser(traverser, new List([TraversalUtil.apply(traverser, this.probabilityTraversal)]));
};

SampleGlobalStep.prototype.getRequirements = function() {
	return this.getSelfAndChildRequirements(TraverserRequirement.BULK);
};

SampleGlobalStep.prototype.clone = function() {
	const clone = CollectingBarrierStep.prototype.clone.call(this);
	clone.probabilityTraversal = this.probabilityTraversal.clone();
	return clone;
};

SampleGlobalStep.prototype.setTraversal = function(parentTraversal) {
	CollectingBarrierStep.prototype.setTraversal.call(this, parentTraversal);
	this.integrateChild(this.probabilityTraversal);
};

export { SampleGlobalStep };
