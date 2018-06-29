import { TinkerGraph, TinkerFactory } from '../../../src';

describe('TinkerEdge', () => {
  it('edge.remove() should return true', () => {
    const g = TinkerGraph.open();
    const marko = g.addVertex("name", "marko", "age", 29);
    const stephen = g.addVertex("name", "stephen", "age", 35);
    const v = g.addVertex("name", "serge");
    const v2 = g.addVertex("name", "phil");
    const e = marko.addEdge("knows", v, "oid", "1", "weight", 0.5);
    marko.addEdge("knows", v2, "oid", "1", "weight", 0.5);

    expect(g.edges().size()).toBe(2);
    e.remove();
    expect(g.edges().size()).toBe(1);
  });

  it('e.property("hello", "world"); should return "world"', () => {
    const g = TinkerGraph.open();
    const marko = g.addVertex("name", "marko", "age", 29);
    const v = g.addVertex("name", "serge");
    const e = marko.addEdge("knows", v, "oid", "1", "weight", 0.5);

    e.property("hello", "world");
    expect(e.value("hello")).toBe("world");
    expect(e.property("hello").value()).toBe("world");
  });

  it('e.property("hello").value(); should return "world"', () => {
    const g = TinkerGraph.open();
    const marko = g.addVertex("name", "marko", "age", 29);
    const v = g.addVertex("name", "serge");
    const e = marko.addEdge("knows", v, "oid", "1", "weight", 0.5);

    e.property("hello", "world");
    expect(e.property("hello").value()).toBe("world");
  });

  it('e.remove(); e.property("status", 1); should throw "Edge with id ${id} was removed"', () => {
    const g = TinkerGraph.open();
    const marko = g.addVertex("name", "marko", "age", 29);
    const v = g.addVertex("name", "serge");
    const e = marko.addEdge("knows", v, "oid", "1", "weight", 0.5);
    const id = e.id();
    e.property("hello", "world");
    expect(e.value("hello")).toBe("world");
    e.remove();
    expect(() => e.property("status", 1)).toThrow(`Edge with id ${id} was removed.`);
  });

  it('g.E(11).next().remove(); g.V(4).out().toList()[0].id() should return 5', () => {
    const graph = TinkerFactory.createModern();
    const g = graph.traversal();
    expect(g.V(4).out().toList().length).toBe(2);
    g.E(11).next().remove();
    expect(g.V(4).out().toList()[0].id()).toBe(5);
  });
});