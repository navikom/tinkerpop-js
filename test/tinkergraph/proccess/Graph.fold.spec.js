import { TinkerFactory, Operator } from '../../../src';

describe('Graph fold', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V(1).out("knows").values("name").fold(); should return "vadas", "josh"', () => {
		const query = g.V(1).out("knows").values("name").fold();
		const names = ["vadas", "josh"];
		let i = 0;
		expect(query.hasNext()).toBe(true);

		while (query.hasNext()){
			query.next().forEach((name) => expect(name).toBe(names[i++]))
		}
	});

	it('g.V().values("age").fold(0, Operator.sum).next(); should return 123', () => {
		expect(g.V().values("age").fold(0, Operator.sum).next()).toBe(123);
	});

	it('g.V().values("age").fold(0, { apply: (a, b) => a + b }).next(); should return 123', () => {
		expect(g.V().values("age").fold(0, { apply: (a, b) => a + b }).next()).toBe(123);
	});
});
