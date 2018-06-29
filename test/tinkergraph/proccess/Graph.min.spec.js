import { TinkerFactory, both } from '../../../src';

describe('Graph min', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().values("age").min().next(); should return 27', () => {
		expect(g.V().values("age").min().next()).toBe(27);
	});

	it('g.V().values("age").min().next(); should return 27', () => {
		expect(g.V().repeat(both()).times(3).values("age").min().next()).toBe(27);
	});
});
