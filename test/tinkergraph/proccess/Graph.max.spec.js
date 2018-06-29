import { TinkerFactory, both } from '../../../src';

describe('Graph max', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().values("age").max().next(); should return 35', () => {
		expect(g.V().values("age").max().next()).toBe(35);
	});

	it('g.V().values("age").max().next(); should return 35', () => {
		expect(g.V().repeat(both()).times(3).values("age").max().next()).toBe(35);
	});
});
