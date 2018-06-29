import { TinkerFactory, __, bothE } from '../../../src';

describe('Graph sample', () => {

	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().outE().sample(1).values("weight") should return random value from existing values', () => {
		const query = g.V().outE().sample(1).values("weight");
		expect(query.hasNext()).toBe(true);
	});

	it('g.V().outE().sample(1).by("weight").values("weight") should return random value from existing values', () => {
		const query = g.V().outE().sample(1).by("weight").values("weight");
		expect(query.hasNext()).toBe(true);
	});

	it('g.V().outE().sample(2).by("weight").values("weight") should return 2 random values from existing values', () => {
		const query = g.V().outE().sample(2).by("weight").values("weight");
		expect(query.hasNext()).toBe(true);
		expect(query.toList().length).toBe(2);
	});

	it('g.V(1).repeat(__.local(bothE().sample(1).by("weight").otherV())).times(5) ' +
		'should return random value from existing values', () => {
		const query = g.V(1).repeat(__.local(bothE().sample(1).by("weight").otherV())).times(5);
		expect(query.hasNext()).toBe(true);
	});

	it('g.V(1).repeat(__.local(bothE().sample(1).by("weight").otherV())).times(5).path() ' +
		'should return random value from existing values', () => {
		const query = g.V(1).repeat(__.local(bothE().sample(1).by("weight").otherV())).times(5).path()
		expect(query.hasNext()).toBe(true);
	});

	it('g.V(1).repeat(__.local(bothE().sample(1).by("weight").otherV())).times(10).path() ' +
		'should return random value from existing values', () => {
		const query = g.V(1).repeat(__.local(bothE().sample(1).by("weight").otherV())).times(10).path();
		expect(query.hasNext()).toBe(true);
	});
});
