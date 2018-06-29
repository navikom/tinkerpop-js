import { Predicate, List, ArrayUtils, isNull } from '../../util';
import Compare from './Compare';
import Contains from './Contains';
import AndP from './util/AndP';
import OrP from './util/OrP';

/**
 * P
 */
export default class P extends Predicate {
	constructor(biPredicate, value) {
		super();
		this.biPredicate = biPredicate;
		this.value = value;
		this.originalValue = value;
	}


	getBiPredicate() {
		return this.biPredicate;
	}

	/**
	 * Gets the original value used at time of construction of the {@code P}. This value can change its type
	 * in some cases.
	 */
	getOriginalValue() {
		return this.originalValue;
	}

	/**
	 * Gets the current value to be passed to the predicate for testing.
	 */
	getValue() {
		return this.value;
	}

	setValue(value) {
		this.value = value;
	}

	test(testValue) {
		//console.log('test', this, this.biPredicate, this.biPredicate.test, this.value, testValue)
		return this.biPredicate.test(testValue, this.value);
	}


	equals(other) {
		return other instanceof P &&
			other === this &&
			other.getBiPredicate === this.biPredicate &&
			((!other.getOriginalValue && !this.originalValue) || (other.getOriginalValue === this.originalValue));
	}


	negate() {
		return new P(this.biPredicate.negate(), this.originalValue);
	}

	and(predicate) {
		if (!(predicate instanceof P))
			throw("Only P predicates can be and'd together");
		return new AndP(new List([this, predicate]));
	}

	or(predicate) {
		if (!(predicate instanceof P))
			throw ("Only P predicates can be or'd together");
		return new OrP(new List([this, predicate]));
	}

	clone() {
		return Object.assign(Object.create(this), this);
	}

	toString() {
		return isNull(this.originalValue)
			? this.biPredicate.toString() : this.biPredicate.toString() + "(" + this.originalValue + ")";
	}

	//////////////// statics

	static eq(value) {
		return new P(Compare.eq, value);
	}

	static neq(value) {
		return new P(Compare.neq, value);
	}

	static lt(value) {
		return new P(Compare.lt, value);
	}

	static lte(value) {
		return new P(Compare.lte, value);
	}

	static gt(value) {
		return new P(Compare.gt, value);
	}

	static gte(value) {
		return new P(Compare.gte, value);
	}

	static inside(first, second) {
		return new AndP(new List([new P(Compare.gt, first), new P(Compare.lt, second)]));
	}

	static outside(first, second) {
		return new OrP(new List([new P(Compare.lt, first), new P(Compare.gt, second)]));
	}

	static between(first, second) {
		return new AndP(new List([new P(Compare.gte, first), new P(Compare.lt, second)]));
	}

	static within(...values) {
		values = ArrayUtils.checkArray(values);
		return P._within(new List(values));
	}

	static _within(value) {
		return new P(Contains.within, value);
	}


	static without(...values) {
		values = ArrayUtils.checkArray(values);
		return P._without(new List(values));
	}

	static _without(value) {
		return new P(Contains.without, value);
	}

	static test(biPredicate, value) {
		return new P(biPredicate, value);
	}

	static not(predicate) {
		console.log(predicate)
		return predicate.negate();
	}
}

P.type = 'P';

const eq = P.eq;
const neq = P.neq;
const lt = P.lt;
const lte = P.lte;
const gt = P.gt;
const gte = P.gte;
const inside = P.inside;
const outside = P.outside;
const between = P.between;
const within = P.within;
const without = P.without;
const test = P.test;
const not = P.not;

export {
	eq, neq, lt, lte, gt, gte, inside, within, outside, between, without, test, not
}