import NumberHelper from '../../src/util/NumberHelper';

describe('NumberHelper', () => {
  
  it('add', () => {
    expect(NumberHelper.add(1, 2)).toBe(3);
    // In core JS you will get  2.3 + 2.4 = 4.699999999999999
    expect(NumberHelper.add(2.3, 2.4)).toBe(4.7);
  });

  it('sub', () => {
    expect(NumberHelper.sub(1, 2)).toBe(-1);
    expect(NumberHelper.sub(-0.2, 0.1)).toBe(-0.3); // In core JS -0.30000000000000004
  });

  it('mul', () => {
    expect(NumberHelper.mul(3, 2)).toBe(6);
    expect(NumberHelper.mul(0.57, 1000)).toBe(570); // In core JS 5699.999999999999
  });

  it('div', () => {
    expect(NumberHelper.div(6, 2)).toBe(3);
    expect(NumberHelper.div(5.3, 0.1)).toBe(53); // In core JS 52.999999999999999
  });

  it('min', () => {
    expect(NumberHelper.min(1, 3)).toBe(1);
    expect(NumberHelper.min(0.01, 0.02)).toBe(0.01);
  });

  it('max', () => {
    expect(NumberHelper.max(1, 3)).toBe(3);
    expect(NumberHelper.max(1, 1.001)).toBe(1.001);
  });

  it('unsupported type', () => {
    expect(() => NumberHelper.add(1, '3')).toThrow(new Error('Unsupported numeric type'));
  });

});