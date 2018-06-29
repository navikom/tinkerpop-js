import { TinkerFactory, lte, inside } from '../../../src';

describe('Graph is', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().values("age").is(32).next(); should return 32', () => {
		expect(g.V().values('age').is(32).next()).toBe(32);
	});

	it('g.V().values("age").is(lte(30)); should return 29, 27', () => {
		const query = g.V().values("age").is(lte(30));
		const eges = [29, 27];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next()).toBe(eges[i++]);
		}
	});

	it('g.V().values("age").is(inside(30, 40)); should return 32, 35', () => {
		const query = g.V().values("age").is(inside(30, 40));
		const eges = [32, 35];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next()).toBe(eges[i++]);
		}
	});
});
