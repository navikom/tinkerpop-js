import { Map } from '../../src/util/';

describe('Map', () => {

  const map = new Map();
  [1, 2, 3].map(entry => map.put(`key${entry}`, `value${entry}`));
  const map2 = map.keySet().filter((entry) => entry.getKey() === 'key2');
  it('[1, 2, 3].map(entry => map.put(`key${entry}`, `value${entry}`)).keySet()' +
    '.filter((entry) => entry.getKey() === "key2").getByIndex(0) should return "value2" ', () => {

    expect(map2.getByIndex(0)).toBe("value2");
  });

  it('[1, 2, 3].map(entry => map.put(`key${entry}`, `value${entry}`)).keySet()' +
    '.filter((entry) => entry.getKey() === "key1").map(entry => entry.getValue()).size() should return 1', () => {

    expect(map2.map(entry => entry.getValue()).size()).toBe(1);
  });

  it('[1, 2, 3].map(entry => map.put(`key${entry}`, `value${entry}`)).keySet()' +
    '.filter((entry) => entry.getKey() === "key1").map(entry => entry.getValue()).iterator().size() should return 1', () => {

    expect(map2.map(entry => entry.getValue()).iterator().size()).toBe(1);
  });

  map.remove("key1");
  it('[1, 2, 3].map(entry => map.put(`key${entry}`, `value${entry}`));' +
    '.remove("key1"); .keySet().getKey() should return "key2"', () => {

    expect(map.keySet().getKey()).toBe("key2");
  });

});
