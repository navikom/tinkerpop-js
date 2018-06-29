import Hidden from './Hidden';
/**
 * A collection of (T)okens which allows for more concise Traversal definitions.
 * T implements {@link Function} can be used to map an element to its token value.
 * For example, <code>T.id.apply(element)</code>.
 *
 */
const T = {

  fromString(accessor) {
    if (accessor.equals(T.LABEL)) {
      return T.label;
    } else if (accessor.equals(T.ID)) {
      return T.id;
    }
    else if (accessor.equals(T.KEY)) {
      return T.key;
    } else if (accessor.equals(T.VALUE)) {
      return T.value;
    }
    throw (`The following token string is unknown: ${accessor}`);
  },
};

/**
 * Label (representing Element.label())
 */
T.label = {
  label: 'label',
  getAccessor() {
    return T.LABEL;
  },

  apply(element) {
    return element.label();
  },
};
/**
 * Id (representing Element.id())
 */
T.id = {
  id: 'id',
  getAccessor() {
    return T.ID;
  },

  apply(element) {
    return element.id();
  },
};
/**
 * Key (representing Property.key())
 */
T.key = {
  key: 'key',
  getAccessor() {
    return T.KEY;
  },

  apply(element) {
    return element.key();
  },
};
/**
 * Value (representing Property.value())
 */
T.value = {
  value: 'value',
  getAccessor() {
    return T.VALUE;
  },

  apply(element) {
    return element.value();
  },
};

T.contains = (value) => [T.id, T.label, T.key, T.value].indexOf(value) > -1;

T.containsKey = (value) => [T.id.id, T.label.label].indexOf(value) > -1;

T.LABEL = Hidden.hide('label');
T.ID = Hidden.hide('id');
T.KEY = Hidden.hide('key');
T.VALUE = Hidden.hide('value');

export default T;

export { T }