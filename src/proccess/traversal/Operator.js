import NumberHelper from '../../util/NumberHelper';

class sum {
  apply(a, b) {
    return NumberHelper.add(a, b);
  }
  toString(){
    return this.constructor.name;
  }
}

class minus {
  apply(a, b) {
    return NumberHelper.sub(a, b);
  }
  toString(){
    return this.constructor.name;
  }
}

class mult {
  apply(a, b) {
    return NumberHelper.mul(a, b);
  }
  toString(){
    return this.constructor.name;
  }
}

class div {
  apply(a, b) {
    return NumberHelper.div(a, b);
  }
  toString(){
    return this.constructor.name;
  }
}

class min {
  apply(a, b) {
    return NumberHelper.min(a, b);
  }
  toString(){
    return this.constructor.name;
  }
}

class max {
  apply(a, b) {
    return NumberHelper.max(a, b);
  }
  toString(){
    return this.constructor.name;
  }
}

class assign {
  apply(a, b) {
    return b;
  }
  toString(){
    return this.constructor.name;
  }
}

class and {
  apply(a, b) {
    return a && b;
  }
  toString(){
    return this.constructor.name;
  }
}

class or {
  apply(a, b) {
    return a || b;
  }
  toString(){
    return this.constructor.name;
  }
}

class addAll {
  apply(a, b) {
    if (a instanceof Map)
      a.putAll(b);
    else
      a.addAll(b);
    return a;
  }
  toString(){
    return this.constructor.name;
  }
}

class sumLong {
  apply(a, b) {
    return a + b;
  }
  toString(){
    return this.constructor.name;
  }
}
const Operator = {
  sum: new sum(),
  minus: new minus(),
  mult: new mult(),
  div: new div(),
  min: new min(),
  max: new max(),
  assign: new assign(),
  and: new and(),
  or: new or(),
  addAll: new addAll(),
//////
  sumLong: new sumLong()
};

export default Operator;
export { Operator }
