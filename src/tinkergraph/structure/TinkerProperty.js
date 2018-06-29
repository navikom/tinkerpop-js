import { mixin, isNull } from '../../util';
import StringFactory from '../../structure/util/StringFactory';
import Property from '../../structure/Property';
import ElementHelper from '../../structure/util/ElementHelper';
import Edge from '../../structure/Edge';
import { TinkerHelper } from './TinkerHelper';

/**
 * TinkerProperty
 * @param element
 * @param key
 * @param value
 * @constructor
 */
function TinkerProperty(element, key, value) {
	this._element = element;
	this._key = key;
	this._value = value;
}

TinkerProperty.prototype = {
	constructor: TinkerProperty,

	element() {
		return this._element;
	},

	key() {
		return this._key;
	},

	value() {
		return this._value;
	},

	isPresent() {
		return this._value !== null;
	},

	equals(object) {
		return ElementHelper.areEqual(this, object);
	},


	remove() {
		if (this.element instanceof Edge) {
			TinkerHelper.removeIndex(this._element, this._key, this._value);
		}
		this._element._properties.remove(this._key);
	},

	hashCode() {
		return ElementHelper.hashCode(this);
	},
	toString() {
		return StringFactory.propertyString(this);
	}
};

mixin(TinkerProperty, Property.prototype);

export { TinkerProperty };
