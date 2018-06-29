import Hidden from '../../src/structure/Hidden';

describe('Hidden', () => {

  it('hide("test") should return ~test', () => {
    expect(Hidden.hide('test')).toBe('~test');
  });
  it('isHidden("~test") should return true', () => {
    const key = Hidden.hide('test');
    expect(Hidden.isHidden(key)).toBe(true);
  });
  it('unHide("~test") should return "test"', () => {
    expect(Hidden.unHide("~test")).toBe('test');
  });
});
