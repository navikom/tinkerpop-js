import { TinkerFactory } from '../../../src';

describe('Graph inV', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V(4).outE().inV() should return "ripple", "lop"', () => {
		const query = g.V(4).outE().inV();
		const names = ["ripple", "lop"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while(query.hasNext()){
			expect(query.next().value("name")).toBe(names[i++]);
		}
	});

});