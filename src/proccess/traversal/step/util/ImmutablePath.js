import { mixin, List, isNull } from '../../../../util';
import Path from '../../Path';
import Pop from '../../Pop';


/**
 * ImmutablePath
 * @param previousPath
 * @param currentObject
 * @param currentLabels
 * @constructor
 */
function ImmutablePath(previousPath, currentObject, currentLabels) {
  this.previousPath = previousPath;
  this.currentObject = currentObject;
  this.currentLabels = currentLabels;
}

ImmutablePath.prototype = {
  constructor: ImmutablePath,

  isTail() {
    return this.currentObject == null;
  },

  isEmpty() {
    return this.isTail();
  },

  size() {
    let counter = 0;
    let currentPath = this;
    while (true) {
      if (currentPath.isTail()) return counter;
      counter++;
      currentPath = currentPath.previousPath;
    }
  },

  head() {
    return this.currentObject;
  },

  clone() {
    return this;
  },

  extend(object, labels) {

    if (labels) {
      return new ImmutablePath(this, object, labels);
    } else {
      labels = object;
    }

    if (labels.isEmpty() || this.currentLabels.containsAll(labels)) {
      return this;
    }
    //console.log('extend', this, this.previousPath, this.currentObject);
    const newLabels = new List();
    newLabels.addAll(this.currentLabels);
    newLabels.addAll(labels);
    return new ImmutablePath(this.previousPath, this.currentObject, newLabels);
  },

  retract(labels) {
    if (labels.isEmpty()) { return this; }

  // get all the immutable path sections
    const immutablePaths = new List();
    let currentPath = this;
    while (true) {
      if (currentPath.isTail()) { break; }
      immutablePaths.add(0, currentPath);
      currentPath = currentPath.previousPath;
    }
  // build a new immutable path using the respective path sections that are not to be retracted
    let newPath = TAIL_PATH;
    for (let i = 0; i < immutablePaths.size(); i++) {
      const immutablePath = immutablePaths.get(i);
      const temp = immutablePath.currentLabels;
      temp.removeAll(labels);
      if (!temp.isEmpty()) { newPath = newPath.extend(immutablePath.currentObject, temp); }
    }
    return newPath;
  },

  get(index, label) {
    if (!isNull(label)) {
      if (Pop.mixed === index) {
        return this.get(label);
      } else if (Pop.all === index) {
      // Recursively build the list to avoid building objects/labels collections.
        const list = new List();
        let currentPath = this;
        while (true) {
          if (currentPath.isTail()) {
            break;
          } else if (currentPath.currentLabels.contains(label)) {
            list.add(0, currentPath.currentObject);
          }
          currentPath = currentPath.previousPath;
        }
        return list;
      } else if (Pop.last === index) {
        let currentPath = this;
        while (true) {
          if (currentPath.isTail()) {
            throw (`step With Provided Label (${label}) Does Not Exist`);
          } else if (currentPath.currentLabels.contains(label)) {
            return currentPath.currentObject;
          } else { currentPath = currentPath.previousPath; }
        }
      } else { // Pop.first
        let found = null;
        let currentPath = this;
        while (true) {
          if (currentPath.isTail()) {
            break;
          } else if (currentPath.currentLabels.contains(label)) {
            found = currentPath.currentObject;
          }
          currentPath = currentPath.previousPath;
        }
        if (isNull(found)) {
          throw (`step With Provided Label (${label}) Does Not Exist`);
        }
        return found;
      }
    } else {
      let counter = this.size();
      let currentPath = this;
      while (true) {
        if (index === --counter) {
          return currentPath.currentObject;
        }
        currentPath = currentPath.previousPath;
      }
    }
  },

  hasLabel(label) {
    let currentPath = this;
    while (true) {
      if (currentPath.isTail()) { return false; } else if (currentPath.currentLabels.contains(label)) { return true; }
      currentPath = currentPath.previousPath;
    }
  },

  objects() {
    const objects = new List();
    let currentPath = this;
    while (true) {
      if (currentPath.isTail()) { break; }
      objects.add(0, currentPath.currentObject);
      currentPath = currentPath.previousPath;
    }
    return objects;
  },

  labels() {
    const labels = new List();
    let currentPath = this;
    while (true) {
      if (currentPath.isTail()) { break; }
      labels.add(0, currentPath.currentLabels);
      currentPath = currentPath.previousPath;
    }
    return labels;
  },


  popEquals(pop, other) {
    if (!(other instanceof Path)) { return false; }
    const otherPath = other;
    let currentPath = this;
    while (true) {
      if (currentPath.isTail()) { break; }
      for (let i = 0; i < currentPath.currentLabels.size(); i++) {
        const label = currentPath.currentLabels.getValue(i);
        if (!otherPath.hasLabel(label) || this.getValue(pop, label) !== otherPath.getValue(pop, label)) { return false; }
      }
      currentPath = currentPath.previousPath;
    }
    return true;
  },

  isSimple() {
    const objects = new List();
    let currentPath = this;
    while (true) {
      if (currentPath.isTail()) { return true; } else if (objects.contains(currentPath.currentObject)) { return false; }

      objects.add(currentPath.currentObject);
      currentPath = currentPath.previousPath;
    }
  },

  toString() {
    return this.objects().toString();
  }
};

mixin(ImmutablePath, Path.prototype);

const TAIL_PATH = new ImmutablePath(null, null, null);
ImmutablePath.make = () => {

  return TAIL_PATH;
};

export default ImmutablePath;
