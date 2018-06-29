import { TinkerFactory } from '../../../src';

describe('Graph out', () => {
  const g = TinkerFactory.createModern().traversal();

  it('marko then josh then peter asks out query should return them edges: ' +
    'marko - "vadas", "josh", "lop", for josh - "ripple", "lop", "peter", for peter - "lop"', () => {
    let query;

    g.V().has("name", "josh").next().addEdge("knows", g.V().has("name", "peter").next());

    const names1 = ["lop", "vadas", "josh"];

    // here marko asks query
    query = g.V(1).out();
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names1[i]);
      i++;
    }

    const names2 = ["peter", "ripple", "lop"];
    // here josh asks query
    query = g.V(1).out().out();
    i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names2[i]);
      i++;
    }

    // here peter asks query
    query = g.V(1).out().out().out();
    i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe("lop");
      i++;
    }

  });

});
