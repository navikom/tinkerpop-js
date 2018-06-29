export default class GraphVariableHelper {
  static validateVariable(variable, value) {
    if (value === null) {
      throw ('variable Value Can Not Be Null');
    } else if (variable === null) {
      throw ('variable Key Can Not Be Null');
    } else if (variable === '') {
      throw ('variable Key Can Not Be Empty');
    }
  }
}
