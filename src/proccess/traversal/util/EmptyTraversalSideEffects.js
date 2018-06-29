let INSTANCE = null;

export default class EmptyTraversalSideEffects {
  constructor() {
    if (!INSTANCE) {
      INSTANCE = this;
    }
    return INSTANCE;
  }

  setValue(key, value) {
    throw (`side Effect Ke yDoes Not Exist (${key})`);
  }

  getValue(key) {
    throw (`side Effect Ke yDoes Not Exist (${key})`);
  }

  remove(key) {
    throw (`side Effect Ke yDoes Not Exist (${key})`);
  }

  keys() {
    return [];
  }

  add(key, value) {
    throw (`side Effect Ke yDoes Not Exist (${key})`);
  }

  register(key, initialValue, reducer) {

  }

  registerIfAbsent(key, initialValue, reducer) {

  }

  getReducer(key) {
    throw (`side Effect Ke yDoes Not Exist (${key})`);
  }


  getSupplier(key) {
    throw (`side Effect Ke yDoes Not Exist (${key})`);
  }


  registerSupplier(supplier) {

  }

  getRegisteredSupplier(key) {
    return {};
  }

  setSack() {

  }

  getSackInitialValue() {
    return null;
  }

  getSackSplitter() {
    return null;
  }

  getSackMerger() {
    return null;
  }


  mergeInto() {

  }

  static instance(){
    return new EmptyTraversalSideEffects();
  }
}
