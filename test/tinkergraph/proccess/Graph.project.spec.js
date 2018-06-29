import { TinkerFactory, __, select, outE, inE, decr } from '../../../src';

describe('Graph project', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().out("created").project("a","b").by("name").by(__.in("created").count())' +
		'.order().by(select("b"),decr).select("a"); ' +
		'should return "lop", "lop", "lop", "ripple"', () => {
		const query = g.V().out("created").project("a","b").by("name")
			.by(__.in("created").count()).order().by(select("b"), decr).select("a");
		const names = ["lop", "lop", "lop", "ripple"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while(query.hasNext()){
			expect(query.next().toString()).toBe(names[i++]);
		}
	});

	it('g.V().has("name","marko").project("out","in").by(outE().count()).by(inE().count()); ' +
		'should return {out=3, in=0}', () => {
		const query = g.V().has("name","marko").project("out","in").by(outE().count()).by(inE().count());
		expect(query.hasNext()).toBe(true);
		while(query.hasNext()){
			expect(query.next().toString()).toBe("{out=3, in=0}");
		}
	});
});
