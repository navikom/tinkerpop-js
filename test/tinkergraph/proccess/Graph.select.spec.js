import { TinkerFactory, __, out, has, hasLabel, neq } from '../../../src';

describe('Graph select', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().as("a").out().as("b").out().as("c").select("a","b","c") ' +
		'should return "marko" -> "josh" -> "ripple", "marko" -> "josh" -> "lop"', () => {
		const query = g.V().as("a").out().as("b").out().as("c").select("a","b","c");
		const names = ["marko", "josh", "ripple", "marko", "josh", "lop"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()) {
			const entry = query.next();
			entry.getKeys().toArray().map((key) => {
				expect(entry.get(key).value("name")).toBe(names[i++]);
			});
		}
	});

	it('g.V().as("a").out().as("b").out().as("c").select("a","b") ' +
		'should return "marko" -> "josh", "marko" -> "josh"', () => {
		const query = g.V().as("a").out().as("b").out().as("c").select("a","b");
		const names = ["marko", "josh", "marko", "josh"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()) {
			const entry = query.next();
			entry.getKeys().toArray().map((key) => {
				expect(entry.get(key).value("name")).toBe(names[i++]);
			});
		}
	});

	it('g.V().as("a").out().as("b").out().as("c").select("a","b").by("name") ' +
		'should return "marko" -> "josh", "marko" -> "josh"', () => {
		const query = g.V().as("a").out().as("b").out().as("c").select("a","b").by("name");
		const names = ["marko", "josh", "marko", "josh"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()) {
			const entry = query.next();
			entry.getKeys().toArray().map((key) => {
				expect(entry.get(key)).toBe(names[i++]);
			});
		}
	});

	it('g.V().as("a").out().as("b").out().as("c").select("a") ' +
		'should return "marko"', () => {
		const query = g.V().as("a").out().as("b").out().as("c").select("a");
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()) {
			expect(query.next().value("name")).toBe("marko");
		}
	});

	it('g.V().as("x").out().out().select("x") ' +
		'should return "marko"', () => {
		const query = g.V().as("x").out().out().select("x");
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()) {
			expect(query.next().value("name")).toBe("marko");
		}
	});

	it('g.V().out().as("x").out().select("x") ' +
		'should return "josh"', () => {
		const query = g.V().out().as("x").out().select("x");
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()) {
			expect(query.next().value("name")).toBe("josh");
		}
	});

	it('g.V().out().out().as("x").select("x").toList().length ' +
		'should return 2', () => {
		const query = g.V().out().out().as("x").select("x");
		expect(query.toList().length).toBe(2);
	});

	it('g.V().as("a").in().as("b").where("a", neq("b")).select("a","b").by("name") ' +
		'should return "vadas"->"marko", "lop"->"marko", "lop"->"josh", ' +
		'"lop"->"peter", "josh"->"marko", "ripple"->"josh"', () => {
		const query = g.V().as("a").in().as("b").where("a", neq("b")).select("a","b").by("name");
		const names = ["vadas", "marko", "lop", "marko", "lop", "josh", "lop", "peter", "josh", "marko", "ripple", "josh"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const entry = query.next();
			entry.getKeys().toArray().map((key) => {
				expect(entry.get(key)).toBe(names[i++]);
			});
		}
	});

	it('g.V().as("a").out("created").in("created").as("b").select("a","b")' +
		'.where("a",neq("b")).where(__.as("a").out("knows").as("b")).select("a","b").by("name"); ' +
		'should return "marko"->"josh"', () => {
		const query = g.V().as('a').out('created').in('created').as('b').
		select('a','b').where('a',neq('b')).where(__.as('a').out('knows').as('b')).
		select('a','b').by('name');
		const names = ["marko", "josh"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const entry = query.next();
			entry.getKeys().toArray().map((key) => {
				expect(entry.get(key)).toBe(names[i++]);
			});
		}
	});
});
