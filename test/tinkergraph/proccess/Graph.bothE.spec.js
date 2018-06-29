import { TinkerFactory } from '../../../src';

describe('Graph bothE', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V(4).bothE().toList().length should return 3', () => {
		expect(g.V(4).bothE().toList().length).toBe(3);
	});

	it('g.V(4).bothE("created").toList().length should return 2', () => {
		expect(g.V(4).bothE("created").toList().length).toBe(2);
	});
});
