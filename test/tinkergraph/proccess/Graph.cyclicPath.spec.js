import { TinkerFactory } from '../../../src';

describe('Graph cyclicPath', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V(1).both().both().cyclicPath(); should return "v[1]" 3 times', () => {
		const query = g.V(1).both().both().cyclicPath();
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const r = query.next();
			expect(r.toString()).toBe("v[1]");
		}
	});

	it('g.V(1).both().both().cyclicPath().path(); should return "v[1]" 3 times', () => {
		const query = g.V(1).both().both().cyclicPath().path();
		const values = ["[v[1], v[3], v[1]]", "[v[1], v[2], v[1]]", "[v[1], v[4], v[1]]"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const r = query.next();
			expect(r.toString()).toBe(values[i++]);
		}
	});
});