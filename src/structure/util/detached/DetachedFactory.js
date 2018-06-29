import Vertex from '../../Vertex';
import Edge from '../../Edge';
import Property from '../../Property';
import VertexProperty from '../../VertexProperty';
import Path from '../../../proccess/traversal/Path';
import { DetachedVertex } from './DetachedVertex';
import { DetachedEdge } from './DetachedEdge';
import { DetachedVertexProperty } from './DetachedVertexProperty';
import { DetachedProperty } from './DetachedProperty';
import { DetachedPath } from './DetachedPath';

/**
 * DetachedFactory
 */
export class DetachedFactory {
  static detachVertex(vertex, withProperties) {
    return vertex instanceof DetachedVertex ? vertex : new DetachedVertex(vertex, withProperties);
  }

  static detachEdge(edge, withProperties) {
    return edge instanceof DetachedEdge ? edge : new DetachedEdge(edge, withProperties);
  }

  static detachVertexProperty(vertexProperty, withProperties) {
    return vertexProperty instanceof DetachedVertexProperty ? vertexProperty : new DetachedVertexProperty(vertexProperty, withProperties);
  }

  static detachProperty(property) {
    return property instanceof DetachedProperty ? property : new DetachedProperty(property);
  }

  static detachPath(path, withProperties) {
    return path instanceof DetachedPath ? path : new DetachedPath(path, withProperties);
  }


  static detach(element, withProperties) {
    if (element.type === Vertex.TYPE) {
      return DetachedFactory.detachVertex(element, withProperties);
    } else if (element.type === Edge.TYPE) {
      return DetachedFactory.detachEdge(element, withProperties);
    } else if (element.propType === Property.TYPE) {
      return DetachedFactory.detachProperty(element, withProperties);
    } else if (element.type === VertexProperty.TYPE) {
      return DetachedFactory.detachVertexProperty(element, withProperties);
    } else if (element.type === Path.TYPE) {
      return DetachedFactory.detachPath(element, withProperties);
    }
  }
}