import { TinkerFactory } from '../../../src';

describe('Graph count', () => {

	const graph = TinkerFactory.createTheCrew();
	const g = graph.traversal();

	it('g.V().values("location").count().next() should return 14', () => {
		expect(g.V().values("location").count().next()).toBe(14);
	});
});
