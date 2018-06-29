import { List } from '../../../util';
import { MatchStep } from '../step/map';

/**
 * PathUtil
 */
export default class PathUtil {
	static getReferencedLabelsAfterStep(step) {
		const labels = new List();
		while (step.constructor.name !== 'EmptyStep') {
			labels.addAll(PathUtil.getReferencedLabels(step));
			step = step.getNextStep();
		}
		return labels;
	}

	static getReferencedLabels(step) {
		const referencedLabels = new List();

		if (step.getParameters) {
			const parameters = step.getParameters();
			for (let i = 0; i < parameters.getTraversals().size(); i++) {
				const trav = parameters.getTraversals().get(i);
				for (let j = 0; j < trav.getSteps().size(); j++) {
					const ss = trav.getSteps().get(j);
					if (ss.getScopeKeys) {
						for (let h = 0; h < ss.getScopeKeys(); h++) {
							const label = ss.getScopeKeys().get(h);
							referencedLabels.add(label);
						}
					}
				}
			}
		}

		if (step.getScopeKeys) {
			const labels = step.getScopeKeys();
			if (step instanceof MatchStep) {
				// if this is the last step, keep everything, else just add founds
				if (step.getNextStep().constructor.name === 'EmptyStep') {
					labels.addAll(step.getMatchEndLabels());
					labels.addAll(step.getMatchStartLabels());
				}
			}
			referencedLabels.addAll(labels);

		}

		return referencedLabels;
	}
}
