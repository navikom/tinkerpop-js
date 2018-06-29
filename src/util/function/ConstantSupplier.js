/**
 * ConstantSupplier
 */
export default class ConstantSupplier {

  constructor(a) {
    this.a = a;
  }

  get() {
    return this.a;
  }
}
