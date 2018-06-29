import { TinkerFactory, list } from '../../../src';

describe('Graph property', () => {

	it('g.V().property("name", "john") should return "john" 6 times', () => {
		const graph = TinkerFactory.createModern();
		const g = graph.traversal();
		const query = g.V().property("name", "john");
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next().value('name')).toBe('john');
			i++;
		}
		expect(i).toBe(6);
	});

	it('g.V(1).property(list, "name", "m. a. rodriguez"); should return "marko", "m. a. rodriguez"', () => {
		const graph = TinkerFactory.createModern();
		const g = graph.traversal();
		g.V(1).property(list, "name", "m. a. rodriguez");
		let i = 0;
		const names = ["marko", "m. a. rodriguez"];
		const query = g.V(1).values("name");
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next()).toBe(names[i++]);
		}
	});
});
