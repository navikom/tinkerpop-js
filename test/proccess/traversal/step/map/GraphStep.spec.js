import __ from '../../../../../src/proccess/traversal/dsl/graph/__';

describe('GraphStep', () => {
  it('V().getGraph() should return EmptyGraph', () => {
    expect(__.V().getGraph().constructor.name).toBe('EmptyGraph');
  });

  it('V(3, 4).getGraph() should return EmptyGraph', () => {
    expect(__.V(3, 4).getGraph().constructor.name).toBe('EmptyGraph');
  });
});
