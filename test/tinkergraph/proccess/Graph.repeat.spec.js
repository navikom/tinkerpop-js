import { TinkerGraph, TinkerFactory, out, outE, hasLabel, has } from '../../../src';

describe('Graph modern repeat', () => {
	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().repeat(out()).times(2); should return "ripple", "lop"', () => {
		const query = g.V().repeat(out()).times(2);

		const names = ["ripple", "lop"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next().value("name")).toBe(names[i]);
			i++;
		}

	});

	it('g.V().repeat(out()).times(1); should return "lop", "lop", "lop", "vadas", "josh", "ripple"', () => {
		const query = g.V().repeat(out()).times(1);
		const names = ["lop", "lop", "lop", "vadas", "josh", "ripple"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next().value("name")).toBe(names[i]);
			i++;
		}
	});

	it('g.V(1).repeat(out()).until(hasLabel("software")).path().by("name") ' +
		'should return "marko->lop", "marko->josh->ripple", "marko->josh->lop"', () => {
		const query = g.V(1).repeat(out()).until(hasLabel("software")).path().by("name");
		const values = ["marko->lop", "marko->josh->ripple", "marko->josh->lop"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const mp = query.next();
			let string = '';
			mp.forEach((o, l, i) => string += i === 0 ? o : '->' + o);
			expect(string).toBe(values[i++]);
		}
	});

	it('g.V().until(has("name", "ripple")).repeat(out()).path().by("name") ' +
		'should return "marko->josh->ripple", "josh->ripple", "ripple"', () => {
		const query = g.V().until(has("name", "ripple")).repeat(out()).path().by("name");
		const values = ["marko->josh->ripple", "josh->ripple", "ripple"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const mp = query.next();
			let string = '';
			mp.forEach((o, l, i) => string += i === 0 ? o : '->' + o);
			expect(string).toBe(values[i++]);
		}
	});

	it('g.V(1).repeat(out()).until(outE().count().is(0)).path().by("name") ' +
		'should return "marko->josh->ripple", "josh->ripple", "ripple"', () => {
		const query = g.V(1).repeat(out()).until(outE().count().is(0)).path().by("name");
		const values = ["marko->lop", "marko->vadas", "marko->josh->ripple", "marko->josh->lop"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const mp = query.next();
			let string = '';
			mp.forEach((o, l, i) => string += i === 0 ? o : '->' + o);
			expect(string).toBe(values[i++]);
		}
	});

	it('g.V().repeat(out().hasLabel("person")).times(1).path() should return "1->2", "1->4"', () => {
		const query = g.V().repeat(out().hasLabel("person")).times(1).path();
		const values = ["1->2", "1->4"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const im = query.next();
			const it = im.iterator().toArray();
			let string = it[0].id() + '->' + it[1].id();
			expect(string).toBe(values[i++]);
		}
	});
});

describe('Graph crew repeat', () => {
	const graph = TinkerFactory.createTheCrew();
	const g = graph.traversal();

	it('g.V().repeat(out()).times(2); should return "tinkergraph"', () => {
		const query = g.V().repeat(out()).times(2);
		let count = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next().value("name")).toBe("tinkergraph");
			count++;
		}
		expect(count).toBe(7);
	});

});
