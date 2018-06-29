import { Map, List, ObjectMap, BulkIterator, isNull } from '../../../../util';

/**
 * BulkSet
 * @param traversal
 * @constructor
 */
function BulkSet(traversal) {
  this.map = new ObjectMap();
}
BulkSet.prototype = {
  constructor: BulkSet,

  size() {
    return this.longSize();
  },

  uniqueSize() {
    return this.map.size();
  },

  longSize() {
    return this.map.size();
  },

  isEmpty() {
    return this.map.isEmpty();
  },

  contains(s) {
    return this.map.containsKey(s);
  },

  addAll(collection) {
    if (collection instanceof BulkSet) {
      collection.map.forEach((entity) => this.add(entity));
    } else {
      collection.iterator().forEachRemaining((entity) => this.add(entity));
    }
    return true;
  },

  forEach(consumer) {
    this.map.forEach(consumer);
  },

  asBulk() {
    return this.map;
  },

  add(s, bulk) {
    if (bulk) {
      const current = this.map.getValue(s);

      if (!isNull(current)) {
        this.map.put(s, current + bulk);
        return false;
      } else {
        this.map.put(s, bulk);
        return true;
      }
    } else {
      return this.add(s, 1);
    }

  },

  getValue(s) {
    const bulk = this.map.getValue(s);
    return !bulk ? 0 : bulk;
  },

  /*public void set(final S s, final long bulk) {
   this.map.remove(s);
   this.map.put(s, bulk);
   }*/

  remove(s) {
    return this.map.remove(s) !== null;
  },

  clear() {
    this.map.clear();
  },

  spliterator() {
    return this.toList().spliterator();
  },

  removeAll(collection) {
    let modified = false;
    for (let i = 0; i < collection.size(); i++) {
      const object = collection.getValue(i);
      if (this.map.remove(object))
        modified = true;
    }
    return modified;
  },

  toString() {
    const  it = this.map.keys().iterator();
    const values = this.map.values();
    if (!it.hasNext())
      return "[]";
    const sb = [];
    sb.push('[');
    for (;;) {
      const value = values.get(it.cursor);
      let e = it.next();
      for(let i = 0; i < value; i++){
        sb.push(e === this ? "(this Collection)" : e);
        if (!it.hasNext() && i === value - 1){
          sb.push(']');
          return sb.join('');
        }
        sb.push(', ');
      }
    }
  },

  toList() {
    const list = new List();
    this.map.forEach((k, v) => {
      for (let i = 0; i < v; i++) {
        list.add(k);
      }
    });
    return list;
  },

  iterator() {
    return new BulkIterator(this.map)
  }

};


export default BulkSet;

