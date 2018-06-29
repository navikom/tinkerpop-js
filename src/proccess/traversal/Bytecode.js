import { Map, ArrayUtils } from '../../util';
import Bindings from '../Bindings';
//import Traversal from '../traversal/Traversal';

/**
 * When a {@link TraversalSource} is manipulated and then a {@link Traversal} is spawned and mutated, a language
 * agnostic representation of those mutations is recorded in a bytecode instance. Bytecode is simply a list
 * of ordered instructions where an instruction is a string operator and a (flattened) array of arguments.
 */
class Bytecode {

  constructor() {
    this.stepInstructions = [];
    this.sourceInstructions = [];
  }

  /**
   * Add a {@link TraversalSource} instruction to the bytecode.
   *
   * @param sourceName the traversal source method name (e.g. withSack())
   * @param arguments  the traversal source method arguments
   */
  addSource(sourceName, ...args) {
    args = ArrayUtils.checkArray(args);
    this.sourceInstructions.push(new Instruction(sourceName, Bytecode.flattenArguments(args)));
    Bindings.clear();
  }

  /**
   * Add a {@link Traversal} instruction to the bytecode.
   *
   * @param stepName  the traversal method name (e.g. out())
   * @param arguments the traversal method arguments
   */
  addStep(stepName, ...args) {
    args = ArrayUtils.checkArray(args);
    this.stepInstructions.push(new Instruction(stepName, Bytecode.flattenArguments(args)));

    Bindings.clear();
  }

  static flattenArguments(args) {
    if (!args || args.length === 0) { return Bytecode.EMPTY_ARRAY; }
    const flatArguments = [];
    for (const object in args) {
      if (args[object] instanceof Array) {
        for (const nestObject in object) {
          flatArguments.push(Bytecode.convertArgument(object[nestObject], true));
        }
      } else {
        flatArguments.push(Bytecode.convertArgument(args[object], true));
      }
    }
    return flatArguments;
  }

  static convertArgument(argument, searchBindings) {
    if (searchBindings) {
      const variable = Bindings.getBoundVariable(argument);
      if (undefined !== variable) {
        return new Binding(variable, Bytecode.convertArgument(argument, false));
      }
    }
    //

    if (argument.propType) {
      return argument.asAdmin().getBytecode();
    } else if (argument instanceof Map) {
      const map = new Map();
      for (const key in argument) {
        map.put(Bytecode.convertArgument(key, true), Bytecode.convertArgument(argument[key], true));
      }
      return map;
    } else if (argument instanceof Array) {
      const list = [];
      for (const key in argument) {
        list.push(Bytecode.convertArgument(argument[key], true));
      }
      return list;
    }
    return argument;
  }

  cloneInstructions(array) {
    const newArray = [];
    array.map(one => newArray.push(one.clone()));
    return newArray;
  }

  clone() {
    try {
      const clone = Object.assign(Object.create(this), this);
      clone.sourceInstructions = this.cloneInstructions(this.sourceInstructions);
      clone.stepInstructions = this.cloneInstructions(this.stepInstructions);
      return clone;
    } catch (e) {
      throw new Error(e);
    }
  }
}

Bytecode.EMPTY_ARRAY = [];

class Instruction {
  /**
   *
   * @param operator
   * @param arguments
   */
  constructor(operator, args) {
    this.operator = operator;
    this.arguments = args;
  }

  clone() {
    return Object.assign(Object.create(this), this);
  }
}

class Binding {
  /**
   *
   * @param key
   * @param value
   */
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }

  variable() {
    return this.key;
  }

  value() {
    return this.value;
  }
}

export default Bytecode;