import { mixin, List, isNull } from '../../../../util';
import Path from '../../Path';
import Pop from '../../Pop';

/**
 * MutablePath
 * @constructor
 */
function MutablePath() {
  this._objects = new List();
  this._labels = new List();
}

MutablePath.prototype = {
  constructor: MutablePath,
  isEmpty() {
    return this._objects.isEmpty();
  },

  head() {
    return this._objects.getValue(this._objects.size() - 1);
  },

  size() {
    return this._objects.size();
  },

  extend(object, labels) {
    if(labels){
      this._objects.add(object);
      this._labels.add(labels);
      return this;
    } else {
      labels = object;
      if (!labels.isEmpty() && !this._labels.get(this._labels.size() - 1).containsAll(labels))
        this._labels.get(this._labels.size() - 1).addAll(labels);
      return this;
    }

  },

  retract(removeLabels) {
    for (let i = this._labels.size() - 1; i >= 0; i--) {
      this._labels.get(i).removeAll(removeLabels);
      if (this._labels.get(i).isEmpty()) {
        this._labels.remove(i);
        this._objects.remove(i);
      }
    }
    return this;
  },

  get(index, label) {
    if (!isNull(label)) {
      const pop = index;
      if (Pop.mixed === pop) {
        return this.getValue(label);
      } else if (Pop.all === pop) {
        if (this.hasLabel(label)) {
          const object = this.get(label);
          if (object instanceof List)
            return object;
          else
            return new List([object]);
        } else {
          return new List();
        }
      } else {
        // Override default to avoid building temporary list, and to stop looking when we find the label.
        if (Pop.last === pop) {
          for (let i = this._labels.size() - 1; i >= 0; i--) {
            if (this._labels.get(i).contains(label))
              return this._objects.get(i);
          }
        } else {
          for (let i = 0; i < this._labels.size(); i++) {
            if (this._labels.get(i).contains(label))
              return this._objects.get(i);
          }
        }
        throw (`step With Provided Label Does Not Exist (${label})`);
      }
    } else {
      return this._objects.get(index);
    }

  },

  hasLabel(label) {
    for (let i = 0; i < this._labels.size(); i++) {
      if (this._labels.contains(label)) {
        return true;
      }
    }
    return false;
  },

  objects() {
    return this._objects;
  },

  labels() {
    return this._labels;
  },

  iterator() {
    return this._objects.iterator();
  },

  toString() {
    return this._objects.toString();
  }
};

mixin(MutablePath, Path.prototype);

MutablePath.make = () => new MutablePath();

export default MutablePath;
