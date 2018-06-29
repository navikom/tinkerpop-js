import { mixin } from '../../../util';
import Edge from '../../Edge';
import Direction from '../../Direction';
import { IteratorUtils, Collections } from '../../../util';

import { ReferenceElement } from './ReferenceElement';
import { ReferenceVertex } from './ReferenceVertex';

function ReferenceEdge(edge) {
  ReferenceElement.call(this, edge);
  this._inVertex = new ReferenceVertex(edge.inVertex());
  this._outVertex = new ReferenceVertex(edge.outVertex());
  this._label = edge.label();
}

ReferenceEdge.prototype = {
  constructor: ReferenceEdge,
  property(key, value) {
    throw ('property Addition Not Supported');
  },

  remove() {
    throw ('edge Removal Not Supported');
  },

  vertices(direction) {
    switch (direction) {
      case Direction.OUT:
        return IteratorUtils.of(this._outVertex);
      case Direction.IN:
        return IteratorUtils.of(this._inVertex);
      default:
        return IteratorUtils.of(this._outVertex, this._inVertex);
    }
  },

  inVertex() {
    return this._inVertex;
  },

  outVertex() {
    return this._outVertex;
  },

  properties(...propertyKeys) {
    return Collections.emptyIterator();
  },

  label() {
    return this._label;
  },
};

mixin(ReferenceEdge, ReferenceElement.prototype, Edge.prototype);

export { ReferenceEdge };
