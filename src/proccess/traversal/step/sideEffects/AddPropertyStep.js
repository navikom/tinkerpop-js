import { mixin, ArrayUtils } from '../../../../util';
import Parameters from '../util/Parameters';
import { DetachedFactory } from '../../../../structure/util/detached'
import TraversalParent from '../TraversalParent';
import { SideEffectStep } from './SideEffectStep';
import T from '../../../../structure/T';
import Vertex from '../../../../structure/Vertex';
import Edge from '../../../../structure/Edge';
import VertexProperty from '../../../../structure/VertexProperty';
import EmptyVertexProperty from '../../../../structure/util/empty/EmptyVertexProperty';
import EmptyProperty from '../../../../structure/util/empty/EmptyProperty';
import ListCallbackRegistry from '../util/event/ListCallbackRegistry';
import Event from '../util/event/Event';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * AddPropertyStep
 * @param traversal
 * @param cardinality
 * @param keyObject
 * @param valueObject
 * @constructor
 */
function AddPropertyStep(traversal, cardinality, keyObject, valueObject) {
  SideEffectStep.call(this, traversal);
  this._parameters = new Parameters();

  this._parameters.set(T.key.key, keyObject);
  this._parameters.set(T.value.value, valueObject);
  this.cardinality = cardinality;
  this._parameters.integrateTraversals(this);
}
AddPropertyStep.prototype = {
  constructor: AddPropertyStep,

  getParameters() {
    return this._parameters;
  },

  getLocalChildren() {
    return this._parameters.getTraversals();
  },

  addPropertyMutations(...keyValues) {
    this._parameters.set(ArrayUtils.checkArray(keyValues));
    this._parameters.integrateTraversals(this);
  },

  sideEffect(traverser) {

    const key = this._parameters.get(traverser, T.key.key, () => {
      throw ("The AddPropertyStep does not have a provided key: " + this);
    }).getValue(0);
    const value = this._parameters.get(traverser, T.value.value, () => {
      throw ("The AddPropertyStep does not have a provided value: " + this);
    }).getValue(0);

    const vertexPropertyKeyValues = this._parameters.getKeyValues(traverser, T.key.key, T.value.value);
    const element = traverser.getValue();


    if (this.callbackRegistry) {
      const currentProperty = traverser.getValue().property(key);
      const newProperty = element instanceof Vertex ? currentProperty === EmptyVertexProperty : currentProperty === EmptyProperty;
      let evt;
      if (element instanceof Vertex)
        evt = new Event.VertexPropertyChangedEvent(
          DetachedFactory.detach(element, true), newProperty
            ? null : DetachedFactory.detach(currentProperty, true), value, vertexPropertyKeyValues);
      else if (element instanceof Edge)
        evt = new Event.EdgePropertyChangedEvent(
          DetachedFactory.detach(element, true), newProperty ? null : DetachedFactory.detach(currentProperty), value);
      else if (element instanceof VertexProperty)
        evt = new Event.VertexPropertyPropertyChangedEvent(
          DetachedFactory.detach(element, true), newProperty ? null : DetachedFactory.detach(currentProperty), value);
      else
        throw ("The incoming object cannot be processed by change eventing");

      this.callbackRegistry.getCallbacks().forEach(c => c.accept(evt));
    }

    if (this.cardinality !== null){
      element.property(this.cardinality, key, value, vertexPropertyKeyValues);
    } else if (vertexPropertyKeyValues.length > 0){
      element.property(element.graph().features().vertex().getCardinality(key), key, value, vertexPropertyKeyValues);
    } else {
      element.property(element.graph().features().vertex().getCardinality(key), key, value);

    }

  },

  getRequirements() {
    return this.getSelfAndChildRequirements(TraverserRequirement.OBJECT);
  },

  getMutatingCallbackRegistry() {
    if (!this.callbackRegistry) this.callbackRegistry = new ListCallbackRegistry();
    return this.callbackRegistry;
  }
};

mixin(AddPropertyStep, SideEffectStep.prototype, TraversalParent.prototype);

export { AddPropertyStep };
