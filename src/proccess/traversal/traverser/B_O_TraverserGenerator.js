import { IterateIterator, List } from '../../../util';
import TraverserRequirement from './TraverserRequirement';
import TraverserGenerator from './util/TraverserGenerator';
import B_O_Traverser from './B_O_Traverser';

let INSTANCE = null;
const REQUIREMENTS = new List([
  TraverserRequirement.BULK,
  TraverserRequirement.OBJECT]);

/**
 * O_OB_S_SE_SL_TraverB_O_TraverserGeneratorserGenerator
 */
export default class B_O_TraverserGenerator extends TraverserGenerator {
  constructor() {
    super();
    if (!INSTANCE) {
      INSTANCE = this;
    }

    return INSTANCE;
  }

  generate(start, startStep, initialBulk) {
    return new B_O_Traverser(start, initialBulk);
  }

  getProvidedRequirements() {
    return REQUIREMENTS;
  }

  static instance(){
    return new B_O_TraverserGenerator();
  }

}
