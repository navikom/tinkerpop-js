import Hidden from '../Hidden';
import T from '../T';
import Vertex from '../Vertex';
import Edge from '../Edge';
import Property from '../Property';
import VertexProperty from '../VertexProperty';
import EmptyVertexProperty from './empty/EmptyVertexProperty';
import { Map, List, Optional, ArrayUtils } from '../../util';

/**
 * ElementHelper
 */
export default class ElementHelper {
	/**
	 * Determine whether the {@link Element} label can be legally set. This is typically used as a pre-condition check.
	 *
	 * @param label the element label
	 */
	static validateLabel(label) {
		if (label === null) {
			throw ('label Can Not Be Null');
		}
		if (label === '') {
			throw ('label Can Not Be Null');
		}
		if (Hidden.isHidden(label)) {
			throw (`label Can Not Be A Hidden Key (${label})`);
		}

		return true;
	}

	/**
	 * Determines whether the property key/value for the specified thing can be legally set. This is typically used as
	 * a pre-condition check prior to setting a property.
	 *
	 * @param key   the key of the property
	 * @param value the value of the property
	 * @throws IllegalArgumentException whether the key/value pair is legal and if not, a clear reason exception
	 *                                  message is provided
	 */
	static validateProperty(key, value) {
		if (value === null || value === undefined) {
			throw ('property Value Can Not Be Null');
		}
		if (key === null || key === undefined) {
			throw ('property Key Can Not Be Null');
		}
		if (Hidden.isHidden(key)) {
			throw (`property Key Can Not Be A Hidden Key (${key})`);
		}
	}

	/**
	 * Determines whether a list of key/values are legal, ensuring that there are an even number of values submitted
	 * and that the key values in the list of arguments are {@link String} or {@link org.apache.tinkerpop.gremlin.structure.Element} objects.
	 *
	 * @param propertyKeyValues a list of key/value pairs
	 * @throws IllegalArgumentException if something in the pairs is illegal
	 */
	static legalPropertyKeyValueArray(...propertyKeyValues) {
		propertyKeyValues = ArrayUtils.checkArray(propertyKeyValues);
		//console.log(propertyKeyValues)
		if (propertyKeyValues.length % 2 !== 0) {
			throw ('provided Key Values Must Be A MultipleOfTwo');
		}
		for (let i = 0; i < propertyKeyValues.length; i += 2) {
			if (typeof propertyKeyValues[i] !== 'string' && Object.values(T).indexOf(propertyKeyValues[0]) === -1) {
				throw ('provided Key Values Must Have A Legal Key On Even Indices');
			}
		}
	}

	/**
	 * Extracts the value of the {@link T#id} key from the list of arguments.
	 *
	 * @param keyValues a list of key/value pairs
	 * @return the value associated with {@link T#id}
	 */
	static getIdValue(...keyValues) {
		keyValues = ArrayUtils.checkArray(keyValues);
		for (let i = 0; i < keyValues.length; i += 2) {
			if (keyValues[i] === T.id) {
				return Optional.of(keyValues[i + 1]);
			}
		}
		return Optional.empty();
	}

	/**
	 * Remove a key from the set of key/value pairs. Assumes that validations have already taken place to
	 * assure that key positions contain strings and that there are an even number of elements. If after removal
	 * there are no values left, the key value list is returned as empty.
	 *
	 * @param keyToRemove the key to remove
	 * @param keyValues   the list to remove the accessor from
	 * @return the key/values without the specified accessor or an empty array if no values remain after removal
	 */
	static remove(keyToRemove, ...keyValues) {
		keyValues = ArrayUtils.checkArray(keyValues);
		keyToRemove = parseInt(keyToRemove);
		if (keyValues.length % 2 !== 0 || keyValues.length < keyToRemove * 2) return Optional.empty();

		keyValues.splice(keyToRemove * 2 - 2, 2);
		return Optional.of(keyValues);
	}

	/**
	 * Append a key/value pair to a list of existing key/values. If the key already exists in the keyValues then
	 * that value is overwritten with the provided value.
	 */
	static upsert(keyValues, key, val) {
		if (ElementHelper.getKeys(keyValues).indexOf(key) === -1) {
			return keyValues.concat([key, val]);
		}

		const kvs = [];
		for (let i = 0; i < keyValues.length; i += 2) {
			kvs[i] = keyValues[i];
			if (keyValues[i] === key) {
				kvs[i + 1] = val;
			} else {
				kvs[i + 1] = keyValues[i + 1];
			}
		}

		return kvs;
	}

	/**
	 * Replaces one key with a different key.
	 *
	 * @param keyValues the list of key/values to alter
	 * @param oldKey    the key to replace
	 * @param newKey    the new key
	 */
	static replaceKey(keyValues, oldKey, newKey) {
		const kvs = [];
		for (let i = 0; i < keyValues.length; i += 2) {
			if (keyValues[i] === oldKey) {
				kvs[i] = newKey;
			} else {
				kvs[i] = keyValues[i];
			}
			kvs[i + 1] = keyValues[i + 1];
		}

		return kvs;
	}

	/**
	 * Converts a set of key values to a Map.  Assumes that validations have already taken place to
	 * assure that key positions contain strings and that there are an even number of elements.
	 */
	static asMap(...keyValues) {
		keyValues = ArrayUtils.checkArray(keyValues);
		const map = new Map();
		for (let i = 0; i < keyValues.length; i += 2) {
			map.put(keyValues[i], keyValues[i + 1]);
		}
		return map;
	}


	/**
	 * Gets the list of keys from the key values.
	 *
	 * @param keyValues a list of key/values pairs
	 */
	static getKeys(...keyValues) {
		keyValues = ArrayUtils.checkArray(keyValues);
		const keys = [];
		for (let i = 0; i < keyValues.length; i += 2) {
			keys.push(keyValues[i]);
		}
		return keys;
	}

	/**
	 * Extracts the value of the {@link T#label} key from the list of arguments.
	 *
	 * @param keyValues a list of key/value pairs
	 * @return the value associated with {@link T#label}
	 */
	static getLabelValue(...keyValues) {
		keyValues = ArrayUtils.checkArray(keyValues);
		for (let i = 0; i < keyValues.length; i += 2) {
			if (keyValues[i] === T.label) {
				ElementHelper.validateLabel(keyValues[i + 1]);
				return Optional.of(keyValues[i + 1]);
			}
		}
		return Optional.empty();
	}

	/**
	 * Assign key/value pairs as properties to an {@link org.apache.tinkerpop.gremlin.structure.Element}.  If the value of {@link T#id} or
	 * {@link T#label} is in the set of pairs, then they are ignored.
	 *
	 * @param element           the graph element to assign the {@code propertyKeyValues}
	 * @param propertyKeyValues the key/value pairs to assign to the {@code element}
	 */
	static attachProperties(element, cardinality, ...propertyKeyValues) {
		if (!element) {
			throw ('argument Can Not Be Null');
		}
		propertyKeyValues = ArrayUtils.checkArray(propertyKeyValues);

		if(Array.isArray(cardinality)){
			propertyKeyValues = cardinality.concat(propertyKeyValues);
		}
		for (let i = 0; i < propertyKeyValues.length; i += 2) {
			if (propertyKeyValues[i] !== T.id && propertyKeyValues[i] !== T.label) {
				if (element.type === Vertex.TYPE) {
					if (cardinality) {
						element.property(cardinality, propertyKeyValues[i], propertyKeyValues[i + 1]);
					} else {
						element.property(element.getGraph().features().vertex()
							.getCardinality(propertyKeyValues[i]), propertyKeyValues[i], propertyKeyValues[i + 1]);
					}
				} else {
					element.property(propertyKeyValues[i], propertyKeyValues[i + 1]);
				}
			}
		}
	}

	/**
	 * This is a helper method for dealing with vertex property cardinality and typically used in {@link Vertex#property(org.apache.tinkerpop.gremlin.structure.VertexProperty.Cardinality, String, Object, Object...)}.
	 * If the cardinality is list, simply return {@link Optional#empty}.
	 * If the cardinality is single, delete all existing properties of the provided key and return {@link Optional#empty}.
	 * If the cardinality is set, find one that has the same key/value and attached the properties to it and return it. Else, if no equal value is found, return {@link Optional#empty}.
	 *
	 * @param vertex      the vertex to stage a vertex property for
	 * @param cardinality the cardinality of the vertex property
	 * @param key         the key of the vertex property
	 * @param value       the value of the vertex property
	 * @param keyValues   the properties of vertex property
	 * @param <V>         the type of the vertex property value
	 * @return a vertex property if it has been found in set with equal value
	 */
	static stageVertexProperty(vertex, cardinality, key, value, ...keyValues) {
		keyValues = ArrayUtils.checkArray(keyValues);

		if (cardinality === VertexProperty.Cardinality.single) {
			vertex.properties(key).forEachRemaining((elem) => elem.remove());

		} else if (cardinality === VertexProperty.Cardinality.sets) {
			const itty = vertex.properties(key);

			while (itty.hasNext()) {
				const property = itty.next();
				if (property.value() === value) {
					ElementHelper.attachProperties(property, keyValues);
					return Optional.of(property);
				}
			}
		} // do nothing on Cardinality.list

		return Optional.empty();
	}

	/**
	 * Retrieve the properties associated with a particular element.
	 * The result is a Object[] where odd indices are String keys and even indices are the values.
	 *
	 * @param element          the element to retrieve properties from
	 * @param includeId        include Element.ID in the key/value list
	 * @param includeLabel     include Element.LABEL in the key/value list
	 * @param propertiesToCopy the properties to include with an empty list meaning copy all properties
	 * @return a key/value array of properties where odd indices are String keys and even indices are the values.
	 */
	static getProperties(element, includeId, includeLabel, propertiesToCopy) {
		const keyValues = new List();
		if (includeId) {
			keyValues.add(T.id);
			keyValues.add(element.id());
		}
		if (includeLabel) {
			keyValues.add(T.label);
			keyValues.add(element.label());
		}
		element.keys().forEach((key) => {
			if (propertiesToCopy.isEmpty() || propertiesToCopy.contains(key)) {
				keyValues.add(key);
				keyValues.add(element.value(key));
			}
		});
		return keyValues.array.slice();
	}

	/**
	 * A standard method for determining if two {@link org.apache.tinkerpop.gremlin.structure.Element} objects are equal. This method should be used by any
	 * {@link Object#equals(Object)} implementation to ensure consistent behavior. This method is used for Vertex, Edge, and VertexProperty.
	 *
	 * @param a The first {@link org.apache.tinkerpop.gremlin.structure.Element}
	 * @param b The second {@link org.apache.tinkerpop.gremlin.structure.Element} (as an {@link Object})
	 * @return true if elements and equal and false otherwise
	 */
	static areEqual(a, b) {
		if (b === null || a === null) {
			return false;
		}

		if (a === b) {
			return true;
		}

		if ((a.type === Vertex.TYPE && b.type === Vertex.TYPE) ||
			(a.type === Edge.TYPE && b.type === Edge.TYPE) ||
			(a.type === VertexProperty.TYPE && b.type === VertexProperty.TYPE)) {
			return this.areEqualElement(a, b);
		} else if ((b.propType === Property.TYPE)) {
			return this.areEqualProperty(a, b);
		}

		return false;
	}

	static areEqualElement(a, b) {
		if (!((a.type === Vertex.TYPE && b.type === Vertex.TYPE) ||
			(a.type === Edge.TYPE && b.type === Edge.TYPE) ||
			(a.type === VertexProperty.TYPE && b.type === VertexProperty.TYPE))) {
			return false;
		}

		return b !== null && a !== null && (a == b || ElementHelper.haveEqualIds(a, b));
	}

	/**
	 * Simply tests if the value returned from {@link org.apache.tinkerpop.gremlin.structure.Element#id()} are {@code equal()}.
	 *
	 * @param a the first {@link org.apache.tinkerpop.gremlin.structure.Element}
	 * @param b the second {@link org.apache.tinkerpop.gremlin.structure.Element}
	 * @return true if ids are equal and false otherwise
	 */
	static haveEqualIds(a, b) {
		return a.id() === b.id();
	}


	/**
	 * A standard method for determining if two {@link org.apache.tinkerpop.gremlin.structure.Property} objects are equal. This method should be used by any
	 * {@link Object#equals(Object)} implementation to ensure consistent behavior.
	 *
	 * @param a the first {@link org.apache.tinkerpop.gremlin.structure.Property}
	 * @param b the second {@link org.apache.tinkerpop.gremlin.structure.Property}
	 * @return true if equal and false otherwise
	 */
	static areEqualProperty(a, b) {
		if (!(b.propType === Property.TYPE)) {
			return false;
		}
		if (!a.isPresent() && !b.isPresent()) {
			return true;
		}
		if (!a.isPresent() && b.isPresent() || a.isPresent() && !b.isPresent()) {
			return false;
		}
		return a.getKey() === b.getKey() && a.getValue() === b.getValue() && areEqual(a.element(), b.element());
	}

	static propertyValueMap(element, ...propertyKeys) {
		propertyKeys = ArrayUtils.checkArray(propertyKeys);
		const values = new Map();
		element.properties(propertyKeys).forEachRemaining(property => values.put(property.key(), property.value()));
		return values;
	}

	static propertyMap(element, ...propertyKeys) {
		const propertyMap = new Map();
		element.properties(propertyKeys).forEachRemaining(property => propertyMap.put(property.key(), property));
		return propertyMap;
	}

	static vertexPropertyValueMap(vertex, ...propertyKeys) {
		const valueMap = new Map();
		vertex.properties(propertyKeys).forEachRemaining((property) => {
			if (valueMap.contains(property.key())) {
				valueMap.get(property.key()).add(property.value());
			} else {
				const list = new List();
				list.add(property.value());
				valueMap.put(property.key(), list);
			}
		});
		return valueMap;
	}

	static vertexPropertyMap(vertex, ...propertyKeys) {
		propertyKeys = ArrayUtils.checkArray(propertyKeys);
		const propertyMap = new Map();
		vertex.properties(propertyKeys).forEachRemaining((property) => {
			if (propertyMap.contains(property.key())) {
				propertyMap.get(property.key()).add(property);
			} else {
				const list = new List();
				list.add(property);
				propertyMap.put(property.key(), list);
			}
		});
		return propertyMap;
	}

	static keyExists(key, ...providedKeys) {
		providedKeys = ArrayUtils.checkArray(providedKeys);
		if (Hidden.isHidden(key)) return false;
		if (providedKeys.length === 0) return true;
		if (providedKeys.length === 1) return key === providedKeys[0];

		for (let i = 0; i < providedKeys.length; i++) {
			if (providedKeys[i] === key) {
				return true;
			}
		}
		return false;
	}

	static idExists(id, ...providedIds) {
		providedIds = ArrayUtils.checkArray(providedIds);
		if (providedIds.length === 0) return true;

		// it is OK to evaluate equality of ids via toString() now given that the toString() the test suite
		// enforces the value of id.()toString() to be a first class representation of the identifier
		if (providedIds.length === 1) return `${id}` === `${providedIds[0]}`;

		for (let i = 0; i < providedIds.length; i++) {
			if (`${providedIds[i]}` === `${id}`) {
				return true;
			}
		}
		return false;
	}

	static hashCode(element) {
		if (element.id)
			return element.id().toString();
		else {
			return element.key().toString() + '' + element.value().toString();
		}
	}
}
