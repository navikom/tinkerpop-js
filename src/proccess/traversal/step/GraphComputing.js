import { mixin } from '../../../util';
import TraversalParent from './TraversalParent';

/**
 * A {@code GraphComputing} step is one that will change its behavior whether its on a {@link org.apache.tinkerpop.gremlin.process.computer.GraphComputer} or not.
 * {@link org.apache.tinkerpop.gremlin.process.computer.traversal.strategy.finalization.ComputerFinalizationStrategy} is responsible for calling the {@link GraphComputing#onGraphComputer()} method.
 * This method is only called for global children steps of a {@link TraversalParent}.
 *
 */
class GraphComputing {

  constructor() {
    this.propType = GraphComputing.TYPE;
  }

  static atMaster(step, atMaster) {
    if (step.propType === GraphComputing.TYPE)
      step.atMaster(atMaster);
    if (step.propType === TraversalParent.TYPE) {
      for (let i = 0; i < step.getLocalChildren().size(); i++) {
        const local = step.getLocalChildren().getValue(i);
        for (let j = 0; j < local.getSteps().size(); j++) {
          const s = local.getSteps().getValue(j);
          GraphComputing.atMaster(s, atMaster);
        }
      }
      for (let i = 0; i < step.getGlobalChildren().size(); i++) {
        const global = step.getGlobalChildren().getValue(i);
        for (let j = 0; j < global.getSteps().size(); j++) {
          const s = global.getSteps().getValue(j);
          GraphComputing.atMaster(s, atMaster);
        }
      }
    }
  }
}


GraphComputing.TYPE = 'GraphComputing';

export default GraphComputing;
