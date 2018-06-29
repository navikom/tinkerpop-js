import {
  neq, lt, gt,
  TinkerGraph, TinkerFactory, T
} from '../../../src';

describe('Graph hasLabel', () => {
  const g = TinkerFactory.createModern();

  it('g.traversal().V().hasLabel("person", "software") should return "marko", "vadas", "lop", "josh", "ripple", "peter"', () => {
    const names = ["marko", "vadas", "lop", "josh", "ripple", "peter"];
    const query = g.traversal().V().hasLabel("person", "software");
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names[i]);
      i++;
    }
  });

  it('g.traversal().V().hasLabel(gt("person")) should return "lop", "ripple"', () => {
    const names = ["lop", "ripple"];
    const query = g.traversal().V().hasLabel(gt("person"));
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names[i]);
      i++;
    }
  });

  it('g.traversal().V().hasLabel(neq("person")) should return "lop", "ripple"', () => {
    const names = ["lop", "ripple"];
    const query = g.traversal().V().hasLabel(neq("person"));
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names[i]);
      i++;
    }
  });

  it('g.traversal().V().hasLabel(lt("software")) should return "marko", "vadas", "josh", "peter"', () => {
    const names = ["marko", "vadas", "josh", "peter"];
    const query = g.traversal().V().hasLabel(lt("software"));
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value("name")).toBe(names[i]);
      i++;
    }
  });

});