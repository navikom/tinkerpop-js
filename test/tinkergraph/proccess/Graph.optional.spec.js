import { TinkerFactory, __, out } from '../../../src';

describe('Graph optional', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V(2).optional(out("knows")).id().next(); should return 2', () => {
		expect(g.V(2).optional(out("knows")).id().next()).toBe(2);
	});

	it('g.V(2).optional(__.in("knows")).id().next(); should return 1', () => {
		expect(g.V(2).optional(__.in("knows")).id().next()).toBe(1);
	});

	it('g.V().hasLabel("person").optional(out("knows").optional(out("created"))).path(); ' +
		'should return "1->2", "1->4->5", "1->4->3", 2, 4, 6', () => {
		const query = g.V().hasLabel("person").optional(out("knows").optional(out("created"))).path();
		const values = ["1->2", "1->4->5", "1->4->3", 2, 4, 6];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const im = query.next();
			const it = im.iterator().toArray();
			let string = it.splice(0, 1)[0].id();
			it.map(v => string += '->' + v.id());
			expect(string).toBe(values[i++]);
		}
	});
});
