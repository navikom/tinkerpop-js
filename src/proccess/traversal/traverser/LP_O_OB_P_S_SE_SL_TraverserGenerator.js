import { IterateIterator, List } from '../../../util';
import TraverserRequirement from './TraverserRequirement';
import TraverserGenerator from './util/TraverserGenerator';
import LP_O_OB_P_S_SE_SL_Traverser from './LP_O_OB_P_S_SE_SL_Traverser';

let INSTANCE = null;

/**
 * LP_O_OB_P_S_SE_SL_TraverserGenerator
 */
export default class LP_O_OB_P_S_SE_SL_TraverserGenerator extends TraverserGenerator {
	constructor() {
		super();
		if (!INSTANCE) {
			INSTANCE = this;
		}


		this.REQUIREMENTS = new List([
			TraverserRequirement.LABELED_PATH,
			TraverserRequirement.OBJECT,
			TraverserRequirement.ONE_BULK,
			TraverserRequirement.PATH,
			TraverserRequirement.SACK,
			TraverserRequirement.SIDE_EFFECTS,
			TraverserRequirement.SINGLE_LOOP]);

		return INSTANCE;
	}

	generate(start, startStep, initialBulk) {
		return new LP_O_OB_P_S_SE_SL_Traverser(start, initialBulk);
	}

	getProvidedRequirements() {
		return this.REQUIREMENTS;
	}

	static instance(){
		return new LP_O_OB_P_S_SE_SL_TraverserGenerator();
	}

}
