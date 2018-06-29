import { Map, List, ArrayUtils, isNull } from '../../../../util';
import T from '../../../../structure/T';
import TraversalUtil from '../../util/TraversalUtil';
import DefaultGraphTraversal from '../../dsl/graph/DefaultGraphTraversal';

/**
 * Parameters
 */
export default class Parameters {
  constructor(parameters) {
    this.parameters = new Map();
  }

  /**
   * Set parameters given key/value pairs.
   */
  set(...keyValues) {
    keyValues = ArrayUtils.checkArray(keyValues);
    Parameters.legalPropertyKeyValueArray(keyValues);
    for (let i = 0; i < keyValues.length; i = i + 2) {
      if (keyValues[i + 1]) {
        let values = this.parameters.get(keyValues[i]);

        if (!values) {
          values = new List();
          values.add(keyValues[i + 1]);

          this.parameters.put(keyValues[i], values);
        } else {
          values.add(keyValues[i + 1]);
        }
      }
    }
  }

  /**
   * Checks for existence of key in parameter set.
   *
   * @param key the key to check
   * @return {@code true} if the key is present and {@code false} otherwise
   */
  contains(key) {
    return this.parameters.containsKey(key);
  }

  /**
   * Renames a key in the parameter set.
   *
   * @param oldKey the key to rename
   * @param newKey the new name of the key
   */
  rename(oldKey, newKey) {
    this.parameters.put(newKey, this.parameters.remove(oldKey));
  }

  get(traverser, key, defaultValue) {
    if (defaultValue) {
      const values = this.parameters.get(key);
      if (isNull(values)) return defaultValue();
      const result = new List();
      for (let i = 0; i < values.size(); i++) {
        const value = values.getValue(i);
        result.add(value instanceof DefaultGraphTraversal ? TraversalUtil.apply(traverser, value) : value);
      }
      return result;
    } else {
      const keyParam = traverser;
      const defaultValueParam = key;
      const list = this.parameters.getValue(keyParam);
      return isNull(list) ? new List(defaultValueParam.getValue()) : list;
    }
  }


  /**
   * Remove a key from the parameter set.
   *
   * @param key the key to remove
   * @return the value of the removed key
   */
  remove(key) {
    return this.parameters.remove(key);
  }

  getKeyValues(traverser, ...exceptKeys) {
    exceptKeys = ArrayUtils.checkArray(exceptKeys);
    if (this.parameters.size() === 0) return Parameters.EMPTY_ARRAY;
    const keyValues = new List();
    const iterator = this.parameters.keySet();
    while (iterator.hasNext()) {

      if (exceptKeys.indexOf(iterator.getKey()) === -1) {
        for (let i = 0; i < iterator.getValue().size(); i++) {
          const value = iterator.getValue().getValue(i);
          keyValues.add(iterator.getKey() instanceof DefaultGraphTraversal
            ? TraversalUtil.apply(traverser, iterator.getKey())
            : T.containsKey(iterator.getKey()) ? T[iterator.getKey()] : iterator.getKey());
          keyValues.add(value instanceof DefaultGraphTraversal ? TraversalUtil.apply(traverser, value) : value);
        }
      }
      iterator.next();
    }
    return keyValues.array;
  }

  /**
   * Gets an immutable set of the parameters without evaluating them in the context of a {@link Traverser} as
   * is done in {@link #getKeyValues(Traverser.Admin, Object...)}.
   *
   * @param exceptKeys keys to not include in the returned {@link Map}
   */
  getRaw(...exceptKeys) {
    if (this.parameters.isEmpty()) return new Map();
    const exceptions = new List(ArrayUtils.checkArray(exceptKeys));
    const raw = new Map();
    const entry = this.parameters.keySet();
    while (entry.hasNext()) {
      if (!exceptions.contains(entry.getKey())) raw.put(entry.getKey(), entry.getValue());
      entry.next();
    }
    return raw;
  }

  integrateTraversals(step) {
    const iterator = this.parameters.keySet();
    while (iterator.hasNext()) {
      const values = iterator.getValue();
      for (let i = 0; i < values.size(); i++) {
        const object = values.getValue(i);
        if (object instanceof DefaultGraphTraversal) {
          step.integrateChild(object);
        }
      }
      iterator.next();
    }
  }

  getTraversals() {
    const result = new List();
    const iterator = this.parameters.keySet();
    while (iterator.hasNext()) {
      const values = iterator.getValue();
      for (let i = 0; i < values.size(); i++) {
        const object = values.getValue(i);
        if (object instanceof DefaultGraphTraversal) {
          result.add(object);
        }
      }
      iterator.next();
    }
    return result;
  }

  static legalPropertyKeyValueArray(...propertyKeyValues) {
    propertyKeyValues = ArrayUtils.checkArray(propertyKeyValues);
    if (propertyKeyValues.length % 2 !== 0)
      throw("provided Key Values Must Be A Multiple Of Two");
    for (let i = 0; i < propertyKeyValues.length; i = i + 2) {
      if (!(typeof propertyKeyValues[i] === 'string')
        && !(T.contains(propertyKeyValues[i])) && !(propertyKeyValues[i] instanceof DefaultGraphTraversal))
        throw("The provided key/value array must have a String, T, or Traversal on even array indices");
    }
  }
}

Parameters.EMPTY_ARRAY = [];