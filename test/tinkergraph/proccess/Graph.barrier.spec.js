import { TinkerFactory } from '../../../src';

describe('Graph barrier', () => {
	const g = TinkerFactory.createModern().traversal();

	it('g.V().sideEffect((t) => `first:${t.get().id()}`).barrier()' +
		'.sideEffect((t) => `second:${t.get().id()}`).iterate() should return ' +
		'"first:1", "first:2", "first:3", "first:4", "first:5", "first:6", ' +
		'"second:1", "second:2", "second:3", "second:4", "second:5", "second:6"', () => {
		let query;

		const ids = ["first:1", "first:2", "first:3", "first:4", "first:5", "first:6",
			"second:1", "second:2", "second:3", "second:4", "second:5", "second:6"];
		let i = 0;
		g.V().sideEffect((t) => expect(`first:${t.get().id()}`).toBe(ids[i++])).barrier()
			.sideEffect((t) => expect(`second:${t.get().id()}`).toBe(ids[i++])).iterate();
	});
});

