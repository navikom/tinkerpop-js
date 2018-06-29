import { TinkerFactory } from '../../../src';

describe('Graph as', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().as("a").out().as("b").out().as("c").toList().length should return 2', () => {
		const query = g.V().as("a").out().as("b").out().as("c");
		expect(query.toList().length).toBe(2);
	});
});