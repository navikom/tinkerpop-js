const getHelper = Symbol('getHelper');

const isFloat = (n) => {
  return Number(n) === n && n % 1 !== 0;
};

const toFixed = (result, a, b) => {
  const al = isFloat(a) ? a.toString().split('.')[1].length : 0;
  const bl = isFloat(b) ? b.toString().split('.')[1].length : 0;
  return al || bl ? parseFloat(result.toFixed(al >= bl ? al : bl)) : result;
};

/**
 * NumberHelper
 */
export default class NumberHelper {

  constructor(add, sub, mul, div, min, max) {
    this.add = add;
    this.sub = sub;
    this.mul = mul;
    this.div = div;
    this.min = min;
    this.max = max;
  }

  static get UNIVERSAL_NUMBER_HELPER() {
    return new NumberHelper(
      (a, b) => { return toFixed(a + b, a, b); },
      (a, b) => { return toFixed(a - b, a, b); },
      (a, b) => { return toFixed(a * b, a, b); },
      (a, b) => { return toFixed(a / b, a, b); },
      (a, b) => { return a <= b ? a : b; },
      (a, b) => { return a >= b ? a : b; }
    );
  }

  static add(a, b) {
    const clazz = this.getHighestCommonNumberClass(false, a, b);
    return this[getHelper](clazz).add(a, b);
  }

  static sub(a, b) {
    const clazz = this.getHighestCommonNumberClass(false, a, b);
    return this[getHelper](clazz).sub(a, b);
  }

  static mul(a, b) {
    const clazz = this.getHighestCommonNumberClass(a, b);
    return this[getHelper](clazz).mul(a, b);
  }

  static div(a, b, forceFloatingPoint = false) {
    const clazz = this.getHighestCommonNumberClass(forceFloatingPoint, a, b);
    return this[getHelper](clazz).div(a, b);
  }

  static min(a, b) {
    const clazz = this.getHighestCommonNumberClass(a, b);
    return this[getHelper](clazz).min(a, b);
  }

  static max(a, b) {
    const clazz = this.getHighestCommonNumberClass(a, b);
    return this[getHelper](clazz).max(a, b);
  }

  static [getHelper](clazz) {
    if (clazz === Number) {
      return NumberHelper.UNIVERSAL_NUMBER_HELPER;
    }
    throw new Error('Unsupported numeric type');
  }

  static getHighestCommonNumberClass(forceFloatingPoint, ...numbers) {
    const isNumber = Object.values(numbers).every(number => typeof number === 'number');
    return isNumber ? Number : undefined;
  }
}

export { NumberHelper }
