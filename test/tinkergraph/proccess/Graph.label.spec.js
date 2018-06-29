import { TinkerFactory } from '../../../src';

describe('Graph label', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.E().label(); should return "knows", "knows", "created", "created", "created", "created"', () => {
		const query = g.E().label();
		const ids = ["knows", "knows", "created", "created", "created", "created"];
		let i = 0;
		query.toList().forEach((id) => expect(id).toBe(ids[i++]));
	});
});
