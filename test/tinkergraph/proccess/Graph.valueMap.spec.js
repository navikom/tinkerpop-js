import { TinkerGraph, TinkerFactory } from '../../../src';

describe('Graph modern valueMap', () => {
	const g = TinkerFactory.createModern().traversal();

	it('g.V().valueMap(); should return "[name:[marko],age:[29]]", "[name:[vadas],age:[27]]", ' +
		'"[name:[lop],lang:[java]]", "[name:[josh],age:[32]]", "[name:[ripple],lang:[java]]", ' +
		'"[name:[peter],age:[35]]"', () => {
		const query = g.V().valueMap();
		const values = ["[name:[marko],age:[29]]", "[name:[vadas],age:[27]]",
			"[name:[lop],lang:[java]]", "[name:[josh],age:[32]]", "[name:[ripple],lang:[java]]", "[name:[peter],age:[35]]"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const map = query.next();
			let string = '';
			string = '[';
			map.forEach((iterator) => {
				string += (iterator.cursor === 0 ? '' : ',') + iterator.getKey() + ':';
				iterator.getValue().forEach((value) => string += '[' + value + ']');
			});
			string += ']';
			expect(string).toBe(values[i++]);
		}
	});

	it('g.V().valueMap("age"); should return "[age:[29]]", "[age:[27]]", "[]", "[age:[32]]", "[]", "[age:[35]]"', () => {
		const query = g.V().valueMap("age");
		const values = ["[age:[29]]", "[age:[27]]", "[]", "[age:[32]]", "[]", "[age:[35]]"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const map = query.next();
			let string = '';
			string = '[';
			map.forEach((iterator) => {
				string += (iterator.cursor === 0 ? '' : ',') + iterator.getKey() + ':';
				iterator.getValue().forEach((value) => string += '[' + value + ']');
			});
			string += ']';
			expect(string).toBe(values[i++]);
		}
	});

	it('g.V().valueMap("age", "blah"); should return "[age:[29]]", "[age:[27]]", "[]", "[age:[32]]", ' +
		'"[]", "[age:[35]]"', () => {
		const query = g.V().valueMap("age", "blah");
		const values = ["[age:[29]]", "[age:[27]]", "[]", "[age:[32]]", "[]", "[age:[35]]"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const map = query.next();
			let string = '';
			string = '[';
			map.forEach((iterator) => {
				string += (iterator.cursor === 0 ? '' : ',') + iterator.getKey() + ':';
				iterator.getValue().forEach((value) => string += '[' + value + ']');
			});
			string += ']';
			expect(string).toBe(values[i++]);
		}
	});

	it('g.E().valueMap(); should return "[age:[29]]", "[age:[27]]", "[]", "[age:[32]]", ' +
		'"[]", "[age:[35]]"', () => {
		const query = g.E().valueMap();
		const values = ["[weight:[0.5]]", "[weight:[1]]", "[weight:[0.4]]",
			"[weight:[1]]", "[weight:[0.4]]", "[weight:[0.2]]"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const map = query.next();
			let string = '';
			string = '[';
			map.forEach((iterator) => {
				string += (iterator.cursor === 0 ? '' : ',') + iterator.getKey() + ':';
				string += '[' + iterator.getValue() + ']';
			});
			string += ']';
			expect(string).toBe(values[i++]);
		}
	});
});

describe('Graph crew valueMap', () => {
	TinkerGraph.open().clear();
	const g = TinkerFactory.createTheCrew().traversal();

	it('g.V().hasLabel("person").valueMap(true); should return ' +
		'"[name:[marko],location:[san diego,santa cruz,brussels,santa fe],id:1,label:person]", ' +
		'"[name:[stephen],location:[centreville,dulles,purcellville],id:7,label:person]", ' +
		'"[name:[matthias],location:[bremen,baltimore,oakland,seattle],id:8,label:person]", ' +
		'"[name:[daniel],location:[spremberg,kaiserslautern,aachen],id:9,label:person]"', () => {
		const query = g.V().hasLabel("person").valueMap(true);
		const values = [
			"[name:[marko],location:[san diego,santa cruz,brussels,santa fe],id:1,label:person]",
			"[name:[stephen],location:[centreville,dulles,purcellville],id:7,label:person]",
			"[name:[matthias],location:[bremen,baltimore,oakland,seattle],id:8,label:person]",
			"[name:[daniel],location:[spremberg,kaiserslautern,aachen],id:9,label:person]"
		];

		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const map = query.next();
			let string = '';
			string = '[';
			map.forEach((iterator) => {
				string += (iterator.cursor === 0 ? '' : ',') + iterator.getKey() + ':';
				const value = iterator.getValue();
				if(!value.forEach){
					string += value;
				} else {
					string += '[';
					value.forEach((val, i) => string += i > 0 ? ',' + val : val);
					string += ']';
				}

			});
			string += ']';
			expect(string).toBe(values[i++]);
		}
	});

	it('g.V().hasLabel("person").valueMap(true, "name"); should return ' +
		'"[name:[marko],id:1,label:person]", ' +
		'"[name:[stephen],id:7,label:person]", ' +
		'"[name:[matthias],id:8,label:person]", ' +
		'"[name:[daniel],id:9,label:person]"', () => {
		const query = g.V().hasLabel("person").valueMap(true, "name");
		const values = [
			"[name:[marko],id:1,label:person]",
			"[name:[stephen],id:7,label:person]",
			"[name:[matthias],id:8,label:person]",
			"[name:[daniel],id:9,label:person]"
		];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const map = query.next();
			let string = '';
			string = '[';
			map.forEach((iterator) => {
				string += (iterator.cursor === 0 ? '' : ',') + iterator.getKey() + ':';
				const value = iterator.getValue();
				if(!value.forEach){
					string += value;
				} else {
					string += '[';
					value.forEach((val, i) => string += i > 0 ? ',' + val : val);
					string += ']';
				}

			});
			string += ']';
			expect(string).toBe(values[i++]);
		}
	});

	it('g.V().hasLabel("person").properties("location").valueMap(true); should return ' +
		'"[startTime:1997,endTime:2001,id:12,key:location,value:san diego]", ' +
		'"[startTime:2001,endTime:2004,id:13,key:location,value:santa cruz]", ....' , () => {
		const query = g.V().hasLabel("person").properties("location").valueMap(true);
		const values = [
			"[startTime:1997,endTime:2001,id:12,key:location,value:san diego]",
			"[startTime:2001,endTime:2004,id:13,key:location,value:santa cruz]",
			"[startTime:2004,endTime:2005,id:14,key:location,value:brussels]",
			"[startTime:2005,id:15,key:location,value:santa fe]",
			"[startTime:1990,endTime:2000,id:16,key:location,value:centreville]",
			"[startTime:2000,endTime:2006,id:17,key:location,value:dulles]",
			"[startTime:2006,id:18,key:location,value:purcellville]",
			"[startTime:2004,endTime:2007,id:19,key:location,value:bremen]",
			"[startTime:2007,endTime:2011,id:20,key:location,value:baltimore]",
			"[startTime:2011,endTime:2014,id:21,key:location,value:oakland]",
			"[startTime:2014,id:22,key:location,value:seattle]",
			"[startTime:1982,endTime:2005,id:23,key:location,value:spremberg]",
			"[startTime:2005,endTime:2009,id:24,key:location,value:kaiserslautern]",
			"[startTime:2009,id:25,key:location,value:aachen]"
		];

		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const map = query.next();
			let string = '';
			string = '[';
			map.forEach((iterator) => {
				string += (iterator.cursor === 0 ? '' : ',') + iterator.getKey() + ':';
				const value = iterator.getValue();
				if(!value.forEach){
					string += value;
				} else {
					string += '[';
					value.forEach((val, i) => string += i > 0 ? ',' + val : val);
					string += ']';
				}
			});
			string += ']';
			expect(string).toBe(values[i++]);
		}
	});
});