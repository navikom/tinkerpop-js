import { List, ArrayUtils } from '../../../../util';
import { FlatMapStep } from './FlatMapStep';
import TraverserRequirement from '../../traverser/TraverserRequirement';
import PropertyType from '../../../../structure/PropertyType';

/**
 * PropertiesStep
 * @param traversal
 * @param propertyType
 * @param propertyKeys
 * @constructor
 */
function PropertiesStep(traversal, propertyType, ...propertyKeys) {
	FlatMapStep.call(this, traversal);
	this.returnType = propertyType;
	this.propertyKeys = ArrayUtils.checkArray(propertyKeys);
}

PropertiesStep.prototype = Object.create(FlatMapStep.prototype);
PropertiesStep.prototype.constructor = PropertiesStep;
PropertiesStep.prototype.flatMap = function(traverser) {
	return this.returnType === PropertyType.VALUE ?
		traverser.getValue().values(this.propertyKeys) :
		traverser.getValue().properties(this.propertyKeys);
};

PropertiesStep.prototype.getReturnType = function() {
	return this.returnType;
};

PropertiesStep.prototype.getPropertyKeys = function() {
	return this.propertyKeys;
};
PropertiesStep.prototype.getRequirements = function() {
	return new List([TraverserRequirement.OBJECT]);
};

export { PropertiesStep };
