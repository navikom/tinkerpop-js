import ElementHelper from '../../../src/structure/util/ElementHelper';
import Hidden from '../../../src/structure/Hidden';
import T from '../../../src/structure/T';

describe('ElementHelper', () => {

  it('validateLabel("someLabel") should return true', () => {
    expect(ElementHelper.validateLabel("someLabel")).toBe(true);
  });

  it('validateProperty("test") should throw error "property Value Can Not Be Null"', () => {
    expect(() => ElementHelper.validateProperty("test")).toThrow("property Value Can Not Be Null");
  });

  it('validateProperty(null, "test") should throw error "property Key Can Not Be Null"', () => {
    expect(() => ElementHelper.validateProperty(null, "test")).toThrow("property Key Can Not Be Null");
  });

  const key = Hidden.hide('test');
  it(`validateProperty(${key}, "test") should throw error \"property Key Can Not Be A Hidden Key (${key})\"`, () => {
    expect(() => ElementHelper.validateProperty(key, "test")).toThrow(`property Key Can Not Be A Hidden Key (${key})`);
  });

  it('ElementHelper.legalPropertyKeyValueArray("aKey", "test", "no-value-for-this-one") ' +
    'should throw error \"provided Key Values Must Be A MultipleOfTwo\"', () => {
    expect(() => ElementHelper.legalPropertyKeyValueArray("aKey", "test", "no-value-for-this-one"))
    .toThrow('provided Key Values Must Be A MultipleOfTwo');
  });

  it('ElementHelper.legalPropertyKeyValueArray("aKey", "test", "value-for-this-one", 1, 1, "none") ' +
    'should throw error \"provided Key Values Must Have A Legal Key On Even Indices\"', () => {
    expect(() => ElementHelper.legalPropertyKeyValueArray("aKey", "test", "value-for-this-one", 1, 1, "none"))
    .toThrow('provided Key Values Must Have A Legal Key On Even Indices');
  });

  it('ElementHelper.getIdValue(T.id, 123).getValue() should return 123', () => {
    expect(ElementHelper.getIdValue(T.id, 123).getValue()).toBe(123);
  });

  it('ElementHelper.getIdValue("test", 321, "xyz", 123l, "testagain", "that").getValue() should throw error "No value present"', () => {
    expect(() => ElementHelper.getIdValue("test", 321, "xyz", 123, "testagain", "that").getValue()).toThrow("No value present");
  });

  it('ElementHelper.getIdValue("test", 321, "xyz", 123l, "testagain", "that").getValue() should throw error "No value present"', () => {
    expect(() => ElementHelper.getIdValue("test", 321, "xyz", 123, "testagain", "that").getValue()).toThrow("No value present");
  });

  const oldKvs = ["k", "v"];
  const newKvs = ElementHelper.upsert(oldKvs, "k1", "v1");

  it('ElementHelper.upsert(["k", "v"], "k1", "v1").length should return 4', () => {
    expect(newKvs.length).toBe(4);
  });

  it('ElementHelper.upsert(["k", "v"], "k1", "v1")[2] should return "k1"', () => {
    expect(newKvs[2]).toBe("k1");
  });

  it('ElementHelper.upsert(["k", "v"], "k1", "v1")[3] should return "v1"', () => {
    expect(newKvs[3]).toBe("v1");
  });

  const oldKvs2 = oldKvs.concat(["k1", "v0"]);
  const newKvs2 = ElementHelper.replaceKey(oldKvs2, "k", "k2");

  it('ElementHelper.replaceKey(["k", "v", "k1", "v0"], "k", "k2") should return 4', () => {
    expect(newKvs2.length).toBe(4);
  });

  it('ElementHelper.replaceKey(["k", "v", "k1", "v0"], "k", "k2")[0] should return "k2"', () => {
    expect(newKvs2[0]).toBe("k2");
  });

  it('ElementHelper.replaceKey(["k", "v", "k1", "v0"], "k", "k2")[1] should return "v"', () => {
    expect(newKvs2[1]).toBe("v");
  });

  it('ElementHelper.replaceKey(["k", "v", "k1", "v0"], "k", "k2")[2] should return "k1"', () => {
    expect(newKvs2[2]).toBe("k1");
  });

  it('ElementHelper.replaceKey(["k", "v", "k1", "v0"], "k", "k2")[1] should return "v0"', () => {
    expect(newKvs2[3]).toBe("v0");
  });

  const kvs = ElementHelper.remove("2", "1", "this", "2", 6, "3", "other", "4", 1);
  it('remove("2", "1", "this", "2", 6, "3", "other", "4", 1).getValue()[2] should return 3', () => {
    expect(kvs.getValue()[2]).toBe("3");
  });
  const kvs2 = ElementHelper.remove("3", "1", "this", "2", 6, "3", "other", "4", 1);
  it('remove("3", "1", "this", "2", 6, "3", "other", "4", 1).getValue()[4] should return 4', () => {
    expect(kvs2.getValue()[4]).toBe("4");
  });

  const kvs3 = ElementHelper.remove("5", "1", "this", "2", 6, "3", "other", "4", 1);
  it('remove("5", "1", "this", "2", 6, "3", "other", "4", 1).getValue() should throw error "No value present"', () => {
    expect(() => kvs3.getValue()).toThrow("No value present");
  });

  const kvs4 = ElementHelper.asMap("1", "this", "2", 6, "3", "other", "4", 1);
  it('asMap("1", "this", "2", 6, "3", "other", "4", 1).getValue("3") should return "other"', () => {
    expect(kvs4.getValue("3")).toBe("other");
  });

  const kvs5 = ElementHelper.getLabelValue("test", 321, T.label, "friend", "testagain", "that");
  it('getLabelValue("test", 321, T.label, "friend", "testagain", "that").getValue() should return "friend"', () => {
    expect(kvs5.getValue()).toBe("friend");
  });

});