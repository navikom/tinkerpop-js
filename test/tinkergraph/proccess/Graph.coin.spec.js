import { TinkerFactory } from '../../../src';

describe('Graph coin', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().coin(0.5); should return random values', () => {
		const query = g.V().coin(0.5);
		expect(query.hasNext()).toBe(query.hasNext());
		const list = query.toList();
		expect(list.length).toBe(list.length);
	});

	it('g.V().coin(0.0); should return false', () => {
		const query = g.V().coin(0.0);
		expect(query.hasNext()).toBe(false);
	});

	it('g.V().coin(1.0); should return true', () => {
		const query = g.V().coin(1.0);
		expect(query.hasNext()).toBe(true);
	});
});
