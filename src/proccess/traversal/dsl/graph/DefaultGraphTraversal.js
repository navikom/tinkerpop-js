import { mixin } from '../../../../util';
import DefaultTraversal from '../../util/DefaultTraversal';
import GraphTraversal from './GraphTraversal';
import EmptyGraph from '../../../../structure/util/empty/EmptyGraph';
import GlobalCache from '../../GlobalCache';
import StringFactory from '../../../../structure/util/StringFactory';

/**
 *
 * @constructor
 */
function DefaultGraphTraversal(traversalSource) {
  if (traversalSource) {
    DefaultTraversal.call(this, traversalSource.getGraph(), traversalSource.getStrategies(), traversalSource.getBytecode());
  } else {
    DefaultTraversal.call(this, EmptyGraph.instance(), GlobalCache.getStrategies());
  }
  GraphTraversal.call(this);
}

DefaultGraphTraversal.prototype = {
  constructor: DefaultGraphTraversal,
  asAdmin() {
    return this;
  },
  clone() {
    return DefaultTraversal.prototype.clone.call(this);
  },
  toString() {
    return StringFactory.traversalString(this);
  }
};

mixin(DefaultGraphTraversal, DefaultTraversal.prototype, GraphTraversal.prototype);

export default DefaultGraphTraversal;
