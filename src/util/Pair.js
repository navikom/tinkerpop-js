/**
 * Pair
 */
export class Pair {

	constructor(value0, value1) {
		this.val0 = value0;
		this.val1 = value1;
	}

	getValue0() {
		return this.val0;
	}

	getValue1() {
		return this.val1;
	}

	static with(value0, value1) {
		return new Pair(value0, value1);
	}
}