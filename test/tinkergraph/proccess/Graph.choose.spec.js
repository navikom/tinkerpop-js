import { TinkerFactory, __, values, out, hasLabel, identity, lte } from '../../../src';

describe('Graph choose', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().hasLabel("person").choose(values("age").is(lte(30)), __.in(), out()).values("name"); ' +
		'should return ["marko", "ripple", "lop", "lop"', () => {
		const query = g.V().hasLabel("person").choose(values("age").is(lte(30)), __.in(), out()).values("name");
		const names = ["marko", "ripple", "lop", "lop"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next()).toBe(names[i++]);
		}
	});

	it('g.V().choose(hasLabel("person"), out("created")).values("name"); ' +
		'"lop", "lop", "ripple", "lop", "ripple", "lop"', () => {
		const query = g.V().choose(hasLabel("person"), out("created")).values("name");
		const names = ["lop", "lop", "ripple", "lop", "ripple", "lop"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next()).toBe(names[i++]);
		}
	});

	it('g.V().choose(hasLabel("person"), out("created"), identity()).values("name"); ' +
		'"lop", "lop", "ripple", "lop", "ripple", "lop"', () => {
		const query = g.V().choose(hasLabel("person"), out("created"), identity()).values("name");
		const names = ["lop", "lop", "ripple", "lop", "ripple", "lop"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next()).toBe(names[i++]);
		}
	});
});

