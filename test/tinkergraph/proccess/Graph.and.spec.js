import { TinkerFactory, outE, values, lt } from '../../../src';

describe('Graph and', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().and(outE("knows"), values("age").is(lt(30))).values("name").next(); should return "marko"', () => {
		expect(g.V().and(outE("knows"), values("age").is(lt(30))).values("name").next()).toBe("marko");
	});

	it('g.V().where(outE("created").and().outE("knows")).values("name").next(); should return "marko"', () => {
		expect(g.V().where(outE("created").and().outE("knows")).values("name").next()).toBe("marko");
	});
});
