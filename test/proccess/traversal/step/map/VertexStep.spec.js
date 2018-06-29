import __ from '../../../../../src/proccess/traversal/dsl/graph/__';

describe('VertexStep', () => {

  const array = [
    __.out(),
    __.in(),
    __.both(),
    __.out("knows"),
    __.out("created"),
    __.out("knows", "created")
  ];
  it('[ __.out(),__.in(),__.both(),__.out("knows"),__.out("created"),__.out("knows", "created")] should return 6', () => {
    expect(array.length).toBe(6);
  });

  it('[ __.out(),__.in(),__.both(),__.out("knows"),' +
    '__.out("created"),__.out("knows", "created")].getBytecode()' +
    '.stepInstructions[0].arguments[1] should return "created"', () => {
    expect(array[array.length - 1].getBytecode().stepInstructions[0].arguments[1]).toBe("created");
  });
});