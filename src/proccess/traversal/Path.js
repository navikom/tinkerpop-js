import { List } from '../../util';
import Pop from './Pop';
/**
 * A Path denotes a particular walk through a {@link Graph} as defined by a {@link Traversal}.
 * In abstraction, any Path implementation maintains two lists: a list of sets of labels and a list of objects.
 * The list of labels are the labels of the steps traversed. The list of objects are the objects traversed.
 * @constructor
 */
function Path() {

}

Path.prototype = {
  constructor: Path,
  type: Path.TYPE,
  /**
   * Get the number of step in the path.
   *
   * @return the size of the path
   */
  size() {
    return this.objects().size();
  },

  /**
   * Determine if the path is empty or not.
   *
   * @return whether the path is empty or not.
   */
  isEmpty() {
    return this.size() == 0;
  },

  /**
   * Get the head of the path.
   *
   * @param <A> the type of the head of the path
   * @return the head of the path
   */
  head() {
    return this.objects().getValue(this.size() - 1);
  },

  /**
   * Add a new step to the path with an object and any number of associated labels.
   *
   * @return the extended path
   */
  extend() {
    throw new Error('Must be overloaded');
  },


  /**
   * Remove labels from path.
   *
   * @param labels the labels to remove
   * @return the path with removed labels
   */
  retract(labels) {
    throw new Error('Must be overloaded');
  },

  /**
   * Get the object associated with the particular label of the path.
   * If the path as multiple labels of the type, then return a {@link List} of those objects.
   *
   * @param label the label of the path
   * @param <A>   the type of the object associated with the label
   * @return the object associated with the label of the path
   * @throws IllegalArgumentException if the path does not contain the label
   */
  //getValue(label) {
  //  const objects = this.objects();
  //  const labels = this.labels();
  //  let object = null;
  //  for (let i = 0; i < labels.size(); i++) {
  //    if (labels.getValue(i).contains(label)) {
  //      if (object === null) {
  //        object = objects.getValue(i);
  //      } else {
  //        const list = new List();
  //        list.add(object);
  //        list.add(objects.get(i));
  //        object = list;
  //      }
  //    }
  //  }
  //  if (object === null) { throw (`step With Provided Label (${label}) Does Not Exist`); }
  //  return object;
  //},

  /**
   * Pop the object(s) associated with the label of the path.
   *
   * @param pop   first for least recent, last for most recent, and all for all in a list
   * @param label the label of the path
   * @param <A>   the type of the object associated with the label
   * @return the object associated with the label of the path
   * @throws IllegalArgumentException if the path does not contain the label
   */
  getValue(pop, label) {
    if (label) {
      if (Pop.mixed === pop) {
        return this.getValue(label);
      } else if (Pop.all === pop) {
        if (this.hasLabel(label)) {
          const object = this.getValue(label);
          if (object instanceof List) {
            return object;
          }

          return new List([object]);
        }
        return new List();
      }
      const object = this.getValue(label);
      if (object instanceof List) {
        return Pop.last == pop ? object.getValue(object.size() - 1) : object.getValue(0);
      } return object;
    } else if (!isNaN(pop)) {
      return this.objects().getValue(index);
    }
    const objects = this.objects();
    const labels = this.labels();
    let object = null;
    for (let i = 0; i < labels.size(); i++) {
      if (labels.getValue(i).contains(pop)) {
        if (!object) {
          object = objects.getValue(i);
        } else {
          const list = new List();
          list.add(object);
          list.add(objects.get(i));
          object = list;
        }
      }
    }
    if (object === null) { throw (`step With Provided Label (${label}) Does Not Exist`); }
    return object;
  },


  /**
   * Return true if the path has the specified label, else return false.
   *
   * @param label the label to search for
   * @return true if the label exists in the path
   */
  hasLabel(label) {
    return this.labels().filter(labels => labels.contains(label)).isPresent();
  },

  /**
   * An ordered list of the objects in the path.
   *
   * @return the objects of the path
   */
  objects() {
    throw new Error('Must be overloaded');
  },

  /**
   * An ordered list of the labels associated with the path
   * The set of labels for a particular step are ordered by the order in which {@link Path#extend(Object, Set)} was called.
   *
   * @return the labels of the path
   */
  labels() {
    throw new Error('Must be overloaded');
  },

  clone() {
    throw new Error('Must be overloaded');
  },

  /**
   * Determines whether the path is a simple or not.
   * A simple path has no cycles and thus, no repeated objects.
   *
   * @return Whether the path is simple or not
   */
  isSimple() {
    const objects = this.objects();
    for (let i = 0; i < objects.size() - 1; i++) {
      for (let j = i + 1; j < objects.size(); j++) {
        if (objects.getValue(i) === objects.getValue(j)) { return false; }
      }
    }
    return true;
  },

  iterator() {
    return this.objects().iterator();
  },

  forEach(consumer) {
    const objects = this.objects();
    const labels = this.labels();

    for (let i = 0; i < objects.size(); i++) {
      consumer(objects.get(i), labels.get(i), i);
    }
  },

  // todo
  stream() {
    const labels = this.labels();
    const objects = this.objects();
    return null;
  },

  // todo
  popEquals(pop, other) {
    if (!(other instanceof Path)) { return false; }
    const otherPath = other;
    return null;
  },
};

Path.TYPE = 'Path'

export default Path;
