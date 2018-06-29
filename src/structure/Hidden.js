const Hidden = {};

/**
 * The prefix to denote that a key is a hidden key.
 */
Hidden.HIDDEN_PREFIX = '~';
Hidden.HIDDEN_PREFIX_LENGTH = Hidden.HIDDEN_PREFIX.length;

/**
 * Turn the provided key into a hidden key. If the key is already a hidden key, return key.
 *
 * @param key The key to make a hidden key
 * @return The hidden key
 */
Hidden.hide = (key) => {
  return Hidden.isHidden(key) ? key : Hidden.HIDDEN_PREFIX.concat(key);
};

/**
 * Turn the provided hidden key into an non-hidden key. If the key is not a hidden key, return key.
 *
 * @param key The hidden key
 * @return The non-hidden representation of the key
 */
Hidden.unHide = (key) => {
  return Hidden.isHidden(key) ? key.substring(Hidden.HIDDEN_PREFIX_LENGTH) : key;
};

/**
 * Determines whether the provided key is a hidden key or not.
 *
 * @param key The key to check for hidden status
 * @return Whether the provided key is a hidden key or not
 */
Hidden.isHidden = (key) => {
  return typeof key === 'string' && key.startsWith(Hidden.HIDDEN_PREFIX);
};


export default Hidden;
