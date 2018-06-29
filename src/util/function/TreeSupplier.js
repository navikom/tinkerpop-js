import Tree from '../../proccess/traversal/step/util/Tree';

let INSTANCE = null;

export default class TreeSupplier {

	constructor() {
		if (!INSTANCE) {
			INSTANCE = this;
		}

		return INSTANCE;
	}

	get() {
		return new Tree();
	}

	static instance(){
		return new TreeSupplier();
	}
}
