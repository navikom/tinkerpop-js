import Bindings from '../../src/proccess/Bindings';

describe('Bindings', () => {
  it('Bindings should be singleton first.map === second.map', () => {
    const first = new Bindings();
    const second = new Bindings();
    expect(first.map).toBe(second.map);
  });

});