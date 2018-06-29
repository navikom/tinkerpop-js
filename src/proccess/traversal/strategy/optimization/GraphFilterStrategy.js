import { mixin, HashSet, List } from '../../../../util';
import __ from '../../dsl/graph/__';
import TraversalStrategy from '../../TraversalStrategy';
import TraversalHelper from '../../util/TraversalHelper';
import EmptyGraph from '../../../../structure/util/empty/EmptyGraph';
import Direction from '../../../../structure/Direction';
import { VertexStep, GraphStep } from '../../step/map';

/**
 * GraphFilterStrategy
 * @constructor
 */
function GraphFilterStrategy() {
}

GraphFilterStrategy.prototype = {
	constructor: GraphFilterStrategy,

	apply(traversal) {
		if (TraversalHelper.getStepsOfAssignableClass(VertexProgramStep, traversal).size() > 1)  // do not do if there is an OLAP chain
			return;
		const graph = traversal.getGraph().orElse(EmptyGraph.instance()); // given that this strategy only works for single OLAP jobs, the graph is the traversal graph
		const steps = TraversalHelper.getStepsOfClass(TraversalVertexProgramStep, traversal);
		for (let i = 0; i < steps.size(); i++) {   // will be zero or one step
			const step = steps.getValue(i)
			const computerTraversal = step.generateProgram(graph, EmptyMemory.instance()).getTraversal().clone();
			if (!computerTraversal.isLocked())
				computerTraversal.applyStrategies();
			const computer = step.getComputer();
			if (null === computer.getEdges() && !GraphComputer.Persist.EDGES === computer.getPersist()) {  // if edges() already set, use it
				const edgeFilter = GraphFilterStrategy.getEdgeFilter(computerTraversal);
				if (null != edgeFilter)  // if no edges can be filtered, then don't set edges()
					step.setComputer(computer.edges(edgeFilter));
			}
		}
	},

};

mixin(GraphFilterStrategy, TraversalStrategy.OptimizationStrategy.prototype);

GraphFilterStrategy.getEdgeFilter = (traversal) => {
	if (traversal.getStartStep() instanceof GraphStep && traversal.getStartStep().returnsEdge())
	return null; // if the traversal is an edge traversal, don't filter (this can be made less stringent)
	if (TraversalHelper.hasStepOfAssignableClassRecursively(LambdaHolder, traversal))
		return null; // if the traversal contains lambdas, don't filter as you don't know what is being accessed by the lambdas
	const directionLabels = new Map();
	const outLabels = new List();
	const inLabels = new List();
	const bothLabels = new List();
	directionLabels.put(Direction.OUT, outLabels);
	directionLabels.put(Direction.IN, inLabels);
	directionLabels.put(Direction.BOTH, bothLabels);
	TraversalHelper.getStepsOfAssignableClassRecursively(VertexStep, traversal).forEach(step => {
		// in-edge traversals require the outgoing edges for attachment
		const direction = step.getDirection() === Direction.IN && step.returnsEdge() ?
			Direction.BOTH :
			step.getDirection();
		const edgeLabels = step.getEdgeLabels();
		if (edgeLabels.length === 0)
			directionLabels.getValue(direction).add(null); // null means all edges (don't filter)
		else
			Collections.addAll(directionLabels.getValue(direction), edgeLabels); // add edge labels associated with that direction
	});
	for (let i = 0; i < outLabels.size(); i++) { // if both in and out share the same labels, add them to both
		const label = outLabels.getValue(i);
		if (inLabels.contains(label)) {
			bothLabels.add(label);
		}
	}
	if (bothLabels.contains(null)) // if both on everything, you can't edges() filter
		return null;

	for (let i = 0; i < bothLabels.size(); i++) { // remove labels from out and in that are already handled by both
		const label = bothLabels.getValue(i);
		outLabels.remove(label);
		inLabels.remove(label);
	}
	// construct edges(...)
	if (outLabels.isEmpty() && inLabels.isEmpty() && bothLabels.isEmpty())  // out/in/both are never called, thus, filter all edges
		return __.bothE().limit(0).asAdmin();
	else {
		const ins = inLabels.contains(null) ? [] : inLabels.toArray();
		const outs = outLabels.contains(null) ? [] : outLabels.toArray();
		const boths = bothLabels.contains(null) ? [] : bothLabels.toArray();

		if (outLabels.isEmpty() && inLabels.isEmpty()) // only both has labels
			return __.bothE(boths).asAdmin();
		else if (inLabels.isEmpty() && bothLabels.isEmpty()) // only out has labels
			return __.outE(outs).asAdmin();
		else if (outLabels.isEmpty() && bothLabels.isEmpty()) // only in has labels
			return __.inE(ins).asAdmin();
		else if (bothLabels.isEmpty())                        // out and in both have labels
			return __.union(__.inE(ins), __.outE(outs)).asAdmin();
		else if (outLabels.isEmpty() && ins.length > 0)       // in and both have labels (and in is not null)
			return __.union(__.inE(ins), __.bothE(boths)).asAdmin();
		else if (inLabels.isEmpty() && outs.length > 0)       // out and both have labels (and out is not null)
			return __.union(__.outE(outs), __.bothE(boths)).asAdmin();
		else
			return null;
		//throw new IllegalStateException("The label combination should not have reached this point: " + outLabels + "::" + inLabels + "::" + bothLabels);
	}
}

const INSTANCE = new GraphFilterStrategy();

GraphFilterStrategy.instance = () => INSTANCE;

export default GraphFilterStrategy;