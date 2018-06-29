import {isNull} from '../../../util';
import TraversalParent from './TraversalParent';
import IdentityTraversal from '../lambda/IdentityTraversal';
import TokenTraversal from '../lambda/TokenTraversal';
import ElementValueTraversal from '../lambda/ElementValueTraversal';
import T from '../../../structure/T';

const ElementRequirement = {
	ID: 'ID',
	LABEL: 'LABEL',
	PROPERTIES: 'PROPERTIES',
	EDGES: 'EDGES'
};

/**
 * PathProcessor
 */
class PathProcessor {
	getMaxRequirement() {
		let max = ElementRequirement.ID;
		if (this.propType === TraversalParent.TYPE) {
			for (let i = 0; i < this.getLocalChildren().size(); i++) {
				const traversal = this.getLocalChildren().getValue(i);
				if (traversal instanceof IdentityTraversal) {
					if (max !== ElementRequirement.ID)
						max = ElementRequirement.ID;
				} else if (traversal instanceof TokenTraversal && traversal.getToken() === T.id) {
					if (max !== ElementRequirement.ID)
						max = ElementRequirement.ID;
				} else if (traversal instanceof TokenTraversal && traversal.getToken() === T.label) {
					if (max !== ElementRequirement.LABEL)
						max = ElementRequirement.LABEL;
				} else if (traversal instanceof ElementValueTraversal) {
					if (max !== ElementRequirement.PROPERTIES)
						max = ElementRequirement.PROPERTIES;
				} else {
					max = ElementRequirement.EDGES;
				}
			}
		}
		return max;
	}


	static processTraverserPathLabels(traverser, labels) {
		if (!isNull(labels)) traverser.keepLabels(labels);
		//console.log('processTraverserPathLabels', labels, traverser)
		return traverser;
	}
}

PathProcessor.ElementRequirement = ElementRequirement;
export default PathProcessor;