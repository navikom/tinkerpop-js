import { List, HashSet } from '../../src/util/';


describe('HashSet', () => {

	const hashSet = new HashSet();
	const list = new List();
	list.add("some")
	const key = "knows";
	const list2 = new List();
	const key2 = "created";
	hashSet.put(key, list)
	hashSet.put(key2, list2);

	it('hashSet.size() should return 2', () => {
		expect(hashSet.size()).toBe(2);
	});

	it('hashSet.getValue("knows").size() should return 1', () => {
		expect(hashSet.getValue("knows").size() ).toBe(1);
	});

	it('hashSet.containsValue("some") should return true', () => {
		expect(hashSet.containsValue("some")).toBe(true);
	});

	it('hashSet.contains("knows") should return true', () => {
		expect(hashSet.contains("knows")).toBe(true);
	});

	it('hashSet.remove("knows"); hashSet.contains("knows") should return false', () => {
		hashSet.remove("knows");
		expect(hashSet.contains("knows")).toBe(false);
	});
});
