import { TinkerFactory } from '../../../src';

describe('Graph properties', () => {
  const g = TinkerFactory.createModern();

  it('g.traversal().V().properties("name").next() should return "marko", "vadas", "lop", "josh", "ripple", "peter"', () => {
    const names = ["marko", "vadas", "lop", "josh", "ripple", "peter"];
    const query = g.traversal().V().properties("name");
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value()).toBe(names[i]);
      i++;
    }
  });

  it('g.traversal().V().properties("name", "age").next() ' +
    'should return "marko", "29", "vadas", "27", "lop", "josh", "32", "ripple", "peter", "35"', () => {
    const names = ["marko", 29, "vadas", 27, "lop", "josh", 32, "ripple", "peter", 35];
    const query = g.traversal().V().properties("name", "age");
    let i = 0;
    expect(query.hasNext()).toBe(true);
    while (query.hasNext()){
      expect(query.next().value()).toBe(names[i]);
      i++;
    }
  });
});
