/**
 * HasContainerHolder
 * @constructor
 */
function HasContainerHolder() {

}

HasContainerHolder.prototype = {
  constructor: HasContainerHolder,
  removeHasContainer(hasContainer) {
    throw ('The holder does not support container removal: HasContainerHolder');
  },
};

export default HasContainerHolder;
