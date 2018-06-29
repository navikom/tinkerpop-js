import Vertex from '../../Vertex';
import Edge from '../../Edge';
import Property from '../../Property';
import VertexProperty from '../../VertexProperty';
import Path from '../../../proccess/traversal/Path';
import {
  ReferenceEdge,
  ReferenceElement,
  ReferencePath,
  ReferenceProperty,
  ReferenceVertex,
  ReferenceVertexProperty,
} from './';

export class ReferenceFactory {

  constructor() {
  }

  static detach(element) {
    if (element.type === Vertex.TYPE) {
      return element instanceof ReferenceVertex ? element : new ReferenceVertex(element);
    } else if (element.type === Edge.TYPE) {
      return element instanceof ReferenceEdge ? element : new ReferenceEdge(element);
    } else if (element.propType === Property.TYPE) {
      return element instanceof ReferenceProperty ? element : new ReferenceProperty(element);
    } else if (element.type === VertexProperty.TYPE) {
      return element instanceof ReferenceVertexProperty ? element : new ReferenceVertexProperty(element);
    } else if (element.type === Path.TYPE) {
      return element instanceof ReferencePath ? element : new ReferencePath(element);
    }
  }
}
