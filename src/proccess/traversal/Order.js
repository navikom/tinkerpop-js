import { Comparator } from '../../util';

class incrFunc {
	compare(first, second) {
		return Comparator.naturalOrder().compare(first, second);
	}

	reversed() {
		return new decr();
	}

	toString(){
		return this.constructor.name;
	}
}

class decrFunc {
	compare(first, second) {
		return Comparator.reverseOrder().compare(first, second);
	}

	reversed() {
		return new incr();
	}

	toString(){
		return this.constructor.name;
	}
}

class shuffleFunc {
	compare(first, second) {
		return Math.random() <= 0.5 ? -1 : 1;
	}

	reversed() {
		return new shuffleFunc();
	}

	toString(){
		return this.constructor.name;
	}
}

const Order = {
	incr: new incrFunc(),
	decr: new decrFunc(),
	shuffle: new shuffleFunc()
};

Order.contains = (value) =>
	Object.keys(Order).filter((key) => Order[key].constructor.name === value.constructor.name).length;

export default Order;
const incr = Order.incr;
const decr = Order.decr;
const shuffle = Order.shuffle;
export { incr, decr, shuffle }
