import { TinkerGraph, TinkerFactory, outE, values, label } from '../../../src';

describe('Graph coalesce', () => {
	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V(1).coalesce(outE("knows"), outE("created")).inV().path().by("name").by(label()); ' +
		'should return "marko", "knows", "vadas", "marko", "knows", "josh"', () => {
		const query = g.V(1).coalesce(outE("knows"), outE("created")).inV().path().by("name").by(label());
		expect(query.hasNext()).toBe(true);
		const names = ["marko", "knows", "vadas", "marko", "knows", "josh"];
		let i = 0;
		while (query.hasNext()){
			query.next().forEach((value) => expect(value).toBe(names[i++]));
		}
	});

	it('g.V(1).coalesce(outE("created"), outE("knows")).inV().path().by("name").by(label()); ' +
		'should return "marko", "created", "lop"', () => {
		const query = g.V(1).coalesce(outE("created"), outE("knows")).inV().path().by("name").by(label());
		expect(query.hasNext()).toBe(true);
		const names = ["marko", "created", "lop"];
		let i = 0;
		while (query.hasNext()){
			query.next().forEach((value) => expect(value).toBe(names[i++]));
		}
	});

	it('g.V(1).property("nickname", "okram").iterate(); ' +
		'g.V().hasLabel("person").coalesce(values("nickname"), values("name")); ' +
		'should return "okram", "vadas", "josh", "peter"', () => {
		g.V(1).property("nickname", "okram").iterate();
		const query = g.V().hasLabel("person").coalesce(values("nickname"), values("name"));
		expect(query.hasNext()).toBe(true);
		const names = ["okram", "vadas", "josh", "peter"];
		let i = 0;
		while (query.hasNext()){
			expect(query.next()).toBe(names[i++]);
		}
	});
});
