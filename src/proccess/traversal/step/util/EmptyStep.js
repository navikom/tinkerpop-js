import { mixin, List } from '../../../../util';
import Step from '../../Step';
import EmptyTraversal from '../../util/EmptyTraversal';
import TraversalParent from '../TraversalParent';

/**
 * EmptyStep
 */
function EmptyStep() {

}

EmptyStep.prototype = {
  constructor: EmptyStep,
  addStarts(starts) {
  },

  addStart(start) {
  },

  setPreviousStep(step) {
  },

  reset() {
  },

  getPreviousStep() {
    return this;
  },

  setNextStep(step) {
  },

  getNextStep() {
    return this;
  },

  getTraversal() {
    return new EmptyTraversal();
  },

  setTraversal() {

  },


  getLabels() {
    return new List();
  },

  addLabel() {

  },

  removeLabel() {

  },

  setId() {

  },

  getId() {
    return EmptyStep.HALT;
  },

  hasNext() {
    return false;
  },

  next() {
    throw ('No Such Element Exception');
  },
};

mixin(EmptyStep, Step.prototype, TraversalParent.prototype);


EmptyStep.HALT = 'halt';

EmptyStep.instance = () => new EmptyStep();

const instanceEmptyStep = new EmptyStep();
export { instanceEmptyStep, EmptyStep };
