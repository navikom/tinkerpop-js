import { List } from '../';
let INSTANCE = null;

/**
 * HashMapSupplier
 */
export default class ArrayListSupplier{
	constructor() {
		if (!INSTANCE) {
			INSTANCE = this;
		}

		return INSTANCE;
	}
	get() {
		return new List();
	}
	static instance(){
		return new ArrayListSupplier();
	}
}
