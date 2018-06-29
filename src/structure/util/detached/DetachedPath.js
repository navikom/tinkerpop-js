import { mixin, Collections, ArrayUtils } from '../../../util';
import Path from '../../../proccess/traversal/Path';
import MutablePath from '../../../proccess/traversal/step/util/MutablePath';
import Element from '../../Element';
import Vertex from '../../Vertex';
import Property from '../../Property';
import ElementHelper from '../ElementHelper';
import { DetachedElement } from './DetachedElement';
import { DetachedProperty } from './DetachedProperty';
import { DetachedFactory } from './DetachedFactory';

/**
 * DetachedPath
 * @param path
 * @param withProperties
 * @constructor
 */
function DetachedPath(path, withProperties) {
  MutablePath.call(this);
  path.forEach((object, labels) => {
    if (object instanceof DetachedElement || object instanceof DetachedProperty || object instanceof DetachedPath) {
      this._objects.add(object);
    } else if (object instanceof Element) {
      this._objects.add(DetachedFactory.detach(object, withProperties));
    } else if (object instanceof Property) {
      this._objects.add(DetachedFactory.detach(object));
    } else if (object instanceof Path) {
      this._objects.add(DetachedFactory.detach(object, withProperties));
    } else {
      this._objects.add(object);
    }
    //Make a copy of the labels as its an UnmodifiableSet which can not be serialized.
    this._labels.add(new List([labels]));
  });
}

DetachedPath.prototype = {
  constructor: DetachedPath,
  attach(method) {
    const path = MutablePath.make();
    this.forEach(
      (object, labels) => path.extend(object.attach ? object.attach(method) : object, labels)
    );
    return path;
  }
};

mixin(DetachedPath, MutablePath.prototype);

export { DetachedPath }
