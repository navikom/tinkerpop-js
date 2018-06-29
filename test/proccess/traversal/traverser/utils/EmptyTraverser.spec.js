import EmptyTraverser from '../../../../../src/proccess/traversal/traverser/util/EmptyTraverser';

describe('EmptyTraverser', () => {
  it('EmptyTraverser should be singleton first.map === second.map', () => {
    const first = new EmptyTraverser();
    const second = new EmptyTraverser();
    expect(first.map).toBe(second.map);
  });

});
