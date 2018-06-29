import { TinkerFactory, inject, unfold, count, local } from '../../../src';

describe('Graph unfold', () => {
	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('inject(1,[2,3,[4,5,[6]]]).unfold(); should return 1, 2, 3, [4, 5, [6]]', () => {
		const query = inject(1,[2,3,[4,5,[6]]]).unfold();
		expect(query.hasNext()).toBe(true);
		const numbers = [1, 2, 3, [4,5,[6]]];
		let i = 0;
		while (query.hasNext()){
			expect(query.next().toString()).toBe(numbers[i++].toString());
		}
	});

	it('inject(1,[2,3,[4,5,[6]]]).repeat(unfold()).until(count(local).is(1)).unfold(); ' +
		'should return 1, 2, 3, 4, 5, 6', () => {
		const query = inject(1,[2,3,[4,5,[6]]]).repeat(unfold()).until(count(local).is(1)).unfold();
		expect(query.hasNext()).toBe(true);
		const numbers = [1, 2, 3, 4, 5, 6];
		let i = 0;
		while (query.hasNext()){
			expect(query.next()).toBe(numbers[i++]);
		}
	});

	it('.V(1).out().fold().inject("gremlin",[1.23,2.34]).unfold(); ' +
		'should return 1, 2, 3, 4, 5, 6', () => {
		const query = g.V(1).out().fold().inject("gremlin",[1.23,2.34]).unfold();
		expect(query.hasNext()).toBe(true);
		const values = ["gremlin", 1.23, 2.34, 3, 2, 4];
		let i = 0;
		while (query.hasNext()){
			const value = query.next();
			expect(value.id ? value.id() : value).toBe(values[i++]);
		}
	});
});
