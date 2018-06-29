import Path from '../../Path';
import { List } from '../../../../util';

let INSTANCE = null;

/**
 * EmptyPath
 */
export default class EmptyPath extends Path {

  constructor() {
    super();
    if (!INSTANCE) {
      INSTANCE = this;
    }
    return INSTANCE;
  }

  size() {
    return 0;
  }

  extend(object, labels) {
    return this;
  }


  retract(labels) {
    return this;
  }

  getValue(label) {
    throw (`step With Provided Label (${label}) Does Not Exist`);
  }


  hasLabel(label) {
    return false;
  }

  objects() {
    return new List();
  }

  labels() {
    return new List();
  }

  isSimple() {
    return true;
  }

  clone() {
    return this;
  }

  equals(object) {
    return object instanceof EmptyPath;
  }

}
