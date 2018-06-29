import { Map } from '../';
let INSTANCE = null;

/**
 * HashMapSupplier
 */
export default class HashMapSupplier{
	constructor() {
		if (!INSTANCE) {
			INSTANCE = this;
		}

		return INSTANCE;
	}
	get() {
		return new Map();
	}
	static instance(){
		return new HashMapSupplier();
	}
}