import { TinkerFactory } from '../../../src';

describe('Graph outE', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().outE("knows") should return 7, 8', () => {
		const query = g.V().outE("knows");
		const ids = [7, 8];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while(query.hasNext()){
			expect(query.next().id()).toBe(ids[i++]);
		}
	});
});
