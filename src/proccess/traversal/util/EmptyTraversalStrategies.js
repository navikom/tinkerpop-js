let INSTANCE = null;

/**
 * EmptyTraversalStrategies
 */
export default class EmptyTraversalStrategies {

  constructor() {
    if (!INSTANCE) {
      INSTANCE = this;
    }
    return INSTANCE;
  }

  toList() {
    return [];
  }

  applyStrategies() {

  }

  addStrategies() {
    return this;
  }

  removeStrategies() {
    return this;
  }

  static instance(){
    return new EmptyTraversalStrategies();
  }
}
