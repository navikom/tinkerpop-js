import { TinkerFactory, __, out } from '../../../src';

describe('Graph union', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V(4).union(__.in().values("age"), out().values("lang")); ' +
		'should return 29, "java", "java"', () => {
		const query = g.V(4).union(__.in().values("age"), out().values("lang"));
		const values = [29, "java", "java"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next()).toBe(values[i++]);
		}
	});

	it('g.V(4).union(__.in().values("age"), out().values("lang")).path(); ' +
		'should return "4->1->29", "4->5->java", "4->3->java"', () => {
		const query = g.V(4).union(__.in().values("age"), out().values("lang")).path();
		const values = ["4->1->29", "4->5->java", "4->3->java"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const im = query.next();
			const it = im.iterator().toArray();
			let string = it.splice(0, 1)[0].id();
			it.map((entry) => string += '->' + (entry.id ? entry.id() : entry));
			expect(string).toBe(values[i++]);
		}
	});
});
