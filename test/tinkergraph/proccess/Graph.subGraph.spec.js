import { TinkerFactory, inE } from '../../../src';

describe('Graph subGraph', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.E().hasLabel("knows").subgraph("subGraph").cap("subGraph"); should return 7, 8', () => {
		const query = g.E().hasLabel("knows").subgraph("subGraph").cap("subGraph");
		const subGraph = query.next();
		const ids = [7, 8];
		const subQuery = subGraph.traversal().E().id();
		let i = 0;
		subQuery.toList().forEach((id) => expect(id).toBe(ids[i++]));
	});

	it('g.V(3).repeat(inE().subgraph("subGraph").outV()).times(3).cap("subGraph"); should return 9, 11, 12, 8', () => {
		const query = g.V(3).repeat(inE().subgraph("subGraph").outV()).times(3).cap("subGraph");
		const subGraph = query.next();
		const ids = [9, 11, 12, 8];
		const subQuery = subGraph.traversal().E().id();
		let i = 0;
		subQuery.toList().forEach((id) => expect(id).toBe(ids[i++]));
	});

});
