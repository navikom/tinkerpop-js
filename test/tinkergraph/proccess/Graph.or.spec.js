import { TinkerFactory, outE, inE, gt } from '../../../src';

describe('Graph or', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().or(outE("created"), inE("created").count().is(gt(1))).values("name"); ' +
		'should return "marko", "lop", "josh", "peter"', () => {
		const query = g.V().or(outE("created"), inE("created").count().is(gt(1))).values("name");
		const names = ["marko", "lop", "josh", "peter"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next()).toBe(names[i++]);
		}

	});

	it('g.V().where(outE("created").or().outE("knows")).values("name"); should return "marko", "josh", "peter"', () => {
		const query = g.V().where(outE("created").or().outE("knows")).values("name");
		const names = ["marko", "josh", "peter"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next()).toBe(names[i++]);
		}
	});
});