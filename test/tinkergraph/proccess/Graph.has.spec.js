import {
  eq, neq, lt, lte, gt, gte, inside, within, outside, between, without,
  TinkerGraph, TinkerFactory, T
} from '../../../src';

describe('Graph has', () => {
  const g = TinkerFactory.createModern();

  /**
   * key value
   */
  it('g.traversal().V().has("name", "josh").next().value("name") should return "josh"', () => {
    expect(g.traversal().V().has("name", "josh").next().value("name")).toBe("josh");
  });

  /**
   * key predicate
   */
  it('g.traversal().V().has("name", eq("ripple")).next().value("name") should return "ripple"', () => {
    expect(g.traversal().V().has("name", eq("ripple")).next().value("name")).toBe("ripple");
  });

  it('g.traversal().V().has("name", neq("marko")).values("name") ' +
    'should return "vadas", "lop", "josh", "ripple", "peter"', () => {
    const query = g.traversal().V().has("name", neq("marko")).values("name");
    const names = ["vadas", "lop", "josh", "ripple", "peter"];
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next()).toBe(names[i++]);
    }
  });

  it('g.traversal().V().has("name", lt("vadas")).values("name") ' +
    'should return "marko", "lop", "josh", "ripple", "peter"', () => {

    const query = g.traversal().V().has("name", lt("vadas")).values("name");
    const names = ["marko", "lop", "josh", "ripple", "peter"];
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next()).toBe(names[i++]);
    }
  });

  it('g.traversal().V().has("name", lte("josh")).next().value("name") should return "josh"', () => {
    expect(g.traversal().V().has("name", lte("josh")).next().value("name")).toBe("josh");
  });

  it('g.traversal().V().has("name", gt("vadas")).hasNext() should return false', () => {
    expect(g.traversal().V().has("name", gt("vadas")).hasNext()).toBe(false);
  });

  it('g.traversal().V().has("name", gte("vadas")).next().value("name") should return "vadas"', () => {
    expect(g.traversal().V().has("name", gte("vadas")).next().value("name")).toBe("vadas");
  });

  it('g.traversal().V().has("name", inside("lop", "vadas")).values("name") ' +
    'should return "marko", "ripple", "peter"', () => {
    const query = g.traversal().V().has("name", inside("lop", "vadas")).values("name");
    const names = ["marko", "ripple", "peter"];
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next()).toBe(names[i++]);
    }
  });

  it('g.traversal().V().has("name", outside("lop", "vadas")) should return "josh"', () => {
    expect(g.traversal().V().has("name", outside("lop", "vadas")).next().value("name")).toBe("josh");
  });

  it('g.traversal().V().has("name", between("lop", "vadas")).values("name") ' +
    'should return "marko", "lop", "ripple", "peter"', () => {
    const query = g.traversal().V().has("name", between("lop", "vadas")).values("name");
    const names = ["marko", "lop", "ripple", "peter"];
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next()).toBe(names[i++]);
    }
  });

  it('g.traversal().V().has("name", within("vadas")) should return "vadas"', () => {
    expect(g.traversal().V().has("name", within("vadas")).next().value("name")).toBe("vadas");
  });

  it('g.traversal().V().has("name", without("marko", "vadas")).values("name") ' +
    'should return "lop", "josh", "ripple", "peter"', () => {
    const query = g.traversal().V().has("name", without("marko", "vadas")).values("name");
    const names = ["lop", "josh", "ripple", "peter"];
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next()).toBe(names[i++]);
    }
  });

  /**
   * accessor predicate
   */
  it('g.traversal().V().has(T.id, eq(4)).next().value("name") should return "josh"', () => {
    expect(g.traversal().V().has(T.id, eq(4)).next().value("name")).toBe("josh");
  });

  it('g.traversal().V().has(T.id, neq(4)) should return "marko", "vadas", "lop", "ripple", "peter"', () => {
    const names = ["marko", "vadas", "lop", "ripple", "peter"];
    const query = g.traversal().V().has(T.id, neq(4));
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names[i++]);
    }
  });

  it('g.traversal().V().has(T.id, lt(4)).values("name") should return "marko", "vadas", "lop"', () => {
    expect(g.traversal().V().has(T.id, lt(4)).next().value("name")).toBe("marko");
    const names = ["marko", "vadas", "lop"];
    const query = g.traversal().V().has(T.id, lt(4));
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names[i++]);
    }
  });

  it('g.traversal().V().has(T.id, lte(4)).values("name") ' +
    'should return "marko", "vadas", "lop", "josh"', () => {
    const names = ["marko", "vadas", "lop", "josh"];
    const query = g.traversal().V().has(T.id, lte(4));
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names[i++]);
    }
  });

  it('g.traversal().V().has(T.label, gt("person")).values("name") should return "lop", "ripple"', () => {
    const names = ["lop", "ripple"];
    const query = g.traversal().V().has(T.label, gt("person"));
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names[i++]);
    }
  });

  it('g.traversal().V().has(T.label, gte("person")).values("name") ' +
    'should return "marko", "vadas", "lop", "josh", "ripple", "peter"', () => {
    const names = ["marko", "vadas", "lop", "josh", "ripple", "peter"];
    const query = g.traversal().V().has(T.label, gte("person"));
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names[i++]);
    }
  });

  it('g.traversal().V().has(T.id, inside(1, 3)) should return "vadas"', () => {
    expect(g.traversal().V().has(T.id, inside(1, 3)).next().value("name")).toBe("vadas");
  });

  it('g.traversal().V().has(T.id, outside(2, 4)) should return "marko", "ripple", "peter"', () => {

    const names = ["marko", "ripple", "peter"];
    const query = g.traversal().V().has(T.id, outside(2, 4));
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names[i++]);
    }
  });

  it('g.traversal().V().has(T.id, between(2, 5)) should return "vadas", "lop", "josh"', () => {

    const names = ["vadas", "lop", "josh"];
    const query = g.traversal().V().has(T.id, between(2, 5));
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names[i++]);
    }
  });

  it('g.traversal().V().has(T.label, within("software")) should return "lop", "ripple"', () => {
    const names = ["lop", "ripple"];
    const query = g.traversal().V().has(T.label, within("software"));
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names[i]);
      i++;
    }
  });

  it('g.traversal().V().has(T.id, without(1, 3, 5)) should return "vadas", "josh", "peter"', () => {
    const names = ["vadas", "josh", "peter"];
    const query = g.traversal().V().has(T.id, without(1, 3, 5));
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names[i]);
      i++;
    }
  });

  /**
   * accessor value
   */
  it('g.traversal().V().has(T.id, 4).next().value("name") should return "josh"', () => {
    expect(g.traversal().V().has(T.id, 4).next().value("name")).toBe("josh");
  });

  it('g.traversal().V().has(T.label, "software") should return "lop", "ripple"', () => {
    const names = ["lop", "ripple"];
    const query = g.traversal().V().has(T.label, "software");
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names[i]);
      i++;
    }
  });

  /**
   * label key value
   */
  it('g.traversal().V().has("person", "age", 32).next().value("name") should return "josh"', () => {
    expect(g.traversal().V().has("person", "age", 32).next().value("name")).toBe("josh");
  });

  /**
   * label key predicate
   */
  it('g.traversal().V().has("person", "age", eq(32)).next().value("name") should return "josh"', () => {
    expect(g.traversal().V().has("person", "age", eq(32)).next().value("name")).toBe("josh");
  });

  it('g.traversal().V().has("person", "age", neq(32)) should return "marko", "vadas", "peter"', () => {
    const names = ["marko", "vadas", "peter"];
    const query = g.traversal().V().has("person", "age", neq(32));
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names[i++]);
    }
  });

  it('g.traversal().V().has("person", "age", lt(32)) should return "marko", "vadas"', () => {
    const names = ["marko", "vadas"];
    const query = g.traversal().V().has("person", "age", lt(32));
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names[i++]);
    }
  });

  it('g.traversal().V().has("person", "name", lte("vadas")) should return "marko", "vadas", "josh", "peter"', () => {
    const names = ["marko", "vadas", "josh", "peter"];
    const query = g.traversal().V().has("person", "name", lte("vadas"));
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names[i++]);
    }
  });

  it('g.traversal().V().has("person", "name", gt("vadas")) should return "marko", "vadas", "peter"', () => {
    const names = ["marko", "vadas", "peter"];
    const query = g.traversal().V().has("person", "name", gt("josh"));
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names[i]);
      i++;
    }
  });

  it('g.traversal().V().has("person", "name", gte("josh")) should return "marko", "vadas", "josh", "peter"', () => {
    const names = ["marko", "vadas", "josh", "peter"];
    const query = g.traversal().V().has("person", "name", gte("josh"));
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names[i]);
      i++;
    }
  });

  it('g.traversal().V().has("person", "age", inside(27, 35)) should return "marko", "josh"', () => {
    const names = ["marko", "josh"];
    const query = g.traversal().V().has("person", "age", inside(27, 35));
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names[i]);
      i++;
    }

  });

  it('g.traversal().V().has("person", "age", outside(29, 32)) should return "vadas", "peter"', () => {

    const names = ["vadas", "peter"];
    const query = g.traversal().V().has("person", "age", outside(29, 32));
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names[i]);
      i++;
    }
  });

  it('g.traversal().V().has("person", "age", between(29, 35)) should return "marko", "josh"', () => {
    const names = ["marko", "josh"];
    const query = g.traversal().V().has("person", "age", between(29, 35));
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names[i]);
      i++;
    }
  });

  it('g.traversal().V().has("person", "age", within(29, 35)) should return "marko", "peter"', () => {
    const names = ["marko", "peter"];
    const query = g.traversal().V().has("person", "age", within(29, 35));
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names[i]);
      i++;
    }
  });

  it('g.traversal().V().has("person", "age", without(27, 35)) should return "marko", "josh"', () => {
    const names = ["marko", "josh"];
    const query = g.traversal().V().has("person", "age", without(27, 35));
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names[i]);
      i++;
    }
  });
});
