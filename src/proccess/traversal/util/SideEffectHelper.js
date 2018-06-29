export default class SideEffectHelper {
  static validateSideEffectKey(key) {
    if (key === undefined || key === null) { throw ('sideEffect Key Can Not Be Null'); }
    if (key.trim() === '') { throw ('sideEffect Key Can Not Be Empty'); }
  }

  static validateSideEffectValue(value) {
    if (!value) { throw ('sideEffect Value Can Not Be Null'); }
  }

  static validateSideEffectKeyValue(key, value) {
    SideEffectHelper.validateSideEffectKey(key);
    SideEffectHelper.validateSideEffectValue(value);
  }
}
