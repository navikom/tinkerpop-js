import { mixin, ArrayUtils, Map, List } from '../../../../util';
import { MapStep } from './MapStep';
import T from '../../../../structure/T';
import Vertex from '../../../../structure/Vertex';
import PropertyType from '../../../../structure/PropertyType';
import VertexProperty from '../../../../structure/VertexProperty';
import TraversalParent from '../TraversalParent';
import TraversalUtil from '../../util/TraversalUtil';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 *
 * @param traversal
 * @param includeTokens
 * @param propertyType
 * @param propertyKeys
 * @constructor
 */
function PropertyMapStep(traversal, includeTokens, propertyType, ...propertyKeys) {
	MapStep.call(this, traversal);
	this.includeTokens = includeTokens;
	this.propertyKeys = ArrayUtils.checkArray(propertyKeys);
	this.returnType = propertyType;
	this.propertyTraversal = null;
}

PropertyMapStep.prototype = Object.create(MapStep.prototype);
PropertyMapStep.prototype.constructor = PropertyMapStep

mixin(PropertyMapStep, TraversalParent.prototype);

PropertyMapStep.prototype.map = function(traverser) {
	const map = new Map();
	const element = traverser.get();
	const isVertex = traverser.get().type === Vertex.TYPE;
	const properties = null === this.propertyTraversal ?
		element.properties(this.propertyKeys) :
		TraversalUtil.applyAll(traverser, this.propertyTraversal);
	while (properties.hasNext()) {
		const property = properties.next();
		if (isVertex) {
			let values = map.get(property.key());
			if (null === values || undefined === values) {
				values = new List();
				map.put(property.key(), values);
			}
			values.add(this.returnType === PropertyType.VALUE ? property.value() : property);
		} else
			map.put(property.key(), this.returnType === PropertyType.VALUE ? property.value() : property);
	}
	if (this.returnType === PropertyType.VALUE && this.includeTokens) {
		// add tokens, as string keys
		if (element.type === VertexProperty.TYPE) {
			map.put(T.id.id, element.id());
			map.put(T.key.key, element.key());
			map.put(T.value.value, element.value());
		} else {
			map.put(T.id.id, element.id());
			map.put(T.label.label, element.label());
		}
	}

	return map;
};

PropertyMapStep.prototype.getLocalChildren = function() {
	return null === this.propertyTraversal ? new List() : new List([this.propertyTraversal]);
};

PropertyMapStep.prototype.setPropertyTraversal = function(propertyTraversal) {
	this.propertyTraversal = this.integrateChild(propertyTraversal);
};

PropertyMapStep.prototype.getReturnType = function() {
	return this.returnType;
};

PropertyMapStep.prototype.getPropertyKeys = function() {
	return this.propertyKeys;
};

PropertyMapStep.prototype.isIncludeTokens = function() {
	return this.includeTokens;
};

PropertyMapStep.prototype.clone = function() {
	const clone = MapStep.prototype.clone.call(this);
	if (null !== this.propertyTraversal)
		clone.propertyTraversal = this.propertyTraversal.clone();
	return clone;
};


PropertyMapStep.prototype.setTraversal = function(parentTraversal) {
	MapStep.prototype.setTraversal.call(this, parentTraversal);
	if (null !== this.propertyTraversal)
		this.integrateChild(this.propertyTraversal);
};

PropertyMapStep.prototype.getRequirements = function() {
	return this.getSelfAndChildRequirements(TraverserRequirement.OBJECT);
};

export { PropertyMapStep };

