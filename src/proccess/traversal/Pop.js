const Pop = {

  /**
   * The first item in an ordered collection (i.e. <code>collection[0]</code>)
   */
  first: 'first',
  /**
   * The last item in an ordered collection (i.e. <code>collection[collection.size()-1]</code>)
   */
  last: 'last',
  /**
   * Get all the items and return them as a list.
   */
  all: 'all',
  /**
   * Get the items as either a list (for multiple) or an object (for singles).
   */
  mixed: 'mixed',
};

Pop.contains = (value) => value in Pop;

export default Pop;
