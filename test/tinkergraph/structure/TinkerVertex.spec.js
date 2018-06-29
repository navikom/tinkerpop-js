import { TinkerGraph, TinkerFactory } from '../../../src';

describe('TinkerVertex', () => {
  it('vertex.remove() should return true', () => {
    const g = TinkerGraph.open();
    const marko = g.addVertex("name", "marko", "age", 29);
    const stephen = g.addVertex("name", "stephen", "age", 35);
    const v = g.addVertex("name", "serge");
    const v2 = g.addVertex("name", "phil");
    const e = marko.addEdge("knows", v, "oid", "1", "weight", 0.5);
    marko.addEdge("knows", v2, "oid", "1", "weight", 0.5);

    expect(g.vertices().size()).toBe(4);
    v2.remove();
    expect(g.vertices().size()).toBe(3);
  });

  it('marko.property("hello", "world"); should return "world"', () => {
    const g = TinkerGraph.open();
    const marko = g.addVertex("name", "marko", "age", 29);

    marko.property("hello", "world");
    expect(marko.value("hello")).toBe("world");
  });

  it('marko.property("name"); should return "marko"', () => {
    const g = TinkerGraph.open();
    const marko = g.addVertex("name", "marko", "age", 29);

    expect(marko.property("name").value()).toBe("marko");
  });

  it('marko.remove(); marko.value("name") should throw "Vertex with id V0 was removed"', () => {
    const g = TinkerGraph.open();
    const marko = g.addVertex("name", "marko", "age", 29);
    const id = marko.id();
    expect(marko.value("name")).toBe("marko");
    marko.remove();
    expect(() => marko.property("status", 1)).toThrow(`Vertex with id ${id} was removed.`);
  });

  it('g.V(5).next().remove(); g.V(4).out().toList().length should return 1', () => {
    const graph = TinkerFactory.createModern();
    const g = graph.traversal();
    expect(g.V(4).out().toList().length).toBe(2);
    g.V(5).next().remove();
    expect(g.V(4).out().toList().length).toBe(1);
  });
});
