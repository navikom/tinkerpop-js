import { Iterator, IteratorMap, List } from './';

export class Collections {
  static emptyIterator() {
    return new Iterator([]);
  }

  static emptySet() {
    return new IteratorMap({});
  }

  static addAll(c, elements) {
    for (let i = 0; i < elements.length; i++) {
      c.add(elements[i]);
    }
  }

  static shuffle(a) {
    if(a instanceof List) a.shuffle();
  }

  static sort(list, c){
    list.sort(c);
  }

  static putMultiMap(hashSet, key, value){
    let list = hashSet.getValue(key);
    if (!list) {
      list = new List();
      hashSet.put(key, list);
    }
    list.add(value);
  }
}
