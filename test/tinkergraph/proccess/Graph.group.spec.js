import { TinkerFactory, label, count } from '../../../src';

describe('Graph group', () => {
	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().group().by(label()) should return "person: marko, vadas, josh, peter", "software: lop, ripple"', () => {
		const query = g.V().group().by(label())
		const results = ["person: marko, vadas, josh, peter", "software: lop, ripple"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const map = query.next();
			map.forEach((entry) => {
				let result = entry.getKey() + ':';
				const list = entry.getValue();
				list.forEach((r, i) => result += ' ' + r.value('name') + (i < list.size() - 1 ? ',' : ''));
				expect(result).toBe(results[i++]);
			});
		}
	});

	it('g.V().group().by(label()).by("name") ' +
		'should return "person: marko, vadas, josh, peter", "software: lop, ripple"', () => {
		const query = g.V().group().by(label()).by("name");
		const results = ["person: marko, vadas, josh, peter", "software: lop, ripple"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const map = query.next();
			map.forEach((entry) => {
				let result = entry.getKey() + ':';
				const list = entry.getValue();
				list.forEach((r, i) => result += ' ' + r + (i < list.size() - 1 ? ',' : ''));
				expect(result).toBe(results[i++]);
			});
		}
	});

	it('g.V().group().by(label()).by(count()) should return "person: 4", "software: 2"', () => {
		const query = g.V().group().by(label()).by(count());
		const results = ["person: 4", "software: 2"];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const map = query.next();
			map.forEach((entry) => {
				let result = entry.getKey() + ': ' + entry.getValue();
				expect(result).toBe(results[i++]);
			});
		}
	});
});
