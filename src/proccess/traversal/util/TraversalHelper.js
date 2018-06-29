import { List, IteratorUtils, ArrayUtils, HashSet, Optional, isNull } from '../../../util';
import Traversal from '../Traversal';
import TraversalParent from '../step/TraversalParent';
import HasContainerHolder from '../step/HasContainerHolder';
import Scoping from '../step/Scoping';
import { HasStep,
	ConnectiveStep,
	WherePredicateStep,
	WhereTraversalStep,
	NotStep,
 AndStep
} from '../step/filter';
import { MatchStep, GraphStep } from '../step/map';
import { StartStep } from '../step/sideEffects';
import EmptyTraversal from '../util/EmptyTraversal';
import { EmptyStep } from '../step/util/EmptyStep';
import Scope from '../Scope';

/**
 * TraversalHelper
 */
export default class TraversalHelper {
	//  public static boolean isLocalProperties(final Traversal.Admin<?, ?> traversal) {
	//  for (final Step step : traversal.getSteps()) {
	//  if (step instanceof RepeatStep) {
	//  for (final Traversal.Admin<?, ?> global : ((RepeatStep<?>) step).getGlobalChildren()) {
	//  if (TraversalHelper.hasStepOfAssignableClass(VertexStep.class, global))
	//  return false;
	// }
	// } else if (step instanceof VertexStep) {
	//  return false;
	// } else if (step instanceof EdgeVertexStep) {
	//  return false;
	// } else if (step instanceof TraversalParent) {
	//  for (final Traversal.Admin<?, ?> local : ((TraversalParent) step).getLocalChildren()) {
	//    if (!TraversalHelper.isLocalProperties(local))
	//      return false;
	//  }
	// }
	// }
	// return true;
	// }
	//
	// public static boolean isLocalStarGraph(final Traversal.Admin<?, ?> traversal) {
	//  return 'x' != isLocalStarGraph(traversal, 'v');
	// }
	//
	// private static char isLocalStarGraph(final Traversal.Admin<?, ?> traversal, char state) {
	//  if (state == 'u' &&
	//    (traversal instanceof ElementValueTraversal ||
	//    (traversal instanceof TokenTraversal && !((TokenTraversal) traversal).getToken().equals(T.id))))
	//  return 'x';
	//  for (final Step step : traversal.getSteps()) {
	//    if ((step instanceof PropertiesStep || step instanceof LabelStep || step instanceof PropertyMapStep) && state == 'u')
	//      return 'x';
	//    else if (step instanceof VertexStep) {
	//      if (state == 'u') return 'x';
	//      state = ((VertexStep) step).returnsVertex() ? 'u' : 'e';
	//    } else if (step instanceof EdgeVertexStep) {
	//      state = 'u';
	//    } else if (step instanceof HasContainerHolder && state == 'u') {
	//      for (final HasContainer hasContainer : ((HasContainerHolder) step).getHasContainers()) {
	//        if (!hasContainer.getKey().equals(T.id.getAccessor()))
	//          return 'x';
	//      }
	//    } else if (step instanceof TraversalParent) {
	//      final char currState = state;
	//      Set<Character> states = new HashSet<>();
	//      for (final Traversal.Admin<?, ?> local : ((TraversalParent) step).getLocalChildren()) {
	//        final char s = isLocalStarGraph(local, currState);
	//        if ('x' == s) return 'x';
	//        states.add(s);
	//      }
	//      if (!(step instanceof ByModulating)) {
	//        if (states.contains('u'))
	//          state = 'u';
	//        else if (states.contains('e'))
	//          state = 'e';
	//      }
	//      states.clear();
	//      for (final Traversal.Admin<?, ?> local : ((TraversalParent) step).getGlobalChildren()) {
	//        final char s = isLocalStarGraph(local, currState);
	//        if ('x' == s) return 'x';
	//        states.add(s);
	//      }
	//      if (states.contains('u'))
	//        state = 'u';
	//      else if (states.contains('e'))
	//        state = 'e';
	//      if (state != currState && (step instanceof RepeatStep || step instanceof MatchStep))
	//        return 'x';
	//    }
	//  }
	//  return state;
	// }

	/**
	 * Insert a step before a specified step instance.
	 *
	 * @param insertStep the step to insert
	 * @param afterStep  the step to insert the new step before
	 * @param traversal  the traversal on which the action should occur
	 */
	static insertBeforeStep(insertStep, afterStep, traversal) {
		traversal.addStep(insertStep, TraversalHelper.stepIndex(afterStep, traversal));
	}

	/**
	 * Insert a step after a specified step instance.
	 *
	 * @param insertStep the step to insert
	 * @param beforeStep the step to insert the new step after
	 * @param traversal  the traversal on which the action should occur
	 */
	static insertAfterStep(insertStep, beforeStep, traversal) {
		traversal.addStep(insertStep, TraversalHelper.stepIndex(beforeStep, traversal) + 1);
	}

	/**
	 * Replace a step with a new step.
	 *
	 * @param removeStep the step to remove
	 * @param insertStep the step to insert
	 * @param traversal  the traversal on which the action will occur
	 */
	static replaceStep(removeStep, insertStep, traversal) {
		traversal.addStep(insertStep, TraversalHelper.stepIndex(removeStep, traversal));
		traversal.removeStep(removeStep);
	}


	static insertTraversal(insertIndex, insertTraversal, traversal) {
		if (isNaN(insertIndex)) {
			const previousStep = insertIndex;
			return TraversalHelper.insertTraversal(TraversalHelper.stepIndex(previousStep, traversal), insertTraversal, traversal);
		}

		if (0 === traversal.getSteps().size()) {
			let currentStep = EmptyStep.instance();
			for (let i = 0; i < insertTraversal.getSteps().size(); i++) {
				const insertStep = insertTraversal.getSteps().getValue(i);
				currentStep = insertStep;
				traversal.addStep(insertStep);
			}
			return currentStep;
		} else {
			let currentStep = traversal.getSteps().getValue(insertIndex);
			for (let i = 0; i < insertTraversal.getSteps().size(); i++) {
				const insertStep = insertTraversal.getSteps().getValue(i);
				TraversalHelper.insertAfterStep(insertStep, currentStep, traversal);
				currentStep = insertStep;
			}
			return currentStep;
		}
	}

	static removeToTraversal(startStep, endStep, newTraversal) {
		const originalTraversal = startStep.getTraversal();
		let currentStep = startStep;
		while (currentStep !== endStep && !(currentStep instanceof EmptyStep)) {
			const temp = currentStep.getNextStep();
			originalTraversal.removeStep(currentStep);
			newTraversal.addStep(currentStep);
			currentStep = temp;
		}
	}

	/**
	 * Gets the index of a particular step in the {@link Traversal}.
	 *
	 * @param step      the step to retrieve the index for
	 * @param traversal the traversal to perform the action on
	 * @return the index of the step or -1 if the step is not present
	 */
	static stepIndex(step, traversal) {
		for (let i = 0; i < traversal.getSteps().size(); i++) {
			const s = traversal.getSteps().getValue(i);
			if (s === step) {
				return i;
			}
		}
		return -1;
	}

	static getStepsOfClass(stepClass, traversal) {
		const steps = new List();
		for (let i = 0; i < traversal.getSteps().size(); i++) {
			const step = traversal.getSteps().getValue(i);
			if (step.constructor.name === stepClass) {
				steps.add(step);
			}
		}
		return steps;
	}

	static getStepsOfAssignableClass(stepClass, traversal) {
		const steps = new List();
		for (let i = 0; i < traversal.getSteps().size(); i++) {
			const step = traversal.getSteps().getValue(i)
			if ((stepClass.TYPE && stepClass.TYPE === step.type) || step instanceof stepClass)
				steps.add(step);
		}
		return steps;
	}

	// public static <S> Optional<S> getLastStepOfAssignableClass(final Class<S> stepClass, final Traversal.Admin<?, ?> traversal) {
	//  final List<S> steps = TraversalHelper.getStepsOfAssignableClass(stepClass, traversal);
	//  return steps.size() == 0 ? Optional.empty() : Optional.of(steps.get(steps.size() - 1));
	// }

	 static getFirstStepOfAssignableClass(stepClass, traversal) {
		 for (let i = 0; i < traversal.getSteps().size(); i++) {
			 const step = traversal.getSteps().get(i);
	    if (stepClass === step || (stepClass.TYPE === 'Barrier' && step.barrierType))
	      return Optional.of(step);
	  }
	  return Optional.empty();
	 }

	static getStepsOfAssignableClassRecursively(scope, stepClass, traversal) {
		if (arguments.length === 2) {
			return TraversalHelper.getStepsOfAssignableClassRecursively(null, arguments[0], arguments[1]);
		}

		const list = new List();
		for (let i = 0; i < traversal.getSteps().size(); i++) {
			const step = traversal.getSteps().getValue(i);
			if (stepClass === step || (stepClass.TYPE && step.capableType === stepClass.TYPE))
				list.add(step);
			if (step.propType === TraversalParent.TYPE) {
				if (null === scope || Scope.local === scope) {
					for (let j = 0; j < step.getLocalChildren().size(); j++) {
						const localChild = step.getLocalChildren().getValue(j)
						list.addAll(TraversalHelper.getStepsOfAssignableClassRecursively(stepClass, localChild));
					}
				}
				if (null === scope || Scope.global === scope) {
					for (let j = 0; j < step.getGlobalChildren().size(); j++) {
						const globalChild = step.getGlobalChildren().getValue(j);
						list.addAll(TraversalHelper.getStepsOfAssignableClassRecursively(stepClass, globalChild));
					}
				}
			}
		}
		return list;
	}


	// public static boolean isGlobalChild(Traversal.Admin<?, ?> traversal) {
	//  while (!(traversal.getParent() instanceof EmptyStep)) {
	//    if (traversal.getParent().getLocalChildren().contains(traversal))
	//      return false;
	//    traversal = traversal.getParent().asStep().getTraversal();
	//  }
	//  return true;
	// }

	/**
	 * Determine if the traversal has a step of an assignable class.
	 *
	 * @param superClass the step super class to look for
	 * @param traversal  the traversal to perform the action on
	 * @return {@code true} if the class is found and {@code false} otherwise
	 */
	static hasStepOfAssignableClass(superClass, traversal) {
		for (let i = 0; i < traversal.getSteps().size(); i++) {
			const step = traversal.getSteps().getValue(i);
			if (superClass === step || step instanceof superClass) {
				return true;
			}
		}
		return false;
	}


	/**
	 * Determine if the traversal has any of the supplied steps of an assignable class in the current {@link Traversal}
	 * and its {@link Scope} child traversals.
	 *
	 * @param scope       whether to check global or local children (null for both).
	 * @param stepClasses the step classes to look for
	 * @param traversal   the traversal in which to look for the given step classes
	 * @return <code>true</code> if any step in the given traversal (and its child traversals) is an instance of a class
	 * provided in <code>stepClasses</code>, otherwise <code>false</code>.
	 */
	static hasStepOfAssignableClassRecursively(scope, stepClasses, traversal) {
		if (arguments.length === 2) {
			return this.hasStepOfAssignableClassRecursively(null, arguments[0], arguments[1]);
		}
		for (let i = 0; i < traversal.getSteps().size(); i++) {
			const step = traversal.getSteps().get(i);

			if (stepClasses instanceof List) {
				if (IteratorUtils.anyMatch(
						stepClasses.iterator(), (stepClass) => step instanceof stepClass || step.lambdaHolderType)) {
					return true;
				}
			} else {
				if (stepClasses === step || step instanceof stepClasses) {
					return true;
				}
			}

			if (step.propType === TraversalParent.TYPE) {
				if (!scope || Scope.local === scope) {
					for (let i = 0; i < step.getLocalChildren().size(); i++) {
						const localChild = step.getLocalChildren().getValue(i);
						if (this.hasStepOfAssignableClassRecursively(stepClasses, localChild)) return true;
					}
				}
				if (!scope || Scope.global === scope) {
					for (let i = 0; i < step.getGlobalChildren().size(); i++) {
						const globalChild = step.getGlobalChildren().getValue(i)
						if (this.hasStepOfAssignableClassRecursively(stepClasses, globalChild)) return true;
					}
				}
			}
		}
		return false;

	}

	/**
	 * Determine if any step in {@link Traversal} or its children match the step given the provided {@link Predicate}.
	 *
	 * @param predicate the match function
	 * @param traversal th traversal to perform the action on
	 * @return {@code true} if there is a match and {@code false} otherwise
	 */
	static anyStepRecursively(predicate, traversal) {
		if (traversal.asAdmin) {
			for (let i = 0; i < traversal.getSteps().size(); i++) {
				const step = traversal.getSteps().get(i);
				if (predicate(step)) {
					return true;
				}
				if (step.type === TraversalParent.TYPE) {
					return TraversalHelper.anyStepRecursivelyApply(predicate, step);
				}
			}
		} else {
			return TraversalHelper.anyStepRecursivelyApply(predicate, traversal);
		}
	}

	static anyStepRecursivelyApply(predicate, step) {
		for (let j = 0; j < step.getLocalChildren().size(); j++) {
			if (TraversalHelper.anyStepRecursively(predicate, step.getLocalChildren().get(j))) return true;
		}
		for (let j = 0; j < step.getGlobalChildren().size(); j++) {
			if (TraversalHelper.anyStepRecursively(predicate, step.getGlobalChildren().get(j))) return true;
		}
		return false;
	}

	/**
	 * Apply the provider {@link Consumer} function to the provided {@link Traversal} and all of its children.
	 *
	 * @param consumer  the function to apply to the each traversal in the tree
	 * @param traversal the root traversal to start application
	 */
	static applyTraversalRecursively(consumer, traversal) {
		consumer(traversal);
		for (let i = 0; i < traversal.getSteps().size(); i++) {
			const step = traversal.getSteps().get(i);
			if (step.propType === TraversalParent.TYPE) {
				for (let j = 0; j < step.getLocalChildren().size(); j++) {
					TraversalHelper.applyTraversalRecursively(consumer, step.getLocalChildren().get(j));
				}
				for (let j = 0; j < step.getGlobalChildren().size(); j++) {
					TraversalHelper.applyTraversalRecursively(consumer, step.getGlobalChildren().get(j));
				}
			}
		}
	}

	static addToCollection(collection, s, bulk) {
		for (let i = 0; i < bulk; i++) {
			collection.add(s);
		}
	}

	// /**
	// * @deprecated As of release 3.2.3, not replaced - only used by {@link org.apache.tinkerpop.gremlin.process.traversal.step.map.GroupStepV3d0}.
	// */
	// @Deprecated
	// public static <S> void addToCollectionUnrollIterator(final Collection<S> collection, final S s, final long bulk) {
	//  if (s instanceof Iterator) {
	//    ((Iterator<S>) s).forEachRemaining(r -> addToCollection(collection, r, bulk));
	//  } else if (s instanceof Iterable) {
	//    ((Iterable<S>) s).forEach(r -> addToCollection(collection, r, bulk));
	//  } else {
	//    addToCollection(collection, s, bulk);
	//  }
	// }
	//
	// /**
	// * Returns the name of <i>step</i> truncated to <i>maxLength</i>. An ellipses is appended when the name exceeds
	// * <i>maxLength</i>.
	// *
	// * @param step
	// * @param maxLength Includes the 3 "..." characters that will be appended when the length of the name exceeds
	// *                  maxLength.
	// * @return short step name.
	// */
	// public static String getShortName(final Step step, final int maxLength) {
	//  final String name = step.toString();
	//  if (name.length() > maxLength)
	//    return name.substring(0, maxLength - 3) + "...";
	//  return name;
	// }

	static reIdSteps(stepPosition, traversal) {
		stepPosition.x = 0;
		stepPosition.y = -1;
		stepPosition.z = -1;
		stepPosition.parentId = null;
		let current = traversal;
		while (!(current instanceof EmptyTraversal)) {
			stepPosition.y++;
			const parent = current.getParent();
			if (!stepPosition.parentId && !(parent instanceof EmptyStep)) {
				stepPosition.parentId = parent.asStep().getId();
			}
			if (stepPosition.z === -1) {
				const globalChildrenSize = parent.getGlobalChildren().size();
				for (let i = 0; i < globalChildrenSize; i++) {
					if (parent.getGlobalChildren().getValue(i) === current) {
						stepPosition.z = i;
					}
				}
				for (let i = 0; i < parent.getLocalChildren().size(); i++) {
					if (parent.getLocalChildren().getValue(i) === current) {
						stepPosition.z = i + globalChildrenSize;
					}
				}
			}
			current = parent.asStep().getTraversal();
		}
		if (stepPosition.z === -1) stepPosition.z = 0;
		if (!stepPosition.parentId) stepPosition.parentId = '';


		for (let i = 0; i < traversal.getSteps().size(); i++) {
			const step = traversal.getSteps().getValue(i);
			step.setId(stepPosition.nextXId());
		}
	}

	static getRootTraversal(traversal) {
		while (traversal.getParent().constructor.name !== 'EmptyStep') {
			traversal = traversal.getParent().asStep().getTraversal();
		}
		return traversal;
	}

	static getLabels() {
		if (arguments.length === 1) {
			const traversal = arguments[0];
			return TraversalHelper.getLabels(new List(), traversal);
		}

		const labels = arguments[0];
		const traversal = arguments[1];

		for (let i = 0; i < traversal.getSteps().size(); i++) {
			const step = traversal.getSteps().getValue(i);
			labels.addAll(step.getLabels());
			if (step.propType === TraversalParent.TYPE) {
				for (let j = 0; j < step.getLocalChildren().size(); j++) {
					const local = step.getLocalChildren().getValue(j);
					TraversalHelper.getLabels(labels, local);
				}
				for (let j = 0; j < step.getGlobalChildren().size(); j++) {
					const global = step.getGlobalChildren().getValue(j);
					TraversalHelper.getLabels(labels, global);
				}
			}
		}
		return labels;
	}


	static getVariableLocations() {
		if (arguments.length === 1) {
			const traversal = arguments[0];
			return TraversalHelper.getVariableLocations(new List(), traversal);
		}
		const variables = arguments[0];
		const traversal = arguments[1];

		if (variables.size() === 2) return variables;    // has both START and END so no need to compute further
		const startStep = traversal.getStartStep();
		if (StartStep.isVariableStartStep(startStep))
			variables.add(Scoping.Variable.START);
		else if (startStep instanceof WherePredicateStep) {
			if (startStep.getStartKey().isPresent())
				variables.add(Scoping.Variable.START);
		} else if (startStep instanceof WhereTraversalStep.WhereStartStep) {
			if (!startStep.getScopeKeys().isEmpty())
				variables.add(Scoping.Variable.START);
		} else if (startStep instanceof MatchStep.MatchStartStep) {
			if (startStep.getSelectKey().isPresent())
				variables.add(Scoping.Variable.START);
		} else if (startStep instanceof MatchStep) {
			for (let i = 0; i < startStep.getGlobalChildren().size(); i++) {
				const global = startStep.getGlobalChildren().getValue(i);
				TraversalHelper.getVariableLocations(variables, global);
			}
		} else if (startStep instanceof ConnectiveStep || startStep instanceof NotStep || startStep instanceof WhereTraversalStep) {
			for (let i = 0; i < startStep.getLocalChildren().size(); i++) {
				const local = startStep.getLocalChildren().getValue(i);
				TraversalHelper.getVariableLocations(variables, local);
			}
		}
		///
		const endStep = traversal.getEndStep();
		if (endStep instanceof WherePredicateStep) {
			if (endStep.getStartKey().isPresent())
				variables.add(Scoping.Variable.END);
		} else if (endStep instanceof WhereTraversalStep.WhereEndStep) {
			if (!endStep.getScopeKeys().isEmpty())
				variables.add(Scoping.Variable.END);
		} else if (endStep instanceof MatchStep.MatchEndStep) {
			if (endStep.getMatchKey().isPresent())
				variables.add(Scoping.Variable.END);
		} else if (!endStep.getLabels().isEmpty())
			variables.add(Scoping.Variable.END);
		///
		return variables;
	}

	static onGraphComputer(traversal) {
		//while (!(traversal.getParent() instanceof EmptyStep)) {
		//  if (traversal.getParent() instanceof TraversalVertexProgramStep)
		//    return true;
		//  traversal = traversal.getParent().asStep().getTraversal();
		//}
		return false;
	}

	//
	// public static void removeAllSteps(final Traversal.Admin<?, ?> traversal) {
	//  final int size = traversal.getSteps().size();
	//  for (int i = 0; i < size; i++) {
	//    traversal.removeStep(0);
	//  }
	// }
	//
	static copyLabels(fromStep, toStep, moveLabels) {
		if (!fromStep.getLabels().isEmpty()) {
			const labels = fromStep.getLabels();
			for (let i = 0; i < labels.size(); i++) {
				const label = labels.getValue(i);
				toStep.addLabel(label);
				if (moveLabels) {
					fromStep.removeLabel(label);
				}
			}
		}
	}

	static hasAllStepsOfClass(traversal, ...classesToCheck) {
		classesToCheck = ArrayUtils.checkArray(classesToCheck);
		for (let i = 0; i < traversal.getSteps().size(); i++) {
			const step = traversal.getSteps().getValue(i);
			let foundInstance = false;
			for (let j = 0; j < classesToCheck.length; j++) {
				const classToCheck = classesToCheck[j];
				if (classToCheck.TYPE === step.type) {
					foundInstance = true;
					break;
				}
			}
			if (!foundInstance)
				return false;
		}
		return true;
	}


	static hasStepOfClass(traversal, ...classesToCheck) {
		if (traversal.asAdmin) {
			classesToCheck = ArrayUtils.checkArray(classesToCheck);
			for (let i = 0; i < traversal.getSteps().size(); i++) {
				const step = traversal.getSteps().getValue(i);
				for (let j = 0; j < classesToCheck.length; j++) {
					const classToCheck = classesToCheck[j];
					if (classToCheck.TYPE === step.type)
						return true;
				}
			}
		} else {
			const stepClass = arguments[0];
			traversal = arguments[1];
			for (let i = 0; i < traversal.getSteps().size(); i++) {
				const step = traversal.getSteps().getValue(i);
				if (step === stepClass) {
					return true;
				}
			}
		}
		return false;
	}

	static applySingleLevelStrategies(parentTraversal, childTraversal, stopAfterStrategy) {
		childTraversal.setStrategies(parentTraversal.getStrategies());
		childTraversal.setSideEffects(parentTraversal.getSideEffects());
		childTraversal.setGraph(parentTraversal.getGraph());
		for (let i = 0; i < parentTraversal.getStrategies().traversalStrategies.size(); i++) {
			const strategy = parentTraversal.getStrategies().traversalStrategies.get(i);
			strategy.apply(childTraversal);
			if (stopAfterStrategy && stopAfterStrategy === strategy)
				break;
		}
	}

	/**
	 * Used to left-fold a {@link HasContainer} to a {@link HasContainerHolder} if it exists. Else, append a {@link HasStep}.
	 *
	 * @param traversal    the traversal to fold or append.
	 * @param hasContainer the container to add left or append.
	 * @param <T>          the traversal type
	 * @return the has container folded or appended traversal
	 */
	static addHasContainer(traversal, hasContainer) {
		if (traversal.getEndStep().hasContainers) {

			traversal.getEndStep().addHasContainer(hasContainer);
			return traversal;
		}
		return Traversal.prototype.addStep.call(traversal, new HasStep(traversal, hasContainer));
	}
}
