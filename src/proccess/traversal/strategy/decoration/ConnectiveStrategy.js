import { mixin } from '../../../../util';
import Traversal from '../../Traversal';
import TraversalHelper from '../../util/TraversalHelper';
import TraversalStrategy from '../../TraversalStrategy';
import { __ } from '../../dsl/graph';
import { HasNextStep, GraphStep } from '../../step/map';
import { ConnectiveStep, AndStep, OrStep } from '../../step/filter';
import { ProfileSideEffectStep, StartStep } from '../../step/sideEffects';
import ComputerAwareStep from '../../step/util/ComputerAwareStep';

const processConnectiveMarker = (traversal) => {
  processConjunctionMarker('OrStep', traversal);
  processConjunctionMarker('AndStep', traversal);
};

/**
 * ConnectiveStrategy rewrites the binary conjunction form of {@code a.and().b} into a {@link AndStep} of
 * {@code and(a,b)} (likewise for {@link OrStep}).
 * <p/>
 *
 * @author Marko A. Rodriguez (http://markorodriguez.com)
 * @author Daniel Kuppitz (http://gremlin.guru)
 * @example <pre>
 * __.has("name","stephen").or().where(__.out("knows").has("name","stephen"))
 * // is replaced by __.or(__.has("name","stephen"), __.where(__.out("knows").has("name","stephen")))
 * __.out("a").out("b").and().out("c").or().out("d")
 * // is replaced by __.or(__.and(__.out("a").out("b"), __.out("c")), __.out("d"))
 * __.as("a").out().as("b").and().as("c").in().as("d")
 * // is replaced by __.and(__.as("a").out().as("b"), __.as("c").in().as("d"))
 * </pre>
 *
 * @constructor
 */
function ConnectiveStrategy() {
}

ConnectiveStrategy.prototype = {
  constructor: ConnectiveStrategy,

  position: 0,

  apply(traversal) {
    if (TraversalHelper.hasStepOfAssignableClass(ConnectiveStep, traversal)) {
      processConnectiveMarker(traversal);
    }
  },
};

const legalCurrentStep = (step) => {
  return !(step.constructor.name === 'EmptyStep' || step instanceof ProfileSideEffectStep || step instanceof HasNextStep ||
  step instanceof ComputerAwareStep.EndStep || (step instanceof StartStep && !StartStep.isVariableStartStep(step)) ||
  GraphStep.isStartStep(step));
};

const processConjunctionMarker = (markerClass, traversal) => {
  const connectiveSteps = TraversalHelper.getStepsOfClass(markerClass, traversal).iterator()
    .filter(conjunctionStep => conjunctionStep.getValue().getLocalChildren().isEmpty());
  //console.log('processConjunctionMarker', markerClass, traversal, connectiveSteps);

  if(connectiveSteps){
    connectiveSteps.forEach((connectiveStep) => {
      let currentStep = connectiveStep.getNextStep();
      const rightTraversal = __.start().asAdmin();
      if (!connectiveStep.getLabels().isEmpty()) {
        const startStep = new StartStep(rightTraversal);
        const conjunctionLabels = connectiveStep.getLabels();
        conjunctionLabels.forEach(startStep => startStep.addLabel());
        conjunctionLabels.forEach(label => connectiveStep.removeLabel(label));
        Traversal.prototype.addStep.call(rightTraversal, startStep);
      }
      while (legalCurrentStep(currentStep)) {
        const nextStep = currentStep.getNextStep();
        Traversal.prototype.addStep.call(rightTraversal, currentStep);
        traversal.removeStep(currentStep);
        currentStep = nextStep;
      }
      processConnectiveMarker(rightTraversal);

      currentStep = connectiveStep.getPreviousStep();
      const leftTraversal = __.start().asAdmin();
      while (legalCurrentStep(currentStep)) {
        const previousStep = currentStep.getPreviousStep();
        leftTraversal.addStep(currentStep, 0);
        traversal.removeStep(currentStep);
        currentStep = previousStep;
      }
      processConnectiveMarker(leftTraversal);

      if (connectiveStep instanceof AndStep) {
        TraversalHelper.replaceStep(connectiveStep, new AndStep(traversal, [leftTraversal, rightTraversal]), traversal);
      } else {
        TraversalHelper.replaceStep(connectiveStep, new OrStep(traversal, [leftTraversal, rightTraversal]), traversal);
      }
    });
  }

};

mixin(ConnectiveStrategy, TraversalStrategy.DecorationStrategy.prototype);

const INSTANCE = new ConnectiveStrategy();
ConnectiveStrategy.instance = () => INSTANCE;
export { ConnectiveStrategy };
