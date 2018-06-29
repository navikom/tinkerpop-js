export default class MemoryHelper {
	constructor() {
	}

	static validateValue(value) {
		if (null === value || undefined === value)
			throw ("memory Value Can Not Be Null");
	}

	static validateKey(key) {
		if (null === key || undefined === key)
			throw ("memory Key Can Not Be Null");
		if (key.trim() === '')
			throw ("memory Key Can Not Be Empty");
	}
}
