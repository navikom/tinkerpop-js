import { TinkerFactory, both } from '../../../src';

describe('Graph mean', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().values("age").mean().next(); should return 30.75', () => {
		expect(g.V().values("age").mean().next()).toBe(30.75);
	});

	it('g.V().repeat(both()).times(3).values("age").mean().next(); should return 30.645833333333332', () => {
		expect(g.V().repeat(both()).times(3).values("age").mean().next()).toBe(30.645833333333332);
	});

	it('g.V().repeat(both()).times(3).values("age").dedup().mean().next(); should return 30.75', () => {
		expect(g.V().repeat(both()).times(3).values("age").dedup().mean().next()).toBe(30.75);
	});
});
