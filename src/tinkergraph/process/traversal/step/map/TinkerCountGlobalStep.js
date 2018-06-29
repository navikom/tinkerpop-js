import { mixin } from '../../../../../util';
import { TinkerHelper } from '../../../../structure/TinkerHelper';
import AbstractStep from '../../../../../proccess/traversal/step/util/AbstractStep';
import Vertex from '../../../../../structure/Vertex';

/**
 * TinkerCountGlobalStep
 * @param traversal
 * @param elementClass
 * @constructor
 */
function TinkerCountGlobalStep(traversal, elementClass) {
  AbstractStep.call(this, traversal);
  this.elementClass = elementClass;
}

TinkerCountGlobalStep.prototype = {
  constructor: TinkerCountGlobalStep,

  processNextStart() {
    if (!this.done) {
      this.done = true;
      const graph = this.getTraversal().getGraph();
      return this.getTraversal().getTraverserGenerator().generate(Vertex.TYPE === this.elementClass ?
        TinkerHelper.getVertices(graph).size() :
        TinkerHelper.getEdges(graph).size(), this, 1);
    } else
      throw ("No Such Element Exception");
  },

  reset() {
    this.done = false;
  }
};

mixin(TinkerCountGlobalStep, AbstractStep.prototype);

export default TinkerCountGlobalStep;
