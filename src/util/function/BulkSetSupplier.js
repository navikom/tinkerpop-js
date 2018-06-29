import BulkSet from '../../proccess/traversal/step/util/BulkSet';

let INSTANCE = null;

/**
 * BulkSetSupplier
 */
export default class BulkSetSupplier {

  constructor() {
    if (!INSTANCE) {
      INSTANCE = this;
    }
    return INSTANCE;
  }
  getValue() {
    return new BulkSet();
  }

  get() {
    return this.getValue();
  }

  static instance() {
    return new BulkSetSupplier();
  }
}

