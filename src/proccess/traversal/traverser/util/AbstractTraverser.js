import { v4 } from 'uuid';
import { mixin } from '../../../../util';
import Traverser from '../../Traverser';
import { ReferenceFactory } from '../../../../structure/util/reference/ReferenceFactory';
import EmptyTraversalSideEffects from '../../util/EmptyTraversalSideEffects';
import EmptyPath from '../../util/EmptyPath';

/**
 * AbstractTraverser
 * @constructor
 */
function AbstractTraverser(t) {
  Traverser.call(this);
  this.t = t;
}

AbstractTraverser.prototype = {
  constructor: AbstractTraverser,
  merge(other) {
    throw ('This traverser does not support merging');
  },

  split(r, step) {
    const clone = this.clone();
    if (r !== undefined) clone.t = r;
    return clone;
  },

  addLabels() {

  },

  keepLabels() {

  },

  dropLabels() {

  },

  dropPath() {

  },


  setValue(t) {
    this.t = t;
  },

  incrLoops() {

  },

  resetLoops() {

  },

  getStepId() {
    throw ('This traverser does not support futures');
  },

  setStepId() {

  },

  setBulk() {

  },

  detach() {
    this.t = ReferenceFactory.detach(this.t);
    return this;
  },

  attach(method) {
    this.t = this.t.attach(method);
    return this.t;
  },


  getSideEffects() {
    return new EmptyTraversalSideEffects();
    // throw new UnsupportedOperationException("This traverser does not support sideEffects: " + this.getClass().getCanonicalName());
  },

  getValue() {
    if (!this.t) return null;
    const t = Object.keys(this.t).length === 1 ? this.t[Object.keys(this.t)[0]] : this.t;
    return t;
  },

  getSack() {
    throw ('This traverser does not support sacks');
  },


  getPath() {
    return new EmptyPath();
  },

  loops() {
    throw ('This traverser does not support loops');
  },

  setBulk() {
    return 1;
  },

  get(){
    return this.t;
  },

  clone() {
    return Object.assign(Object.create(this), this);
  },

  equals(object) {
    return object.merge && object.split && object.t() === this.t;
  },

  hashCode() {
    return this.t.hashCode ? this.t.hashCode() : this.t.toString();
  },

  toString() {
    return this.t.toString();
  }
};

mixin(AbstractTraverser, Traverser.prototype);

export default AbstractTraverser;