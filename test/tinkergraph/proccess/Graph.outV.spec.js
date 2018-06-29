import { TinkerFactory } from '../../../src';

describe('Graph outV', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V(4).inE().outV() should return "marko"', () => {
		expect(g.V(4).inE().outV().next().value("name")).toBe("marko");
	});

});
