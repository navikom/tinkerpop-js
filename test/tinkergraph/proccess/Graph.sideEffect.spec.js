import { TinkerFactory } from '../../../src';

describe('Graph sideEffect with predicate', () => {
	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().out("knows").sideEffect((t) => t.get().value("name")).toList() ' +
		'should return "vadas", "josh"', () => {
		const names = ["vadas", "josh"];
		let i = 0;
		g.V().out("knows").sideEffect((t) => expect(t.get().value("name")).toBe(names[i++])).toList();
	});
});
