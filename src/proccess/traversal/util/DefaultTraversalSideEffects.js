import { mixin,  Map, List, isNull } from '../../../util';
import TraversalSideEffects from '../TraversalSideEffects';
import SideEffectHelper from './SideEffectHelper';

/**
 * DefaultTraversalSideEffects
 * @constructor
 */
function DefaultTraversalSideEffects() {
	this._keys = new List();
	this.objectMap = new Map();
	this.supplierMap = new Map();
	this.reducerMap = new Map();
	this.sackSplitOperator = null;
	this.sackMergeOperator = null;
	this.sackInitialValue = null;
}

DefaultTraversalSideEffects.prototype = {
	constructor: DefaultTraversalSideEffects,
	/**
	 * {@inheritDoc}
	 */
	get(key) {
		const value = this.objectMap.get(key);
		if (!isNull(value)) {
			return value;
		}
		const v =
			typeof this.getSupplier(key) === 'function'
				? this.getSupplier(key)()
				: this.getSupplier(key).get();
		this.objectMap.put(key, v);
		return v;
	},

	/**
	 * {@inheritDoc}
	 */
	set(key, value) {
		SideEffectHelper.validateSideEffectValue(value);
		if (!this._keys.contains(key)) {
			throw (`sideEffect (${key}) Key Does Not Exist`);
		}
		this.objectMap.put(key, value);
	},

	/**
	 * {@inheritDoc}
	 */
	add(key, value) {
		SideEffectHelper.validateSideEffectValue(value);
		this.set(key, this.getReducer(key).apply(this.get(key), value));
	},

	/**
	 * {@inheritDoc}
	 */
	register(key, initialValue, reducer) {
		SideEffectHelper.validateSideEffectKey(key);
		this._keys.add(key);
		if (!isNull(initialValue)) {
			this.supplierMap.put(key, initialValue);
		}
		if (!isNull(reducer)) {
			this.reducerMap.put(key, reducer);
		}
	},

	/**
	 * {@inheritDoc}
	 */
	registerIfAbsent(key, initialValue, reducer) {
		SideEffectHelper.validateSideEffectKey(key);
		if(!this._keys.contains(key))
			this._keys.add(key);
		if (isNull(this.supplierMap.get(key)) && !isNull(initialValue)) {
			this.supplierMap.put(key, initialValue);
		}
		if (isNull(this.reducerMap.get(key)) && !isNull(reducer)) {
			this.reducerMap.put(key, reducer);
		}
	},

	/**
	 * {@inheritDoc}
	 */
	getReducer(key) {
		if (!this._keys.contains(key)) {
			throw (`sideEffect (${key}) Key Does Not Exist`);
		}
		return this.reducerMap.getOrDefault(key, {apply: () => {}});
	},

	/**
	 * {@inheritDoc}
	 */
	getSupplier(key) {
		const supplier = this.supplierMap.get(key);
		if (!supplier) {
			throw (`sideEffect (${key}) Key Does Not Exist`);
		}
		return supplier;
	},

	/**
	 * {@inheritDoc}
	 */
	setSack(initialValue, splitOperator, mergeOperator) {
		this.sackInitialValue = initialValue;
		this.sackSplitOperator = splitOperator;
		this.sackMergeOperator = mergeOperator;
	},

	/**
	 * {@inheritDoc}
	 */
	getSackInitialValue() {
		return this.sackInitialValue;
	},

	/**
	 * {@inheritDoc}
	 */
	getSackSplitter() {
		return this.sackSplitOperator;
	},

	/**
	 * {@inheritDoc}
	 */
	getSackMerger() {
		return this.sackMergeOperator;
	},

	/**
	 * {@inheritDoc}
	 */
	remove(key) {
		this.objectMap.remove(key);
		this.supplierMap.remove(key);
		this.reducerMap.remove(key);
		this._keys.remove(key);
	},

	/**
	 * {@inheritDoc}
	 */
	keys() {
		return this._keys;
	},

	/**
	 * {@inheritDoc}
	 */
	mergeInto(sideEffects) {
		for (let i = 0; i < this._keys.size(); i++) {
			const key = this._keys.get(i);
			sideEffects.registerIfAbsent(key, this.supplierMap.get(key), this.reducerMap.get(key));
			if (this.objectMap.contains(key)) {
				sideEffects.set(key, this.objectMap.get(key));
			}
		}
	},

	registerSupplierIfAbsent(key, supplier) {
		this.registerIfAbsent(key, supplier, null);
	}
};

mixin(DefaultTraversalSideEffects, TraversalSideEffects.prototype);

export default DefaultTraversalSideEffects;
