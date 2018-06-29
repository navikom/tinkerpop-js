import { TinkerFactory, inject } from '../../../src';

describe('Graph inject', () => {
	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V(4).out().values("name").inject("daniel"); should return "daniel", "ripple", "lop"', () => {
		const query = g.V(4).out().values("name").inject("daniel");
		expect(query.hasNext()).toBe(true);
		const names = ["daniel", "ripple", "lop"];
		let i = 0;
		while (query.hasNext()){
			expect(query.next()).toBe(names[i++]);
		}
	});

	it('g.V(4).out().values("name").inject("daniel"); should return "daniel", "ripple", "lop"', () => {
		const query = g.V(4).out().values("name").inject("daniel").map((it) => it.get().length);
		expect(query.hasNext()).toBe(true);
		const sizes = [6, 6, 3];
		let i = 0;
		while (query.hasNext()){
			expect(query.next()).toBe(sizes[i++]);
		}
	});

	it('g.V(4).out().values("name").inject("daniel"); should return "daniel", "ripple", "lop"', () => {
		const query = inject(1, 2).map((it) => it.get() + 1).map((it) => g.V(it.get()).next()).values("name");
		expect(query.hasNext()).toBe(true);
		const sizes = ["vadas", "lop"];
		let i = 0;
		while (query.hasNext()){
			expect(query.next()).toBe(sizes[i++]);
		}
	});
});
