import { mixin } from '../../../util';
import Vertex from '../../Vertex';
import { ReferenceElement } from '../reference/ReferenceElement';
import { Collections } from '../../../util';

/**
 * ReferenceVertex
 * @param vertex
 * @constructor
 */
function ReferenceVertex(vertex) {
  ReferenceElement.call(this, vertex);
}

ReferenceVertex.prototype = {
  constructor: ReferenceVertex,
  addEdge(label, inVertex, ...keyValues) {
    throw ('edge Additions Not Supported');
  },

  property() {
    throw ('edge Additions Not Supported');
  },

  edges(direction, ...edgeLabels) {
    return Collections.emptyIterator();
  },

  vertices(direction, ...edgeLabels) {
    return Collections.emptyIterator();
  },

  properties(...propertyKeys) {
    return Collections.emptyIterator();
  },

  remove() {
    throw ('vertex Removal Not Supported');
  },
};

mixin(ReferenceVertex, ReferenceElement.prototype, Vertex.prototype);

export { ReferenceVertex };
