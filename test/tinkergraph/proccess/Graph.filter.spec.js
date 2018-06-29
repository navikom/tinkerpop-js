import { has, hasLabel, TinkerGraph, TinkerFactory } from '../../../src';

describe('Graph filter', () => {
	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().filter(has("name", "marko")).next().value("name") should return "marko"', () => {
		const query = g.V().filter(has('name', 'marko'));
		expect(query.hasNext()).toBe(true);
		expect(query.next().value('name')).toBe('marko');
	});

	it('g.V().filter(hasLabel("software")).next().value("name") should return "lop", "ripple"', () => {
		const query = g.V().filter(hasLabel("software"));
		const names = ['lop', 'ripple'];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next().value('name')).toBe(names[i++]);
		}
	});
});
