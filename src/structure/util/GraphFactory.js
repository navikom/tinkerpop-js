/**
 * Factory to construct new {@link org.apache.tinkerpop.gremlin.structure.Graph} instances from a
 * {@code Configuration} object or properties file.
 *
 * @author Stephen Mallette (http://stephen.genoprime.com)
 */
export default class GraphFactory {
	static open(traversal) {
		const graph = traversal.getGraph();
		return graph.class.open(graph.getConfiguration());
 }
}
