/**
 * This is a marker interface stating that the {@link org.apache.tinkerpop.gremlin.process.traversal.Step} contains a
 * lambda/anonymous function. This information is typically used by a {@link org.apache.tinkerpop.gremlin.process.traversal.TraversalStrategy}
 * in a verification stage as lambdas are not serializable and thus, can not be propagated over the network.
 *
 * @author Marko A. Rodriguez (http://markorodriguez.com)
 */
function LambdaHolder(){
}
LambdaHolder.prototype = {
	constructor: LambdaHolder,
	lambdaHolderType: 'LambdaHolder'
};

export default LambdaHolder;
