import { List } from '../../src/util/';


describe('List', () => {

  it('add(["test1", "test2"]).size() should return 2 ', () => {
    const list = new List();
    list.add(["test1", "test2"]);
    expect(list.size()).toBe(2);
  });

  it('add("test1").size() should return 1 ', () => {
    const list = new List();
    list.add("test1");
    expect(list.size()).toBe(1);
  });

  const list = new List();
  list.add(["test1", "test2", "test3"]);
  list.remove(0);
  it('list.add(["test1", "test2", "test3"]); list.remove(0); list.getValue(0) should return "test2"', () => {

    expect(list.getValue(0)).toBe("test2");
  });
});