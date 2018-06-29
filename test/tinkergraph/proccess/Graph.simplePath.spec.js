import { TinkerFactory } from '../../../src';

describe('Graph simplePath', () => {
	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V(1).both().both().simplePath() ' +
		'should return "1->3->4", "1->3->6", "1->4->5", "1->4->3"', () => {
		const query = g.V(1).both().both().simplePath();
		const ids = [4, 6, 5, 3];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const v = query.next();
			expect(v.id()).toBe(ids[i++]);
		}
	});

	it('g.V(1).both().both().simplePath().path() ' +
		'should return "1->3->4", "1->3->6", "1->4->5", "1->4->3"', () => {
		const query = g.V(1).both().both().simplePath().path();
		const values = ["1->3->4", "1->3->6", "1->4->5", "1->4->3"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const imp = query.next();
			let string = '';
			imp.forEach((o, l, i) => string += i === 0 ? o.id() : '->' + o.id());
			expect(string).toBe(values[i++]);
		}
	});

});

