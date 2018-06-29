import { Iterator } from './Iterator';

/**
 * ArrayIterator
 */
export class ArrayIterator extends Iterator{

	constructor(array) {
		super(array);
		this.array = array;
		this.current = 0;
	}

	hasNext() {
		return this.current < this.array.length;
	}

	next() {
		if (this.hasNext()) {
			this.current++;
			return this.array[this.current - 1];
		} else {
			throw ("No Such Element Exception");
		}
	}
}
