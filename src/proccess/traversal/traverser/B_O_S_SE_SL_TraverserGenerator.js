import { List } from '../../../util';
import TraverserRequirement from './TraverserRequirement';
import TraverserGenerator from './util/TraverserGenerator';
import B_O_S_SE_SL_Traverser from './B_O_S_SE_SL_Traverser';

let INSTANCE = null;

/**
 * B_O_S_SE_SL_TraverserGenerator
 */
export default class B_O_S_SE_SL_TraverserGenerator extends TraverserGenerator {
	constructor() {
		super();
		if (!INSTANCE) {
			INSTANCE = this;
		}

		this.REQUIREMENTS = new List([
			TraverserRequirement.BULK,
			TraverserRequirement.OBJECT,
			TraverserRequirement.SACK,
			TraverserRequirement.SIDE_EFFECTS,
			TraverserRequirement.SINGLE_LOOP]);

		return INSTANCE;
	}

	generate(start, startStep, initialBulk) {
		return new B_O_S_SE_SL_Traverser(start, startStep, initialBulk);
	}

	getProvidedRequirements() {
		return this.REQUIREMENTS;
	}

	static instance(){
		return new B_O_S_SE_SL_TraverserGenerator();
	}
}