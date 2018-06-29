import { mixin, ArrayUtils, List } from '../../../../util';
import { MapStep } from './MapStep';
import T from '../../../../structure/T';
import Hidden from '../../../../structure/Hidden';
import StringFactory from '../../../../structure/util/StringFactory';
import Edge from '../../../../structure/Edge';
import { DetachedFactory } from '../../../../structure/util/detached'
import TraversalParent from '../TraversalParent';
import Parameters from '../util/Parameters';
import ListCallbackRegistry from '../util/event/ListCallbackRegistry';
import Event from '../util/event/Event';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 *
 * @param traversal Traversal.Admin
 * @param mapTraversal Traversal
 * @constructor
 */
function AddEdgeStep(traversal, label) {
  MapStep.call(this, traversal);
  this._parameters = new Parameters();
  this._parameters.set(T.label.label, label);

}

AddEdgeStep.prototype = {
  constructor: AddEdgeStep,

  getLocalChildren() {
    return this._parameters.getTraversals();
  },

  getParameters() {
    return this._parameters;
  },

  addPropertyMutations(...keyValues) {
    this._parameters.set(keyValues);
    this._parameters.integrateTraversals(this);
  },

  addTo(toObject) {
    this._parameters.set(AddEdgeStep.TO, toObject);
    this._parameters.integrateTraversals(this);
  },

  addFrom(fromObject) {
    this._parameters.set(AddEdgeStep.FROM, fromObject);
    this._parameters.integrateTraversals(this);
  },

  map(traverser) {
    const toVertex = this._parameters.get(traverser, AddEdgeStep.TO, () => new List([traverser.get()])).getValue(0);

    const fromVertex = this._parameters.get(traverser, AddEdgeStep.FROM, () => new List([traverser.get()])).getValue(0);
    const edgeLabel = this._parameters.get(traverser, T.label.label, () => new List([Edge.DEFAULT_LABEL])).getValue(0);

    const edge = fromVertex.addEdge(edgeLabel, toVertex, this._parameters.getKeyValues(traverser, AddEdgeStep.TO, AddEdgeStep.FROM, T.label));
    if (this.callbackRegistry) {
      const vae = new Event.EdgeAddedEvent(DetachedFactory.detach(edge, true));
      this.callbackRegistry.getCallbacks().forEach(c => c.accept(vae));
    }
    return edge;
  },

  getRequirements() {
    return this.getSelfAndChildRequirements(TraverserRequirement.OBJECT);
  },

  getMutatingCallbackRegistry() {
    if (!this.callbackRegistry) this.callbackRegistry = new ListCallbackRegistry();
    return this.callbackRegistry;
  }
};

mixin(AddEdgeStep, MapStep.prototype, TraversalParent.prototype);

AddEdgeStep.FROM = Hidden.hide("from");
AddEdgeStep.TO = Hidden.hide("to");

export { AddEdgeStep };

