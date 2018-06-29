import { TinkerFactory, out, both } from '../../../src';

describe('Graph map with traversal', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().map(out()) should return "lop", "ripple", "lop"', () => {
		const query = g.V().map(out());
		const names = ['lop', 'ripple', 'lop'];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next().value('name')).toBe(names[i++]);
		}
	});

	it('g.V().map(both("knows")) should return "vadas", "marko", "marko"', () => {
		const query = g.V().map(both('knows'));
		const names = ['vadas', 'marko', 'marko'];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next().value('name')).toBe(names[i++]);
		}
	});

});

describe('Graph map with predicate', () => {
	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().out("knows").map((t) => `${t.get().value("name")} is the friend name`) ' +
		'should return "vadas is the friend name", "josh is the friend name"', () => {
		const query = g.V().out("knows").map((t) => `${t.get().value("name")} is the friend name`);
		const names = ["vadas", "josh"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next()).toBe(`${names[i++]} is the friend name`);
		}
	});
});