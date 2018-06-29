import { List, Optional } from '../../util';
//import TraversalHelper from './util/TraversalHelper';
import { EmptyStep } from './step/util/EmptyStep';

/**
 *
 * A {@link Traversal} represents a directed walk over a {@link Graph}.
 * This is the base interface for all traversal's, where each extending interface is seen as a domain specific language.
 * For example, {@link GraphTraversal} is a domain specific language for traversing a graph using "graph concepts" (e.g. vertices, edges).
 * Another example may represent the graph using "social concepts" (e.g. people, cities, artifacts).
 * A {@link Traversal} is evaluated in one of two ways: iterator-based OLTP or {@link GraphComputer}-based OLAP.
 * OLTP traversals leverage an iterator and are executed within a single JVM (with data access allowed to be remote).
 * OLAP traversals leverage {@link GraphComputer} and are executed between multiple JVMs (and/or cores).
 *
 */
function Traversal() {
}

Traversal.prototype = {
	constructor: Traversal,
	/**
	 * Get access to administrative methods of the traversal via its accompanying {@link Traversal.Admin}.
	 * @returns {Traversal}
	 */
	asAdmin() {
		return this;
	},

	/**
	 * When the traversal has had its {@link TraversalStrategies} applied to it, it is locked.
	 *
	 * @return whether the traversal is locked
	 */
	isLocked() {
		throw new Error('Must be overloaded');
	},

	/**
	 * Apply the registered {@link TraversalStrategies} to the traversal.
	 * Once the strategies are applied, the traversal is "locked" and can no longer have steps added to it.
	 * The order of operations for strategy applications should be: globally id steps, apply strategies to root traversal, then to nested traversals.
	 *
	 * @throws Exception if the {@link TraversalStrategies} have already been applied
	 */
	applyStrategies() {
		throw new Error('Must be overloaded');
	},

	/**
	 * Get the {@link Step} instances associated with this traversal.
	 * The steps are ordered according to their linked list structure as defined by {@link Step#getPreviousStep()} and {@link Step#getNextStep()}.
	 *
	 * @return the ordered steps of the traversal
	 */
	getSteps() {
		throw new Error('Must be overloaded');
	},

	/**
	 * Get the end/tail of the traversal. If the traversal is empty, then an {@link EmptyStep} instance is returned.
	 *
	 * @return the end step of the traversal
	 */
	getEndStep() {
		const steps = this.getSteps();
		return steps.isEmpty() ? EmptyStep.instance() : steps.getValue(steps.size() - 1);
	},

	/**
	 * Get the {@link Bytecode} associated with the construction of this traversal.
	 *
	 * @return the byte code representation of the traversal
	 */
	getBytecode() {
		throw new Error('Must be overloaded');
	},

	/**
	 * Call the {@link Step#reset} method on every step in the traversal.
	 */
	reset() {
		this.getSteps().forEach('reset');
	},

	/**
	 * Get the start/head of the traversal. If the traversal is empty, then an {@link EmptyStep} instance is returned.
	 *
	 * @return the start step of the traversal
	 */
	getStartStep() {
		const steps = this.getSteps();
		return steps.isEmpty() ? EmptyStep.instance() : steps.get(0);
	},

	/**
	 * Add a single {@link Traverser.Admin} object to the head of the traversal.
	 * Users should typically not need to call this method. For dynamic inject of data, they should use {@link org.apache.tinkerpop.gremlin.process.traversal.step.sideEffect.InjectStep}.
	 *
	 * @param start a traverser to add to the traversal
	 */
	addStart(start) {
		if (!this.isLocked()) this.applyStrategies();
		this.getStartStep().addStart(start);
	},

	/**
	 * Add a {@link Step} to the end of the traversal. This method should link the step to its next and previous step accordingly.
	 * or
	 * Add a {@link Step} to an arbitrary point in the traversal if two arguments
	 * @param index the location in the traversal to insert the step
	 * @param step the step to add
	 * @param <S2>  the new start type of the traversal (if the added step was a start step)
	 * @param <E2> the output of the step
	 * @return the updated traversal one argument or the newly modulated traversal if two arguments
	 */
	addStep(step, index) {
		if (index) {
			throw new Error('Must be overloaded');
		} else {
			return this.addStep(step, this.getSteps().size());
		}
	},

	getGraph() {
		throw new Error('Must be overloaded');
	},

	setGraph(graph) {
		throw new Error('Must be overloaded');
	},

	tryNext() {
		return this.hasNext() ? Optional.of(this.next()) : Optional.empty();
	},

	/**
	 * Put all the results into an {@link ArrayList}.
	 *
	 * @return the results in a list
	 */
	toList() {
		return this.fill([]);
	},

	/**
	 * Add all the results of the traversal to the provided collection.
	 *
	 * @param collection the collection to fill
	 * @return the collection now filled
	 */
	fill(collection) {
		try {
			if (!this.asAdmin().isLocked()) this.asAdmin().applyStrategies();
			// use the end step so the results are bulked
			const endStep = this.asAdmin().getEndStep();

			let i = 0;
			while (true) {
				const traverser = endStep.next();
				for (let i = 0; i < traverser.bulk(); i++) {
					collection.push(traverser.get());
				}
			}
		} catch (e) {
		}
		return collection;
	},

	/**
	 * Iterate all the {@link Traverser} instances in the traversal.
	 * What is returned is the empty traversal.
	 * It is assumed that what is desired from the computation is are the sideEffects yielded by the traversal.
	 * @returns {Traversal}
	 */
	iterate() {
		try {
			if (!this.asAdmin().isLocked()) this.asAdmin().applyStrategies();
			// use the end step so the results are bulked
			const endStep = this.asAdmin().getEndStep();
			while (true) {
				endStep.next();
			}
		} catch (err) {
		}
		return this;
	},

};

Traversal.HALT = 'halt';
Traversal.Symbols = {
	profile: 'profile'
};

export default Traversal;
