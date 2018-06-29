import Bytecode from '../../../src/proccess/traversal/Bytecode';

describe('Bytecode', () => {
  it('flattenArguments(["knows"])[0] should return knows', () => {
    expect(Bytecode.flattenArguments(['knows'])[0]).toBe('knows');
  });

  it('flattenArguments(["knows", "some"]).length should return 2', () => {
    expect(Bytecode.flattenArguments(['knows', 'some']).length).toBe(2);
  });

});