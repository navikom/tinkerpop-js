import Traversal from '../../Traversal';
import EmptyPath from '../../util/EmptyPath';

let INSTANCE = null;

/**
 *
 * @constructor
 */
export default class EmptyTraverser extends Traversal {
  constructor() {
    super();
    if (!INSTANCE) {
      INSTANCE = this;
    }
    this.time = new Date();

    return INSTANCE;
  }

  addLabels() {

  }

  keepLabels() {

  }

  dropLabels() {

  }

  dropPath() {

  }

  setValue() {

  }

  incrLoops() {

  }

  resetLoops() {

  }

  getStepId() {
    return EmptyTraverser.Halt;
  }

  setStepId() {

  }

  setBulk() {

  }

  split() {
    return INSTANCE;
  }

  split() {
    return this;
  }

  detach() {
    return this;
  }

  attach() {
    return null;
  }

  setSideEffects() {

  }

  getValue() {
    return null;
  }

  getSack() {
    return null;
  }


  merge() {

  }

  path() {
    return new EmptyPath();
  }

  loops() {
    return 0;
  }

  bulk() {
    return 0;
  }

  getSideEffects() {
    return null;
  }

  getTags() {
    return {};
  }

  static instance(){
    return new EmptyTraverser();
  }

}

EmptyTraverser.Halt = 'halt';
