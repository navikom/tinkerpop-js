import { TinkerGraph, TinkerFactory } from '../../../src';

describe('TinkerGraph', () => {

  const g = TinkerGraph.open();
  const marko = g.addVertex("name", "marko", "age", 29);

  it('marko = g.addVertex("name", "marko", "age", 29);\n' +
    'marko.properties("name").next().value() should return "marko"', () => {

    expect(marko.properties("name").next().value()).toBe("marko");
  });
  const v = g.addVertex("name", "serge");
  marko.addEdge("friend", v, "oid", "1", "weight", 0.5);

  it('marko = g.addVertex("name", "marko", "age", 29);\n v = g.addVertex();' +
    'marko.addEdge("friend", v, "oid", "1", "weight", 0.5);' +
    'g._edges.getByIndex(0)._inVertex.properties().array.length should return 1', () => {

    expect(g._edges._table[0]._inVertex.properties().size()).toBe(1);
  });

  it('marko = g.addVertex("name", "marko", "age", 29);\n v = g.addVertex();' +
    'marko.addEdge("friend", v, "oid", "1", "weight", 0.5);' +
    'g._edges.getByIndex(0)._outVertex.properties("name").next().value() should return "marko"', () => {

    expect(g._edges._table[0]._outVertex.properties("name").next().value()).toBe("marko");
  });

  const v2 = g.addVertex("name", "serge");
  marko.addEdge("knows", v2, "oid", "1", "weight", 0.5);
  it('marko = g.addVertex("name", "marko", "age", 29); v = g.addVertex("name", "serge");' +
    'marko.addEdge("knows", v, "oid", "1", "weight", 0.5);' +
    'g.traversal().V().out("knows").next().value("name") should return "serge"', () => {

    expect(g.traversal().V().out("knows").next().value("name")).toBe("serge");
  });

  it('marko = g.addVertex("name", "marko", "age", 29); v = g.addVertex("name", "serge");' +
    'marko.addEdge("knows", v, "oid", "1", "weight", 0.5);' +
    'g.traversal().V().out("knows").next().values("name").next() should return "serge"', () => {

    expect(g.traversal().V().out("knows").next().values("name").next()).toBe("serge");
  });

  const v3 = g.addVertex("name", "phil");
  marko.addEdge("knows", v3, "oid", "1", "weight", 0.5);
  const v4 = g.addVertex("name", "greg");
  marko.addEdge("unknows", v4, "oid", "3", "weight", 0.5);
  const knows = g.traversal().V(marko).out("knows");
  const unknows = g.traversal().V(marko).out("unknows");
  it('marko = g.addVertex("name", "marko", "age", 29); v = g.addVertex("name", "serge"); ' +
    'marko.addEdge("knows", v, "oid", "1", "weight", 0.5); v3 = g.addVertex("name", "phil"); ' +
    'marko.addEdge("knows", v3, "oid", "1", "weight", 0.5); ' +
    'knows = g.traversal().V(marko).out("knows"); ' +
    'while(knows.hasNext()){knows.next().value("name")} should return "serge" then "phil" ' +
    'v4 = g.addVertex("name", "greg"); marko.addEdge("unknows", v4, "oid", "3", "weight", 0.5); ' +
    'unknows = g.traversal().V(marko).out("unknows"); ' +
    'while(unknows.hasNext()){unknows.next().value("name")} should return "greg"', () => {
    let i = 0;
    const names = ["serge", "phil", "greg"];
    expect(knows.hasNext()).toBe(true);
    while (knows.hasNext()){
      expect(knows.next().value("name")).toBe(names[i]);
      i++;
    }

    expect(unknows.hasNext()).toBe(true);
    while (unknows.hasNext()){
      expect(unknows.next().value("name")).toBe(names[i]);
    }
  });

  it('greg = g.addVertex("name", "greg"); g.traversal().V(greg).next().value("name") should return "greg"', () => {

    expect(g.traversal().V(v4).next().value("name")).toBe("greg");

  });

  const knowsIn = g.traversal().V().in("knows");
  it('knowsIn = g.traversal().V().in("knows"); ' +
    'while(knowsIn.hasNext()){knowsIn.next().value("name")} should return "marko" 2 times', () => {
    expect(knowsIn.hasNext()).toBe(true);
    while (knowsIn.hasNext()) {
      expect(knowsIn.next().value("name")).toBe("marko");
    }

  });

  const knowsBoth = g.traversal().V().both("knows");
  it('knowsBoth = g.traversal().V().both("knows"); ' +
    'while(knowsIn.hasNext()){knowsIn.next().value("name")} should return "serge", "phil" then "marko" 2 times', () => {

    let i = 0;
    const names = ["serge", "phil", "marko", "marko"];
    expect(knowsBoth.hasNext()).toBe(true);
    while (knowsBoth.hasNext()) {
      expect(knowsBoth.next().value("name")).toBe(names[i]);
      i++;
    }

  });

  const g2 = TinkerFactory.createModern();
  it('g = TinkerFactory.createModern(); knows = g.traversal().V().out("knows"); ' +
    'while(knows.hasNext()){knows.next().value("name")} should return "vadas", "josh"; ' +
    'knows.next().value("label") should return "person"', () => {
    const knows = g2.traversal().V().out("knows");
    let i = 0;
    const names = ["vadas", "josh"];

    expect(knows.hasNext()).toBe(true);

    while (knows.hasNext()) {
      expect(knows.next().value("name")).toBe(names[i]);
      i++;
    }

    while (knows.hasNext()) {
      expect(knows.next().value("label")).toBe("person");
      i++;
    }

  });

  it('g.traversal().V(1).next().value("name") should return "marko"', () => {

      expect(g2.traversal().V(1).next().value("name")).toBe("marko");

  });

  it('g.traversal().E() should return 2 times "knows" and 4 times "created"', () => {
    const edges = g2.traversal().E();
    let i = 0;
    while (edges.hasNext()){
      const result = i < 2 ? "knows" : "created"
      expect(edges.next().label()).toBe(result);
      i++;
    }
  });
});