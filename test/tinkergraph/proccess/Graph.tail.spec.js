import { TinkerFactory, tail, unfold, local } from '../../../src';

describe('Graph tail', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().values("name").order().tail().next(); should return "vadas"', () => {
		expect(g.V().values("name").order().tail().next()).toBe("vadas");
	});

	it('g.V().values("name").order().tail(1).next(); should return "vadas"', () => {
		expect(g.V().values("name").order().tail(1).next()).toBe("vadas");
	});

	it('g.V().values("name").order().tail(3); should return "peter", "ripple", "vadas"', () => {
		const query = g.V().values("name").order().tail(3);
		const names = ["peter", "ripple", "vadas"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next()).toBe(names[i++]);
		}
	});

	it('g.V().as("a").out().as("a").out().as("a").select("a").by(tail(local)).values("name"); ' +
		'should return "ripple", "lop"', () => {
		const query = g.V().as("a").out().as("a").out().as("a").select("a").by(tail(local)).values("name");
		const names = ["ripple", "lop"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next()).toBe(names[i++]);
		}
	});

	it('g.V().as("a").out().as("a").out().as("a").select("a").by(unfold().values("name").fold()).tail(local); ' +
		'should return "ripple", "lop"', () => {
		const query = g.V().as("a").out().as("a").out().as("a").select("a").by(unfold().values("name").fold()).tail(local);
		const names = ["ripple", "lop"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next()).toBe(names[i++]);
		}
	});

	it('g.V().as("a").out().as("a").out().as("a").select("a").by(unfold().values("name").fold()).tail(local, 2); ' +
		'should return "[ripple]", "[lop]"', () => {
		const query = g.V().as("a").out().as("a").out().as("a")
			.select("a").by(unfold().values("name").fold()).tail(local, 2);
		const names = ["[ripple]", "[lop]"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next().toString()).toBe(names[i++]);
		}
	});

	it('g.V().valueMap().tail(local); ' +
		'should return "ripple", "lop"', () => {
		const query =  g.V().valueMap().tail(local);
		const names = ["{age=[29]}", "{age=[27]}", "{lang=[java]}", "{age=[32]}", "{lang=[java]}", "{age=[35]}"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next().toString()).toBe(names[i++]);
		}
	});
});
