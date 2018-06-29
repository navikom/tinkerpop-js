import { TinkerFactory } from '../../../src';

describe('Graph dedup', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().values("lang").dedup().toList().length should return 1', () => {
		expect(g.V().values("lang").toList().length).toBe(2);
		const query = g.V().values("lang").dedup();
		expect(query.toList().length).toBe(1);
	});
});
