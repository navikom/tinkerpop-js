import { TinkerFactory } from '../../../src';

describe('Graph range', () => {

	const graph = TinkerFactory.createTheCrew();
	const g = graph.traversal();

	it('g.V().values("location").range(3, 6) should return "santa fe", "centreville", "dulles"', () => {
		const query = g.V().values("location").range(3, 6);
		const names = ["santa fe", "centreville", "dulles"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next()).toBe(names[i++]);
		}
	});
});
