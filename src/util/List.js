import { Iterator } from './';
/**
 * List
 */
export class List {

	constructor(array) {
		this.array = array || [];
	}

	add(value, value1) {
		if (value1) {
			this.array.splice(value, 0, value1);
			return value1;
		} else if (value instanceof Array) {
			this.array.push(...value);
		} else {
			this.array.push(value);
		}
		return value;
	}

	put(value){
		if(this.array.includes(value)){
			return false;
		}
		return this.add(value);
	}

	getValue(index) {
		return this.getByIndex(index);
	}

	getByIndex(index) {
		return this.array[index];
	}

	value(index){
		return this.getByIndex(index);
	}

	get(index) {
		return this.getByIndex(index);
	}

	getByValue(value) {
		const iterator = this.iterator();
		const list = iterator.filter(entity => entity === value);
		return list.isEmpty() ? null : list.getValue(0);
	}

	size() {
		return this.array.length;
	}

	isEmpty() {
		return this.array.length === 0;
	}

	remove(index) {
		if(!isNaN(index)){
			this.array.splice(index, 1);
		} else {
			this.array.splice(this.array.indexOf(index), 1)
		}
	}

	removeByValue(value) {
		this.array.splice(this.array.indexOf(value), 1);
	}

	forEach(callback) {
		this.array.map((entity, i) => {
			callback(entity, i);
		});
	}

	contains(value) {
		return this.array.indexOf(value) > -1;
	}

	containsAll(list) {
		for (let i = 0; i < list.size(); i++) {
			if (!this.contains(list.getValue(i))) {
				return false;
			}
		}

		return true;
	}

	iterator() {
		return new Iterator(this.array);
	}

	clone() {
		return new List(this.array.slice());
	}

	addAll(elements) {
		if(Array.isArray(elements)) elements = new List(elements);

		for (let i = 0; i < elements.size(); i++) {
			if (this.array.indexOf(elements.get(i)) === -1)
				this.add(elements.getValue(i));
		}
	}

	getFirst() {
		return this.isEmpty() ? undefined : this.getValue(0);
	}

	removeAll(elements) {
		let modified = false;
		const temp = this.array.slice();
		for (let i = 0; i < this.size(); i++) {
			if ((this.get(i) instanceof List && this.get(i).containsAll(elements)) ||
				elements.contains(this.get(i))) {
				temp.splice(i, 1);
				modified = true;
			}
		}
		if (modified) {
			this.array = temp.slice();
		}
		return modified;
	}

	toArray() {
		return this.array;
	}

	sort(c) {
		this.array.sort((a, b) => {
			return c.compare ? c.compare(a, b) : c(a, b);
		});
		return this;
	}

	flatMap(){
		const list = new List();
		const traverse = (array) => {
			array.map((entry) => {
				if(entry instanceof List) {
					traverse(entry.array);
				} else {
					list.add(entry);
				}
			})
		}
		traverse(this.array);
		return list;
	}

	shuffle(){
		for (let i = this.size(); i; i--) {
			let j = Math.floor(Math.random() * i);
			[this.array[i - 1], this.array[j]] = [this.array[j], this.array[i - 1]];
		}
	}

	reverse(){
		this.array.reverse();
	}

	clear() {
		this.array = [];
	}

	toString(){
		const  it = this.iterator();
		if (!it.hasNext())
			return "[]";

		const sb = [];
		sb.push('[');
		for (;;) {
			let e = it.next();
			sb.push(e === this ? "(this Collection)" : e);
			if (! it.hasNext()){
				sb.push(']');
				return sb.join('');
			}
			sb.push(', ');
		}
	}
}
