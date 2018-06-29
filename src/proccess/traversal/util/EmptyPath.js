let INSTANCE = null;

/**
 * EmptyPath
 */
export default class EmptyPath {
  constructor() {
    if (!INSTANCE) {
      INSTANCE = this;
    }

    return INSTANCE;
  }

  size() {
    return 0;
  }

  extend() {
    return this;
  }


  retract() {
    return this;
  }

  getValue(label) {
    throw (`step With Provided Label: ${label} Does Not Exist`);
  }

  getValue() {
    return null;
  }

  hasLabel() {
    return false;
  }

  objects() {
    return [];
  }

  labels() {
    return [];
  }

  isSimple() {
    return true;
  }
}
