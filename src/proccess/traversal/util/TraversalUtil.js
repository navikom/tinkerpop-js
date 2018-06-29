import { isNull } from '../../../util';
import Traverser from '../Traverser';

/**
 * TraversalUtil
 */
export default class TraversalUtil {

	static apply(traverser, traversal) {
		let split;
		if (typeof traverser !== 'string' && traverser.split) {
			split = traverser.split();
			split.setSideEffects(traversal.getSideEffects());
			split.setBulk(1);
			traversal.reset();
			traversal.addStart(split);
		} else {
			const start = traverser;
			traversal.reset();
			traversal.addStart(traversal.getTraverserGenerator().generate(start, traversal.getStartStep(), 1));
		}
		try {

			const trav = traversal.next(); // map
			return trav;
		} catch (e) {
			throw (`The provided traverser does not map to a value: ${split.constructor.name}->${traversal.constructor.name}`);
		}

	}

	static applyAll(traverser, traversal) {
		const split = traverser.split();
		// split.setSideEffects(traversal.getSideEffects());
		split.setBulk(1);
		traversal.reset();
		traversal.addStart(split);
		return traversal; // flatmap
	}

	static test(traverser, traversal, end) {
		if (traverser.constructor && traverser.constructor.name.indexOf('Traverser') > -1) {
			const split = traverser.split();
			//console.log('test', split);
			split.setSideEffects(traversal.getSideEffects());

			split.setBulk(1);

			traversal.reset();
			traversal.addStart(split);
			if (!end) {
				return traversal.hasNext(); // filter
			} else {
				const endStep = traversal.getEndStep();
				while (traversal.hasNext()) {
					if (endStep.next().getValue() === end)
						return true;
				}
				return false;
			}
		} else {
			traversal.reset();
			traversal.addStart(traversal.getTraverserGenerator().generate(traverser, traversal.getStartStep(), 1));
			if (!end) {
				return traversal.hasNext(); // filter
			} else {
				const endStep = traversal.getEndStep();
				while (traversal.hasNext()) {
					if (endStep.next().getValue() === end)
						return true;
				}
				return false;
			}
		}
	}

	static applyNullable(traverser, traversal) {
		return isNull(traversal)
			? traverser.get ? traverser.get() : traverser : TraversalUtil.apply(traverser, traversal);

	}

	// ///////
	// public static final <S, E> Iterator<E> applyAll(final S start, final Traversal.Admin<S, E> traversal) {
	//  traversal.reset();
	//  traversal.addStart(traversal.getTraverserGenerator().generate(start, traversal.getStartStep(), 1l));
	//  return traversal; // flatMap
	// }


}
