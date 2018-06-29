import { TinkerFactory, out, has, hasLabel } from '../../../src';

describe('Graph emit', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V(1).repeat(out()).times(2).emit() should return "lop", "vadas", "josh", "ripple", "lop"', () => {
		const query = g.V(1).repeat(out()).times(2).emit();
		const names = ["lop", "vadas", "josh", "ripple", "lop"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while(query.hasNext()){
			expect(query.next().value("name")).toBe(names[i++]);
		}
	});

	it('g.V(1).repeat(out()).times(2).emit().path().by("name") ' +
		'should return 5 arrays', () => {
		const length = [2, 2, 2, 3, 3];
		let i = 0;
		const query = g.V(1).repeat(out()).times(2).emit().path().by("name");
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const path = query.next().iterator().toArray();
			expect(path.length).toBe(length[i++]);
		}
	});

	it('g.V(1).emit().repeat(out()).times(2).path().by("name") ' +
		'should return 6 arrays', () => {
		const length = [1, 2, 2, 2, 3, 3];
		let i = 0;
		const query = g.V(1).emit().repeat(out()).times(2).path().by("name");
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const path = query.next().iterator().toArray();
			expect(path.length).toBe(length[i++]);
		}
	});

	it('g.V(1).repeat(out()).times(2).emit(has("lang")).path().by("name") ' +
		'should return 3 arrays', () => {
		const length = [2, 3, 3];
		let i = 0;
		const query = g.V(1).repeat(out()).times(2).emit(has("lang")).path().by("name");
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const path = query.next().iterator().toArray();
			expect(path.length).toBe(length[i++]);
		}
	});

	it('g.V(1).emit(hasLabel("person")).repeat(out()).path().by("name") ' +
		'should return 3 arrays', () => {
		const length = [1, 2, 2];
		let i = 0;
		const query = g.V(1).emit(hasLabel("person")).repeat(out()).path().by("name");
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const path = query.next().iterator().toArray();
			expect(path.length).toBe(length[i++]);
		}
	});
});