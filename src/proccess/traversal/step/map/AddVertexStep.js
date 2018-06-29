import { mixin, ArrayUtils } from '../../../../util';
import { MapStep } from './MapStep';
import T from '../../../../structure/T';
import { DetachedFactory } from '../../../../structure/util/detached'
import TraversalParent from '../TraversalParent';
import Parameters from '../util/Parameters';
import ListCallbackRegistry from '../util/event/ListCallbackRegistry';
import Event from '../util/event/Event';

/**
 * AddVertexStep
 * @param traversal
 * @param label
 * @constructor
 */
function AddVertexStep(traversal, label) {
  MapStep.call(this, traversal);
  this.parameters = new Parameters();
  this.parameters.set(T.label.label, label);
  this.parameters.integrateTraversals(this);

}

AddVertexStep.prototype = {
  constructor: AddVertexStep,

  getParameters() {
    return this.parameters;
  },

  getLocalChildren() {
    return this.parameters.getTraversals();
  },

  addPropertyMutations(...keyValues) {
    keyValues = ArrayUtils.checkArray(keyValues);
    this.parameters.set(keyValues);
    this.parameters.integrateTraversals(this);
  },

  map(traverser) {
    const vertex = this.getTraversal().getGraph().addVertex(this.parameters.getKeyValues(traverser));
    if (this.callbackRegistry) {
      const vae = new Event.VertexAddedEvent(DetachedFactory.detach(vertex, true));
      this.callbackRegistry.getCallbacks().forEach(c => c.accept(vae));
    }
    return vertex;
  },

  getMutatingCallbackRegistry() {
    if (!this.callbackRegistry) this.callbackRegistry = new ListCallbackRegistry();
    return this.callbackRegistry;
  },


  getRequirements() {
    return this.getSelfAndChildRequirements();
  }
};

mixin(AddVertexStep, MapStep.prototype, TraversalParent.prototype);
export { AddVertexStep };
