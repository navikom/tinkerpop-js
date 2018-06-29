/**
 * DoubleIterator
 */
export class DoubleIterator {

  constructor(a, b) {
    this.a = a;
    this.b = b;
    this.current = 'a';
  }


  hasNext() {
    return this.current != 'x';
  }

  remove() {
    if (this.current == 'b') { this.a = null; } else if (this.current == 'x') { this.b = null; }
  }

  next() {
    if (this.current == 'x') { throw ('No Such Element Exception'); } else {
      if (this.current == 'a') {
        this.current = 'b';
        return this.a;
      }
      this.current = 'x';
      return this.b;
    }
  }
}
