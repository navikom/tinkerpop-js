/**
 * SingleIterator
 */
export class SingleIterator {

  constructor(t) {
    this.t = t;
    this.alive = true;
  }

  hasNext() {
    return this.alive;
  }

  remove() {
    this.t = null;
  }

  forEachRemaining(callback){
    callback(this.t);
  }

  next() {
    if (!this.alive) { throw ('No Such Element Exception'); } else {
      this.alive = false;
      return this.t;
    }
  }
}
