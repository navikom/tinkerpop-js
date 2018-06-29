import { TinkerGraph, TinkerFactory, hasLabel, values, constant } from '../../../src';

describe('Graph coalesce', () => {
	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().choose(hasLabel("person"), values("name"), constant("inhuman")); ' +
		'should return "marko", "vadas", "inhuman", "josh", "inhuman", "peter"', () => {
		const query = g.V().choose(hasLabel("person"), values("name"), constant("inhuman"));
		expect(query.hasNext()).toBe(true);
		const names = ["marko", "vadas", "inhuman", "josh", "inhuman", "peter"];
		let i = 0;
		while (query.hasNext()){
			expect(query.next()).toBe(names[i++]);
		}
	});

	it('g.V().coalesce(hasLabel("person").values("name"), constant("inhuman")); ' +
		'should return "marko", "vadas", "inhuman", "josh", "inhuman", "peter"', () => {
		const query = g.V().coalesce(hasLabel("person").values("name"), constant("inhuman"));
		expect(query.hasNext()).toBe(true);
		const names = ["marko", "vadas", "inhuman", "josh", "inhuman", "peter"];
		let i = 0;
		while (query.hasNext()){
			expect(query.next()).toBe(names[i++]);
		}
	});

});
