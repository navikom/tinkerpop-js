import { Map } from './Map';
import { List } from './List';

/**
 * Iterator
 */
export class Iterator {

  constructor(array) {
    this.cursor = 0;
    this.array = array || [];
  }

  hasNext() {
    return this.cursor < this.size();
  }

  getValue() {
    if (this.size() === 0) return;
    return Object.keys(this.array[this.cursor]).includes('value') ? this.array[this.cursor].value : this.array[this.cursor];
  }

  next() {
    if (!this.hasNext()) return;
    return this.array[this.cursor++];
  }

  size() {
    return this.array.length;
  }

  getKey(){
    return this.array[this.cursor].key;
  }

  filter(callback) {
    const list = new List();
    while (this.hasNext()) {
      if (callback(this)) {
        list.add(this.getValue());
      }
      this.next()
    }

    return list;
  }

  toArray(){
    return this.array;
  }

  map(callback){
    const list = new List();
    while (this.hasNext()){
      list.add(callback(this.next()));
    }
    return list;
  }

  forEachRemaining(callback) {
    while (this.hasNext()) {
      callback(this.next());
    }
  }
}

/**
 * IteratorMap
 */
export class IteratorMap {

  constructor(object) {
    this.cursor = 0;
    this.object = object || {};
  }

  hasNext() {
    return this.cursor < this.size();
  }

  next() {
    if (!this.hasNext()) return;

    return { [Object.keys(this.object)[this.cursor]]: this.object[Object.keys(this.object)[this.cursor++]] };
  }

  size() {
    return Object.keys(this.object).length;
  }

  getKey() {
    return Object.keys(this.object)[this.cursor];
  }

  contains(key){
    return key in this.object;
  }

  getValue() {
    return this.object[Object.keys(this.object)[this.cursor]];
  }

  remove() {
    if(!this.hasNext()) return null;
    const value = this.object[Object.keys(this.hashMap)[this.cursor]];
    delete this.object[Object.keys(this.hashMap)[this.cursor]];
    return value;
  }

  filter(callback) {
    const map = new Map();
    while (this.hasNext()) {
      if (callback(this)) { map.put(this.getKey(), this.getValue()); }
      this.next();
    }

    return map;
  }

  forEachRemaining(callback) {
    while (this.hasNext()) {
      callback(this);
      this.next();
    }
  }
}

/**
 * IteratorNextCallback
 */
export class IterateIterator extends Iterator {

  constructor() {
    super([]);
    this.iterator = new Iterator();
    this.callbackNext = () => {};
  }

  setHasNext(iterator) {
    this.iterator = iterator;
  }

  hasNext(iterator) {
    return this.iterator.hasNext();
  }

  setNext(callback) {
    this.callbackNext = callback;
  }

  next() {
    if (!this.hasNext()) return;
    return this.callbackNext();
  }

}

export class BulkIterator {
  constructor(map) {
    //super(map.hashMap);
    this.lastObject = null;
    this.lastCount = 0;
    this.entryIterator = map.keySet();
  }
  hasNext() {
    return this.lastCount > 0 || this.entryIterator.hasNext();
  }

  next() {
    if (this.lastCount > 0) {
      this.lastCount--;
      return this.lastObject;
    }
    const entry = this.entryIterator.next();
    if (entry.getValue() === 1) {
      return entry.getKey();
    } else {
      this.lastObject = entry.getKey();
      this.lastCount = entry.getValue() - 1;
      return this.lastObject;
    }
  }
}

export class RemoveIterator extends Iterator {

	constructor(iterator) {
    super(iterator.array);
    this.iterator = iterator
  }

  remove(){
    this.iterator.remove();
  }
}

export class ConcurrentIterator extends Iterator {

	constructor(array) {
    super(array);

  }

  getKey() {
    return this.array[this.cursor].key;
  }

  contains(key){
    return this.keys().includes(key);
  }

  keys(){
    return this.array.map((kv) => kv.key);
  }

  values(){
    return this.array.map((kv) => kv.value);
  }

  getValue() {
    return this.array[this.cursor].value;
  }

  remove() {
    const value = this.array[this.cursor];
    this.array.splice(this.cursor, 1);
    if(this.cursor >= this.size()) {
      this.cursor = Math.max(0, this.size() - 1);
    }
    return value;
  }

  filter(callback) {
    const map = new Map();
    while (this.hasNext()) {
      if (callback(this)) { map.put(this.getKey(), this.getValue()); }
      this.next();
    }
    return map;
  }

  forEachRemaining(callback) {
    while (this.hasNext()) {
      callback(this);
      this.next();
    }
  }
}