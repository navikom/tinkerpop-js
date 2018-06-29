import { TinkerFactory, hasLabel, out, gt } from '../../../src';

describe('Graph not', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().not(hasLabel("person")).toList().length; should return 2', () => {
		const query = g.V().not(hasLabel("person"));
		expect(query.toList().length).toBe(2);
	});

	it('g.V().hasLabel("person").not(out("created").count().is(gt(1))).values("name"); ' +
		'should return "marko", "vadas", "peter"', () => {
		const query = g.V().hasLabel("person").not(out("created").count().is(gt(1))).values("name");
		const names = ["marko", "vadas", "peter"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next()).toBe(names[i++]);
		}
	});
});