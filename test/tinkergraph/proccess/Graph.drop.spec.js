import { TinkerGraph, TinkerFactory } from '../../../src';

describe('Graph drop', () => {

	it('g.V().has("name", "marko").drop().hasNext(); should return false', () => {
		const graph = TinkerFactory.createModern();
		const g = graph.traversal();
		expect(g.V().has("name", "marko").drop().hasNext()).toBe(false);
	});

	it('g.V().drop().iterate(); g.V().toList().length should return 0', () => {
		const graph = TinkerFactory.createModern();
		const g = graph.traversal();
		expect(g.V().toList().length).toBe(6);
		g.V().drop().iterate();
		expect(g.V().toList().length).toBe(0);
	});

	it('g.V(1).outE("knows").drop().iterate(); g.V(1).outE().toList().length should return 1', () => {
		const graph = TinkerFactory.createModern();
		const g = graph.traversal();
		expect(g.V(1).outE().toList().length).toBe(3);
		g.V(1).outE('knows').drop().iterate();
		expect(g.V(1).outE().toList().length).toBe(1);
	});

	it('g.V(1).properties("age").drop().iterate(); g.V(1).properties().toList().length should return 1', () => {
		const graph = TinkerFactory.createModern();
		const g = graph.traversal();
		expect(g.V(1).properties().toList().length).toBe(2);
		g.V(1).properties('age').drop().iterate();
		expect(g.V(1).properties().toList().length).toBe(1);
	});

	it('g.E(7).properties("weight").drop().iterate(); g.E(7).properties().toList().length should return 0', () => {
		const graph = TinkerFactory.createModern();
		const g = graph.traversal();
		expect(g.E(7).properties().toList().length).toBe(1);
		g.E(7).properties('weight').drop().iterate();
		expect(g.E(7).properties().toList().length).toBe(0);
	});

});