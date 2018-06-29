import { TinkerFactory, decr, incr, outE, shuffle, local } from '../../../src';

describe('Graph order', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().values("name").order() should return "josh", "lop", "marko", "peter", "ripple", "vadas"', () => {
		const query = g.V().values("name").order();
		const names = ["josh", "lop", "marko", "peter", "ripple", "vadas"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next()).toBe(names[i++]);
		}
	});
});

describe('Graph order by', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().values("name").order().by(decr) should return "vadas", "ripple", "peter", "marko", "lop", "josh"', () => {
		const query = g.V().values("name").order().by(decr);
		const names = ["vadas", "ripple", "peter", "marko", "lop", "josh"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next()).toBe(names[i++]);
		}
	});

	it('g.V().hasLabel("person").order().by("age", incr).values("name") should return "vadas", "marko", "josh", "peter"', () => {
		const query = g.V().hasLabel("person").order().by("age", incr).values("name")
		const names = ["vadas", "marko", "josh", "peter"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next()).toBe(names[i++]);
		}
	});

	it('g.V().hasLabel("person").order().by(outE("created").count(), incr).by("age", incr).values("name") ' +
		'should return "vadas", "marko", "peter", "josh"', () => {
		const query = g.V().hasLabel("person").order().by(outE("created").count(), incr).by("age", incr).values("name");
		const names = ["vadas", "marko", "peter", "josh"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next()).toBe(names[i++]);
		}
	});

	it('g.V().hasLabel("person").order().by(outE("created").count(), incr).by("age", decr).values("name") ' +
		'should return "vadas", "peter", "marko", "josh"', () => {
		const query = g.V().hasLabel("person").order().by(outE("created").count(), incr).by("age", decr).values("name");
		const names = ["vadas", "peter", "marko", "josh"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next()).toBe(names[i++]);
		}
	});

	it('g.V().hasLabel("person").order().by(shuffle).values("name"); should return values always with different order', () => {
		let query = g.V().hasLabel("person").order().by(shuffle).values("name");
		const names = query.toList();
		expect(names.length > 0).toBe(true);

	});

	it('g.V().values("age").order(local).by(decr); order works for Collection-type objects. ' +
		'For any other object, the object is returned unchanged.', () => {
		const query = g.V().values("age").order(local).by(decr);
		const values = [29, 27, 32, 35];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next()).toBe(values[i++]);
		}
	});

});
