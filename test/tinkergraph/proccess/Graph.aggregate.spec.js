import { TinkerGraph, TinkerFactory, without } from '../../../src';

describe('Graph aggregate', () => {
	TinkerGraph.open().clear();
	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V(1).out("created").aggregate("x").next().id(); should return 3', () => {
		expect(g.V(1).out('created').aggregate('x').next().id()).toBe(3);
	});

	it('g.V(1).out("created").aggregate("x").in("created"); should return 1, 4, 6', () => {
		const query = g.V(1).out('created').aggregate('x').in("created");
		expect(query.hasNext()).toBe(true);
		const ids = [1, 4, 6];
		let i = 0;
		while (query.hasNext()){
			expect(query.next().id()).toBe(ids[i++]);
		}
	});

	it('g.V(1).out("created").aggregate("x").in("created").out("created"); should return 3, 5, 3, 3', () => {
		const query = g.V(1).out("created").aggregate("x").in("created").out("created");
		expect(query.hasNext()).toBe(true);
		const ids = [3, 5, 3, 3];
		let i = 0;
		while (query.hasNext()){
			expect(query.next().id()).toBe(ids[i++]);
		}
	});

	it('g.V(1).out("created").aggregate("x").in("created").out("created").where(without("x")).values("name").next(); ' +
		'should return "ripple"', () => {
		expect(g.V(1).out("created").aggregate("x").in("created").out("created").where(without("x")).values("name").next())
			.toBe("ripple");
	});

	it('g.V().out("knows").aggregate("x").cap("x"); should return 2, 4', () => {
		const query = g.V().out("knows").aggregate("x").cap("x");
		expect(query.hasNext()).toBe(true);
		const ids = [2, 4];
		let i = 0;
		while (query.hasNext()){
			const bulk = query.next();
			bulk.forEach((v) => expect(v.id()).toBe(ids[i++]));
		}
	});

	it('g.V().out("knows").aggregate("x").by("name").cap("x"); should return 2, 4', () => {
		const query = g.V().out("knows").aggregate("x").by("name").cap("x");
		expect(query.hasNext()).toBe(true);
		const ids = ["vadas", "josh"];
		let i = 0;
		while (query.hasNext()){
			const bulk = query.next();
			bulk.forEach((v) => expect(v).toBe(ids[i++]));
		}
	});
});
