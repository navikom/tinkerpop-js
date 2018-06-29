import { IterateIterator } from '../../../../util';

/**
 * TraverserGenerator
 */
export default class TraverserGenerator {

  constructor() {
  }

  generateIterator(starts, startStep, initialBulk) {
    const iterator = new IterateIterator();
    iterator.setHasNext(starts);
    iterator.setNext(() => this.generate(starts.next(), startStep, initialBulk));
    return iterator;
  }
}
