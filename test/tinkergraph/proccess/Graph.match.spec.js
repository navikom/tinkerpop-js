import { TinkerFactory, __ } from '../../../src';

describe('Graph match', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().match(__.as("a").out("created").has("name", "lop")' +
		'.as("b"),__.as("b").in("created").has("age", 29).as("c")).select("a","c").by("name") ' +
		'should return "[a:marko,c:marko]", "[a:josh,c:marko]", "[a:peter,c:marko]"', () => {
		const query = g.V().match(
			__.as("a").out("created").has("name", "lop").as("b"),
			__.as("b").in("created").has("age", 29).as("c")).
		select("a","c").by("name");
		const values = ["[a:marko,c:marko]", "[a:josh,c:marko]", "[a:peter,c:marko]"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const im = query.next();
			let string = '[';
			im.map((it) => string += (it.cursor > 0 ? ',' : '') + `${it.getKey()}:${it.getValue()}`);
			string += ']';
			expect(string).toBe(values[i++]);
		}
	});

	it('g.V().match(__.as("a").out("created").as("b"),__.as("b").has("name", "lop"),__.as("b").in("created")' +
		'.as("c"),__.as("c").has("age", 29)).select("a","c").by("name"); ' +
		'should return "[a:marko,c:marko]", "[a:josh,c:marko]", "[a:peter,c:marko]"', () => {
		const query = g.V().match(
			__.as("a").out("created").as("b"),
			__.as("b").has("name", "lop"),
			__.as("b").in("created").as("c"),
			__.as("c").has("age", 29)).
		select("a","c").by("name");
		const values = ["[a:marko,c:marko]", "[a:josh,c:marko]", "[a:peter,c:marko]"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const im = query.next();
			let string = '[';
			im.map((it) => string += (it.cursor > 0 ? ',' : '') + `${it.getKey()}:${it.getValue()}`);
			string += ']';
			expect(string).toBe(values[i++]);
		}
	});
});
