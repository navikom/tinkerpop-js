import { TinkerFactory } from '../../../src';

describe('Graph toList', () => {
	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('TinkerFactory.createModern(); g.V().toList().length should return 6', () => {
		expect(g.V().toList().length).toBe(6);
	});
	it('g.E().toList().length should return 6', () => {
		expect(g.E().toList().length).toBe(6);
	});
	it('g.V().hasLabel("person").toList().length should return 4', () => {
		expect(g.V().hasLabel("person").toList().length).toBe(4);
	});
});
