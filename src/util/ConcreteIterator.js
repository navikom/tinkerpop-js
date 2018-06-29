/**
 * Iterator
 */

class ConcreteIterator {
  constructor(aggregate) {
    this.index = 0;
    this.aggregate = aggregate;
  }

  first() {
    return this.aggregate.list[0];
  }

  next() {
    this.index += 2;
    return this.aggregate.list[this.index];
  }

  currentItem() {
    return this.aggregate.list[this.index];
  }
}


export class Iterate {
  constructor(list) {
    this.list = list;
  }

  createIterator() {
    this.iterator = new ConcreteIterator(this);
  }
}
