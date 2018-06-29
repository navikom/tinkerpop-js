import { TinkerFactory } from '../../../src';

describe('Graph id', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.E().id(); should return 7, 8, 9, 10, 11, 12', () => {
		const query = g.E().id();
		const ids = [7, 8, 9, 10, 11, 12];
		let i = 0;
		query.toList().forEach((id) => expect(id).toBe(ids[i++]));
	});
});