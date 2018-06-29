import { TinkerFactory } from '../../../src';

describe('Graph groupCount', () => {
	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().hasLabel("person").values("age").groupCount(); should return "27: 1", "29: 1", "32: 1", "35: 1"', () => {
		const query = g.V().hasLabel("person").values("age").groupCount();
		const results = ["27: 1", "29: 1", "32: 1", "35: 1"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const map = query.next();
			map.forEach((entry) => {
				let result = entry.getKey() + ': ' + entry.getValue();
				expect(result).toBe(results[i++]);
			});
		}
	});

	it('g.V().hasLabel("person").groupCount().by("age"); should return "27: 1", "29: 1", "32: 1", "35: 1"', () => {
		const query = g.V().hasLabel("person").groupCount().by("age");
		const results = ["27: 1", "29: 1", "32: 1", "35: 1"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const map = query.next();
			map.forEach((entry) => {
				let result = entry.getKey() + ': ' + entry.getValue();
				expect(result).toBe(results[i++]);
			});
		}
	});
});
