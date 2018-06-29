export class ArrayUtils {
  static checkArray(array) {
    return array[0] && array[0] instanceof Array ? array[0] : array;
  }
}
