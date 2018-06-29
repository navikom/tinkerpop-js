import { TinkerFactory, __, bothE } from '../../../src';

describe('Graph store', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().store("x").limit(1).cap("x") should return "[v[1], v[2]]"', () => {
		const query = g.V().store("x").limit(1).cap("x");
		expect(query.next().toString()).toBe("[v[1], v[2]]");
	});

	it('g.E().store("x").by("weight").cap("x"); should return "[0.5, 1, 1, 0.4, 0.4, 0.2]"', () => {
		const query = g.E().store("x").by("weight").cap("x");
		expect(query.next().toString()).toBe("[0.5, 1, 1, 0.4, 0.4, 0.2]");
	});
});
