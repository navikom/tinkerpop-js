import { mixin, Logger } from '../../../../util';
import Step from '../../Step';
import { List } from '../../../../util';
import ExpandableStepIterator from './ExpandableStepIterator';
import { EmptyStep } from './EmptyStep';
import EmptyTraversal from '../../util/EmptyTraversal';
import StringFactory from '../../../../structure/util/StringFactory';

/**
 * AbstractStep
 * @param traversal
 * @constructor
 */
function AbstractStep(traversal) {
  Step.call(this);

  this.traversal = traversal;

  this.starts = new ExpandableStepIterator(this);
  this.id = 'halt';
  this.labels = new List();
  this.traverserStepIdAndLabelsSetByChild = false;
}

AbstractStep.prototype = {
  constructor: AbstractStep,
  setId(id) {
    //console.log('setId', this, id)
    this.id = id;
  },

  getId() {
    return this.id;
  },

  addLabel(label) {
    this.labels.add(label);
  },

  removeLabel(label) {
    this.labels.removeByValue(label);
  },

  getLabels() {
    return this.labels;
  },

  reset() {

    this.starts.clear();
    this.nextEnd = null;
  },

  addStarts(starts) {
    this.starts.add(starts);
  },

  addStart(start) {
    this.starts.add(start);
  },

  setPreviousStep(step) {
    this.previousStep = step;
  },

  getPreviousStep() {
    return this.previousStep;
  },

  setNextStep(step) {
    this.nextStep = step;
  },

  getNextStep() {
    return this.nextStep;
  },

  next() {
    const logger = Logger.init();
    logger.start();
    if (this.nextEnd) {
      try {
        return this.prepareTraversalForNextStep(this.nextEnd);
      } finally {
        //console.log('next', this, this.nextEnd.get());
        this.nextEnd = null;
      }
    } else {
      while (true) {
        const traverser = this.processNextStart();
        //console.log('next2', this, traverser)
        if (traverser.get() !== undefined && traverser.bulk() !== 0) {
          logger.info(`AbstractStep::next`);
          return this.prepareTraversalForNextStep(traverser);
        }
      }
    }
  },

  hasNext() {
    if (this.nextEnd) {
      return true;
    }
    try {
      while (true) {
        //console.log('AbstractStep1', this);
        this.nextEnd = this.processNextStart();
        //console.log('AbstractStep2', this, this.nextEnd, this.nextEnd.get());
        if (this.nextEnd.get() && this.nextEnd.bulk() !== 0) {
          return true;
        }
        this.nextEnd = null;
      }
    } catch (err) {
      //console.log('AbstractStep', this, err);
      return false;
    }
  },

  getTraversal() {
    return this.traversal;
  },

  setTraversal(traversal) {
    this.traversal = traversal;
  },
  prepareTraversalForNextStep(traverser) {
    if (!this.traverserStepIdAndLabelsSetByChild) {
      traverser.setStepId(this.nextStep.getId());
      traverser.addLabels(this.labels);
    }
    return traverser;
  },
  processNextStart() {
    throw new Error('Must be overloaded');
  },

  clone() {
      const clone = Object.assign(Object.create(this), this);
      clone.starts = new ExpandableStepIterator(clone);
      clone.previousStep = EmptyStep.instance();
      clone.nextStep = EmptyStep.instance();
      clone.nextEnd = null;
      clone.traversal = EmptyTraversal.instance();
      clone.labels = this.labels.clone();
      clone.reset();
      return clone;
  },

  toString(){
    return StringFactory.stepString(this);
  }
};
mixin(AbstractStep, Step.prototype);

export default AbstractStep;
