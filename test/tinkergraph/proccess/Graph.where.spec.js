import { TinkerFactory, out, gte, __ } from '../../../src';


describe('Graph where', () => {
	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().where(out("created")).values("name"); should return "marko", "josh", "peter"', () => {
		const query = g.V().where(out("created")).values("name");
		const names = ["marko", "josh", "peter"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()) {
			expect(query.next()).toBe(names[i++]);
		}
	});

	it('g.V().out("knows").where(out("created")).values("name")next(); should return "josh"', () => {
		expect(g.V().out("knows").where(out("created")).values("name").next()).toBe("josh");
	});

	it('g.V().where(out("created").count().is(gte(2))).values("name").next(); should return "josh"', () => {
		expect(g.V().where(out("created").count().is(gte(2))).values("name").next()).toBe("josh");
	});

	it('g.V().where(__.not(out("created"))).where(__.in("knows")).values("name"); should return "vadas"', () => {
		expect(g.V().where(__.not(out("created"))).where(__.in("knows")).values("name").next()).toBe("vadas");
	});

});
