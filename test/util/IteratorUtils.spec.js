import { List, IteratorUtils } from '../../src/util/';


describe('IteratorUtils', () => {

  const iterable = new List();
  iterable.add("test1");
  iterable.add("test2");
  iterable.add("test3");
  it(`should make List from Iterator with size ${iterable.size()}`, () => {
    expect(IteratorUtils.list(iterable.iterator()).iterator().size()).toBe(iterable.size());
  });

});