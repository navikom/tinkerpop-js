import { List } from '../../../util';
import Bytecode from '../Bytecode';
import EmptyTraversalSideEffects from './EmptyTraversalSideEffects';
import EmptyTraversalStrategies from './EmptyTraversalStrategies';
import { EmptyStep } from '../step/util/EmptyStep';
import EmptyGraph from '../../../structure/util/empty/EmptyGraph';


let INSTANCE = null;

/**
 * EmptyTraversal
 */
export default class EmptyTraversal {

  constructor() {
    if (!INSTANCE) {
      INSTANCE = this;
    }
    return INSTANCE;
  }

  getBytecode() {
    return new Bytecode();
  }

  asAdmin() {
    return this;
  }

  hasNext() {
    return false;
  }

  next() {
    throw ('No Such Element Exception');
  }

  getSideEffects() {
    return new EmptyTraversalSideEffects();
  }

  applyStrategies() {

  }

  addStarts() {

  }

  addStart() {

  }

  addStep() {
    return INSTANCE;
  }

  getSteps() {
    return new List();
  }


  isLocked() {
    return true;
  }

  getTraverserGenerator() {
    return null;
  }

  setSideEffects() {
  }

  getStrategies() {
    return new EmptyTraversalStrategies();
  }

  setParent() {

  }

  getParent() {
    return EmptyStep.instance();
  }

  setStrategies() {

  }

  addStep() {
    return this;
  }

  removeStep() {
    return this;
  }


  getTraverserRequirements() {
    return [];
  }

  getGraph() {
    return EmptyGraph.instance();
  }

  setGraph() {

  }

  static instance(){
    return new EmptyTraversal();
  }
}
