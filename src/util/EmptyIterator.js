let INSTANCE = null;

class EmptyIterator {
	constructor() {
		if (!INSTANCE) {
			INSTANCE = this;
		}
		return INSTANCE;
	}

	hasNext() {
		return false;
	}

	next() {
		throw ("No Such Element Exception");
	}

	static instance() {
		return new EmptyIterator();
	}
}

export { EmptyIterator }