import { TinkerGraph, TinkerFactory } from '../../../src';

describe('Graph values', () => {
  const g = TinkerFactory.createModern();

  it('g.traversal().V().values("lang").next() should return "java"', () => {
    expect(g.traversal().V().values("lang").next()).toBe("java");
  });

  it('g.traversal().V().values("age", "lang").next() should return "29"', () => {
    expect(g.traversal().V().values("age", "lang").next()).toBe(29);
  });
});
