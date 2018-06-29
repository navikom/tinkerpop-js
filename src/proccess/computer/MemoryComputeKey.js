import MemoryHelper from './util/MemoryHelper';

/**
 * MemoryComputeKey
 */
export default class MemoryComputeKey {

	constructor(key, reducer, isBroadcast, isTransient) {
		this.key = key;
		this.reducer = reducer;
		this._isTransient = isTransient;
		this._isBroadcast = isBroadcast;
		MemoryHelper.validateKey(key);
	}

	getKey() {
		return this.key;
	}

	isTransient() {
		return this._isTransient;
	}

	isBroadcast() {
		return this._isBroadcast;
	}

	getReducer() {
		return this.reducer;
	}

	equals(object) {
		return object instanceof MemoryComputeKey && object.key === this.key;
	}

	static of(key, reducer, isBroadcast, isTransient) {
		return new MemoryComputeKey(key, reducer, isBroadcast, isTransient);
	}
}