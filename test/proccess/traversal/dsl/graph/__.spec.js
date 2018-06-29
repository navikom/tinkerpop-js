import __ from '../../../../../src/proccess/traversal/dsl/graph/__';

describe('anonymous', () => {
  it('start().constructor.name should return DefaultGraphTraversal', () => {
    expect(__.start().constructor.name).toBe('DefaultGraphTraversal');
  });

  it('map().constructor.name should return DefaultGraphTraversal', () => {
    const traversal = __.start();
    expect(__.map(traversal).constructor.name).toBe('DefaultGraphTraversal');
  });

  it('V().constructor.name should return DefaultGraphTraversal', () => {
    expect(__.V().constructor.name).toBe('DefaultGraphTraversal');
  });

  it('V().getGraph().constructor.name should return EmptyGraph', () => {
    expect(__.V().getGraph().constructor.name).toBe('EmptyGraph');
  });

  it('out().constructor.name should return DefaultGraphTraversal', () => {
    expect(__.out().constructor.name).toBe('DefaultGraphTraversal');
  });

  it('out("knows").constructor.name should return DefaultGraphTraversal', () => {
    expect(__.out("knows").constructor.name).toBe('DefaultGraphTraversal');
  });

  it('out("knows", "some").getBytecode().stepInstructions[0].arguments.length should return 2', () => {
    expect(__.out("knows", "some").getBytecode().stepInstructions[0].arguments.length).toBe(2);
  });

  it('identity().constructor.name should return DefaultGraphTraversal', () => {
    expect(__.identity().constructor.name).toBe('DefaultGraphTraversal');
  });

});