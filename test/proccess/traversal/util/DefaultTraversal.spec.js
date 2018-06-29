import DefaultTraversal from '../../../../src/proccess/traversal/util/DefaultTraversal';

describe('DefaultTraversal', () => {
  const defaultTraversal = new DefaultTraversal();

  it('getSteps should return List', () => {

    expect(defaultTraversal.getSteps().constructor.name).toBe('List');
  });

});