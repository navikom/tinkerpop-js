import { Map, HashSet, List } from '../../util';
import Vertex from '../../structure/Vertex';
import Edge from '../../structure/Edge';

/**
 * TinkerIndex
 */
export class TinkerIndex {

  /**
   *
   * @param graph
   * @param indexClass
   */
  constructor(graph, indexClass) {
    this.graph = graph;
    this.indexClass = indexClass;
    this.index = new Map();
    this.indexedKeys = new HashSet();
  }

  put(key, value, element) {
    let keyMap = this.index.get(key);
    if (!keyMap) {
      keyMap = new Map();
      this.index.put(key, keyMap);
    }
    let objects = keyMap.get(value);
    if (!objects) {
      objects = new HashSet();
      keyMap.put(value, objects);
    }
    objects.add(element);
  }

  getValue(key, value) {
    const keyMap = this.index.getValue(key);
    if (!keyMap) {
      return new List();
    }
    const sets = keyMap.get(value);
    if (!sets) { return new List(); }
    return new List(sets);
  }

  count(key, value) {
    const keyMap = this.index.get(key);
    if (!keyMap) {
      return 0;
    }
    const sets = keyMap.get(value);
    if (!sets) { return 0; }
    return sets.size();
  }

  remove(key, value, element) {
    const keyMap = this.index.get(key);
    if (!keyMap) {
      const objects = keyMap.get(value);
      if (!objects) {
        objects.remove(element);
        if (objects.size() == 0) {
          keyMap.remove(value);
        }
      }
    }
  }

  removeElement(element) {
    if (this.indexClass === element) {
      const iterator = this.index.keySet();
      while (iterator.hasNext()) {
        const iterator2 = iterator.getValue().iterator();
        while (iterator2.hasNext()) {
          iterator2.next().remove(element);
        }
        iterator.next();
      }
    }
  }

  autoUpdate(key, newValue, oldValue, element) {
    if (this.indexedKeys.contains(key)) {
      if (oldValue != null) { this.remove(key, oldValue, element); }
      this.put(key, newValue, element);
    }
  }

  autoRemove(key, oldValue, element) {
    if (this.indexedKeys.contains(key)) { this.remove(key, oldValue, element); }
  }

  createKeyIndex(key) {
    if (!key) { throw ('argument (key) Can Not Be Null'); }
    if (key.isEmpty()) { throw ('The key for the index cannot be an empty string'); }

    if (this.indexedKeys.contains(key)) { return; }
    this.indexedKeys.add(key);

    (Vertex === this.indexClass) ?
  this.graph.vertices :
  this.graph.edges
  .map(e => e.property(key))
.filter(a => a[0].isPresent())
.forEach(a => this.put(key, a[0].getValue()));
  }

  dropKeyIndex(key) {
    if (this.index.containsKey(key)) { this.index.remove(key).clear(); }

    this.indexedKeys.remove(key);
  }

  getIndexedKeys() {
    return this.indexedKeys;
  }
}
