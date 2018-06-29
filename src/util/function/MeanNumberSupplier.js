import { MeanGlobalStep } from '../../proccess/traversal/step/map';

let INSTANCE = null;

export default class MeanNumberSupplier {

	constructor() {
		if (!INSTANCE) {
			INSTANCE = this;
		}

		return INSTANCE;
	}

	get() {
		return new MeanGlobalStep.MeanNumber();
	}

	static instance(){
		return new MeanNumberSupplier();
	}
}