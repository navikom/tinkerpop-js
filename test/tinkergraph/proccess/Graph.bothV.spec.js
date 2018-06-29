import { TinkerFactory } from '../../../src';

describe('Graph bothV', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V(4).inE().bothV() should return "marko", "josh"', () => {
		const query = g.V(4).inE().bothV();
		const names = ["marko", "josh"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while(query.hasNext()){
			expect(query.next().value("name")).toBe(names[i++]);
		}
	});
});
