import DefaultGraphTraversal from '../../../../../src/proccess/traversal/dsl/graph/DefaultGraphTraversal';

describe('DefaultGraphTraversal', () => {
  const defaultGraphTraversal = new DefaultGraphTraversal();
  it('should have addStep method', () => {
    expect(defaultGraphTraversal.addStep).toBeDefined();
  });
  it('asAdmin should return DefaultGraphTraversal', () => {
    expect(defaultGraphTraversal.asAdmin().constructor.name).toBe('DefaultGraphTraversal');
  });
});