import { TinkerFactory } from '../../../src';

describe('Graph outE', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V(4).inE().next().id() should return 8', () => {
		expect(g.V(4).inE().next().id()).toBe(8);
	});
});