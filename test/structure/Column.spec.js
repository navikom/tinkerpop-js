import Column, {keys, values} from '../../src/structure/Column';

describe('Column', () => {

	it('Column.has(keys) should return true', () => {
		expect(Column.has(keys)).toBe(true);
	});

	it('Column.has(values) should return true', () => {
		expect(Column.has(values)).toBe(true);
	});

	it('Column.has({keys: "keys"}) should return false', () => {
		expect(Column.has({keys: "keys"})).toBe(false);
	});

});
