import P from '../../P';
import T from '../../../../structure/T';
import VertexProperty from '../../../../structure/VertexProperty';
import Vertex from '../../../../structure/Vertex';

/**
 * HasContainer
 */
export default class HasContainer {
  constructor(key, predicate) {
    this._key = key;
    this._predicate = predicate;
    this.testingIdString = false;

    if (this._key !== T.id.getAccessor()) { this.testingIdString = false; }
    else {
      // the values should be homogenous if a collection is submitted
      const predicateValue = this._predicate.getValue();

      // enforce a homogenous collection of values when testing ids
      // enforceHomogenousCollectionIfPresent(predicateValue);

      // grab an instance of a value which is either the first item in a homogeneous collection or the value itself
      const valueInstance = this._predicate.getValue();
      // if the key being evaluated is id then the has() test can evaluate as a toString() representation of the
      // identifier.  this could be done in the test() method but it seems cheaper to do the conversion once in
      // the constructor.  the original value in P is maintained separately
      this.testingIdString = this._key === T.id.getAccessor() && typeof valueInstance === 'string';
      if (this.testingIdString) { this._predicate.setValue(this._predicate.getValue() + ''); }
    }
  }


  test(element) {

    // it is OK to evaluate equality of ids via toString(), given that the test suite enforces the value of
    // id().toString() to be a first class representation of the identifier. a string test is only executed
    // if the predicate value is a String.  this allows stuff like: g.V().has(id,lt(10)) to work properly
    if (this._key === T.id.getAccessor()) {
      return this.testingIdString ? this.testIdAsString(element) : this.testId(element); }
    else if (this._key === T.label.getAccessor()) { return this.testLabel(element); }
    else if (element.type === VertexProperty.TYPE && this._key === T.value.getAccessor()) {

      return this.testValue(element); }
    else if (element.type === VertexProperty.TYPE && this._key === T.key.getAccessor()) {
      return this.testKey(element);
    }

    if (element.type === Vertex.TYPE) {
      const itty = element.properties(this._key);
      while (itty.hasNext()) {
        if (this.testValue(itty.next())) { return true; }
      }
      return false;
    }
    const property = element.property(this._key);
    return property.isPresent() && this.testValue(property);
  }

  testId(element) {

    return this._predicate.test(element.id());
  }

  testIdAsString(element) {
    return this._predicate.test(element.id() + '');
  }

  testLabel(element) {
    //console.log(this._predicate, element, element.label())
    return this._predicate.test(element.label());
  }

  // testing predicates here
  testValue(property) {
    return this._predicate.test(property.value());
  }

  testKey(property) {
    return this._predicate.test(property.key());
  }


  toString() {
    return `${this._key}.${this._predicate}`;
  }

  key() {
    return this._key;
  }

  getKey() {
    return this._key;
  }

  setKey(key) {
    this._key = key;
  }

  predicate() {
    return this._predicate;
  }

  getPredicate() {
    return this._predicate;
  }

  getBiPredicate() {
    return this._predicate.getBiPredicate();
  }

  getValue() {
    return this._predicate.getValue();
  }

  toString() {
    return this._key + '.' + this._predicate;
  }

// //////////

// private void enforceHomogenousCollectionIfPresent(predicateValue) {
//      let first = predicateValue[0];
//    }
//    if (!predicateValue.map(Object::getClass).allMatch(c -> first.equals(c)))
//    throw("Has comparisons on a collection of ids require ids to all be of the same type");
// }
  clone() {
    const clone = Object.assign(Object.create(this), this);
    clone._predicate = this._predicate.clone();
    return clone;
  }

  static testAll(element, hasContainers) {
    for (let i = 0; i < hasContainers.size(); i++) {
      //console.log('testAll', hasContainers.getValue(i), element)
      if (!hasContainers.getValue(i).test(element)) {
        return false;
      }
    }
    return true;
  }
}
