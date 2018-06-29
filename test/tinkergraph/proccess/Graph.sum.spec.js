import { TinkerFactory, both } from '../../../src';

describe('Graph sum', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().values("age").sum().next(); should return 123', () => {
		expect(g.V().values("age").sum().next()).toBe(123);
	});

	it('g.V().values("age").sum().next(); should return 1471', () => {
		expect(g.V().repeat(both()).times(3).values("age").sum().next()).toBe(1471);
	});
});