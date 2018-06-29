import { TinkerGraph, TinkerFactory,neq } from '../../../src';

describe('Graph profile', () => {
	TinkerGraph.open().clear();
	const g = TinkerFactory.createModern().traversal();

	it('g.V().out("created").profile().next().print(); should return table with 3 rows', () => {
		const query = g.V().out("created").profile();
		expect(query.next().print().length).toBe(3);
	});
});
