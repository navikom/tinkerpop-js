import { List } from './List';

export class Comparator {
	static naturalOrder() {
		return NaturalOrderComparator.instance();
	}

	static reverseOrder() {
		return ReverseComparator.instance();
	}

	static compare(x, y) {
		return (x < y) ? -1 : ((x == y) ? 0 : 1);
	}
}

let INSTANCE = null;
class NaturalOrderComparator {

	constructor() {
		if (!INSTANCE) {
			INSTANCE = this;
		}
		return INSTANCE;
	}

	compare(c1, c2) {
		return Comparator.compare(c1, c2);
	}

	static instance() {
		return new NaturalOrderComparator();
	}
}

let REVERSE_ORDER = null;
class ReverseComparator {

	constructor() {
		if (!REVERSE_ORDER) {
			REVERSE_ORDER = this;
		}
		return REVERSE_ORDER;
	}

	compare(c1, c2) {
		return Comparator.compare(c2, c1);
	}

	static instance() {
		return new ReverseComparator();
	}
}
