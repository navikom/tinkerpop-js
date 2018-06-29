import { mixin, ArrayUtils } from '../../../../util';
import AbstractStep from '../util/AbstractStep';
import Parameters from '../util/Parameters';
import { DetachedFactory } from '../../../../structure/util/detached'
import TraversalParent from '../TraversalParent';
import T from '../../../../structure/T';
import ListCallbackRegistry from '../util/event/ListCallbackRegistry';
import Event from '../util/event/Event';

/**
 * AddVertexStartStep
 * @param traversal
 * @param label
 * @constructor
 */
function AddVertexStartStep(traversal, label) {
  AbstractStep.call(this, traversal);
  this._parameters = new Parameters();
  this.first = true;
  this._parameters.set(T.label.label, label);
  this._parameters.integrateTraversals(this);

}
AddVertexStartStep.prototype = {
  constructor: AddVertexStartStep,

  getParameters() {
    return this._parameters;
  },

  getLocalChildren() {
    return this._parameters.getTraversals();
  },

  addPropertyMutations(...keyValues) {
    keyValues = ArrayUtils.checkArray(keyValues);
    this._parameters.set(keyValues);
    this._parameters.integrateTraversals(this);
  },

  processNextStart() {
    if (this.first) {
      this.first = false;
      const generator = this.getTraversal().getTraverserGenerator();

      const vertex = this.getTraversal().getGraph().addVertex(this._parameters.getKeyValues(generator.generate(false, this, 1)));
      if (this.callbackRegistry) {
        const vae = new Event.VertexAddedEvent(DetachedFactory.detach(vertex, true));
        this.callbackRegistry.getCallbacks().forEach(c => c.accept(vae));
      }
      return generator.generate(vertex, this, 1);
    } else
      throw ("No Such Element Exception");
  },

  getMutatingCallbackRegistry() {
    if (!this.callbackRegistry) this.callbackRegistry = new ListCallbackRegistry();
    return this.callbackRegistry;
  },

  getRequirements() {
    return this.getSelfAndChildRequirements();
  },


  reset() {
    AbstractStep.prototype.reset.call(this);
  }
};

mixin(AddVertexStartStep, AbstractStep.prototype, TraversalParent.prototype);

export { AddVertexStartStep };
