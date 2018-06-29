import { TinkerFactory } from '../../../src';

describe('Graph tree', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().out().out().tree().by("name").next(); tree.get("marko").get("josh").size() should return 2', () => {
		const query = g.V().out().out().tree().by("name");
		expect(query.hasNext()).toBe(true);
		const tree = query.next();
		expect(tree.get("marko").get("josh").size()).toBe(2);
	});

	it('g.V().out().out().tree().by("name").next(); should return "marko", "josh", "ripple", "lop"', () => {
		const query = g.V().out().out().tree().by("name");
		expect(query.hasNext()).toBe(true);
		const tree = query.next();
		const names = ["marko", "josh", "ripple", "lop"];
		let i = 0;
		const traverse = (tree, key) => {
			expect(key).toBe(names[i++]);
			const child = tree.get(key);
			if(child.size() > 0)
				child.keys().forEach((k) => traverse(child, k));
		};

		tree.keys().forEach((k) => traverse(tree, k));
	});

	it('g.V().out().out().tree().next(); should return "marko", "josh", "ripple", "lop"', () => {
		const query = g.V().out().out().tree();
		expect(query.hasNext()).toBe(true);
		const tree = query.next();
		const names = ["marko", "josh", "ripple", "lop"];
		let i = 0;
		const traverse = (tree, key) => {
			expect(key.value("name")).toBe(names[i++]);
			const child = tree.get(key);
			if(child.size() > 0)
				child.keys().forEach((k) => traverse(child, k));
		};

		tree.keys().forEach((k) => traverse(tree, k));
	});

	it('g.V().out().out().tree().by("name").next() should return "ripple", "lop"', () => {
		const query = g.V().out().out().tree().by("name");
		expect(query.hasNext()).toBe(true);
		const tree = query.next().getObjectsAtDepth(3);
		const names = ["ripple", "lop"];
		let i = 0;
		tree.forEach((value) => expect(value).toBe(names[i++]))
	});
});
