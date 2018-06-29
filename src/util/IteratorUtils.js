import { DoubleIterator, SingleIterator, List, ArrayUtils, Iterator } from './';

/**
 * IteratorUtils
 */
export class IteratorUtils {

	static of(a, b) {
		if (b) {
			return new DoubleIterator(a, b);
		}
		return new SingleIterator(a);
	}

	// /////////////

	static fill(iterator, collection) {
		while (iterator.hasNext()) {
			collection.add(iterator.next());
		}
		return collection;
	}

	static iterate(iterator) {
		while (iterator.hasNext()) {
			iterator.next();
		}
	}

	static count(iterator) {
		let ix = 0;
		for (; iterator.hasNext(); ++ix) iterator.next();
		return ix;
	}

	static ount(iterable) {
		return IteratorUtils.count(iterable.iterator());
	}

	static list(iterator, comparator) {
		if (!comparator) {
			return IteratorUtils.fill(iterator, new List());
		}
		const l = list(iterator);
		// Collections.sort(l, comparator);
		return l;
	}

	static anyMatch(iterator, predicate) {
		while (iterator.hasNext()) {
			if (predicate(iterator.next())) {
				return true;
			}
		}

		return false;
	}


	static map(iterator, callback) {
		while (iterator.hasNext()) {
			callback(iterator.next());
		}
	}

	// ///////////////////

	static concat(...iterators) {
		iterators = ArrayUtils.checkArray(iterators);
		const array = [];
		iterators.map((entry) => array.concat(entry.toArray()));
		return new Iterator(array);
	}
}
