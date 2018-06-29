import TraverserRequirement from '../TraverserRequirement';
import O_OB_S_SE_SL_TraverserGenerator from '../O_OB_S_SE_SL_TraverserGenerator';
import LP_O_OB_S_SE_SL_TraverserGenerator from '../LP_O_OB_S_SE_SL_TraverserGenerator';
import LP_O_OB_P_S_SE_SL_TraverserGenerator from '../LP_O_OB_P_S_SE_SL_TraverserGenerator';
import B_O_TraverserGenerator from '../B_O_TraverserGenerator';
import B_LP_O_S_SE_SL_TraverserGenerator from '../B_LP_O_S_SE_SL_TraverserGenerator';
import B_LP_O_P_S_SE_SL_TraverserGenerator from '../B_LP_O_P_S_SE_SL_TraverserGenerator';
import B_O_S_SE_SL_TraverserGenerator from '../B_O_S_SE_SL_TraverserGenerator'


let INSTANCE = null;

/**
 * DefaultTraverserGeneratorFactory
 */
export default class DefaultTraverserGeneratorFactory {
	constructor() {
		if (!INSTANCE) {
			INSTANCE = this;
		}

		return INSTANCE;
	}

	getTraverserGenerator(requirements) {

		if (requirements.contains(TraverserRequirement.ONE_BULK)) {
			if (O_OB_S_SE_SL_TraverserGenerator.instance().getProvidedRequirements().containsAll(requirements)) {
				return O_OB_S_SE_SL_TraverserGenerator.instance();
			}

			if (LP_O_OB_S_SE_SL_TraverserGenerator.instance().getProvidedRequirements().containsAll(requirements)) {
				return LP_O_OB_S_SE_SL_TraverserGenerator.instance();
			}

			if (LP_O_OB_P_S_SE_SL_TraverserGenerator.instance().getProvidedRequirements().containsAll(requirements)) {
				return LP_O_OB_P_S_SE_SL_TraverserGenerator.instance();
			}
		} else {
			if (B_O_TraverserGenerator.instance().getProvidedRequirements().containsAll(requirements)) {
				return B_O_TraverserGenerator.instance();
			}

			if (B_O_S_SE_SL_TraverserGenerator.instance().getProvidedRequirements().containsAll(requirements)) {
				return B_O_S_SE_SL_TraverserGenerator.instance();
			}

			if (B_LP_O_S_SE_SL_TraverserGenerator.instance().getProvidedRequirements().containsAll(requirements)) {
				return B_LP_O_S_SE_SL_TraverserGenerator.instance();
			}

			if (B_LP_O_P_S_SE_SL_TraverserGenerator.instance().getProvidedRequirements().containsAll(requirements)) {
				return B_LP_O_P_S_SE_SL_TraverserGenerator.instance();
			}
		}
		throw ('The provided traverser generator factory does not support the requirements of the traversal');
	}

	static instance() {
		return new DefaultTraverserGeneratorFactory();
	}
}
