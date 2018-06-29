import { TinkerFactory } from '../../../src';

describe('Graph limit', () => {

	const graph = TinkerFactory.createTheCrew();
	const g = graph.traversal();

	it('g.V().values("location").limit(3) should return "san diego", "santa cruz", "brussels"', () => {
		const query = g.V().values("location").limit(3);
		const names = ["san diego", "santa cruz", "brussels"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next()).toBe(names[i++]);
		}
	});
});
