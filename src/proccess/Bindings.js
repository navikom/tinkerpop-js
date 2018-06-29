import { Map } from '../util';

let INSTANCE = null;
const MAP = new Map();

/**
 * Bindings are used to associate a variable with a value.
 * They enable the creation of {@link process.traversal.Bytecode.Binding} arguments in {@link Bytecode}.
 * Use the Bindings instance when defining a binding via {@link Bindings#of(String, Object)}.
 * For instance:
 * <p>
 * <code>
 * b = Bindings.instance()
 * g = graph.traversal()
 * g.V().out(b.of("a","knows"))
 * // bindings can be reused over and over
 * g.V().out("knows").in(b.of("a","created"))
 * </code>
 * </p>
 */
class Bindings {

  constructor() {
    if (!INSTANCE) {
      INSTANCE = this;
    }
    return INSTANCE;
  }


  of(variable, value) {
    MAP.put(value, variable);
    return value;
  }

  static getBoundVariable(value) {
    return MAP.getValue(value);
  }


  static clear() {
    MAP.clear();
  }

  static instance() {
    return new Bindings();
  }
}

export default Bindings;
