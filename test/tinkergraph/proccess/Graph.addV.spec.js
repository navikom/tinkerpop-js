import { TinkerGraph, TinkerFactory, outE, inE, gt } from '../../../src';

describe('Graph addV', () => {
	TinkerGraph.open().clear();
	const g = TinkerFactory.createModern().traversal();

	it('g.addV("person").property("name", "stephen").iterate(); g.V().values("name"); ' +
		'should return "marko", "vadas", "lop", "josh", "ripple", "peter", "stephen"', () => {
		g.addV("person").property("name", "stephen").iterate();
		const query = g.V().values("name");
		const names = ["marko", "vadas", "lop", "josh", "ripple", "peter", "stephen"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next()).toBe(names[i++]);
		}
	});

	it('g.V().outE("knows").addV().property("name","nothing").iterate(); g.V().has("name","nothing").count(); ' +
		'should return 2', () => {
		g.V().outE("knows").addV().property("name","nothing").iterate();
		const query = g.V().has("name","nothing").count();
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next()).toBe(2);
		}
	});
});
