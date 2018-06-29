import { TinkerFactory } from '../../../src';

describe('Graph path', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().out("knows").path() should return "marko" and "vadas", "marko" and "josh"', () => {
		const query = g.V().out('knows').path();
		const names = ["vadas", "josh"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const im = query.next();
			const it = im.iterator().toArray();
			expect(it[0].value('name')).toBe("marko");
			expect(it[1].value('name')).toBe(names[i++]);
		}
	});

	it('g.V().in("knows").path() should return "vadas" and "marko", "josh" and "marko"', () => {
		const query = g.V().in('knows').path();
		const names = ["vadas", "josh"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const im = query.next();
			const it = im.iterator().toArray();
			expect(it[0].value('name')).toBe(names[i++]);
			expect(it[1].value('name')).toBe("marko");
		}
	});
});