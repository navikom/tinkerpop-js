import { TinkerFactory, properties, incr } from '../../../src';

describe('Graph local', () => {

	const graph = TinkerFactory.createTheCrew();
	const g = graph.traversal();

	it('g.V().as("person").local(properties("location").order()' +
		'.by("startTime",incr).limit(2)).value().as("location")' +
		'.select("person","location").by("name").by(); ' +
		'should return "v[1]" 3 times', () => {
		const query = g.V().as("person").local(properties("location").order().by("startTime",incr).limit(2))
			.value().as("location").select("person","location").by("name").by();
		const values = [
			"{person=marko, location=san diego}", "{person=marko, location=santa cruz}",
			"{person=stephen, location=centreville}", "{person=stephen, location=dulles}",
			"{person=matthias, location=bremen}", "{person=matthias, location=baltimore}",
			"{person=daniel, location=spremberg}", "{person=daniel, location=kaiserslautern}"
		];
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			const r = query.next();
			expect(r.toString()).toBe(values[i++]);
		}
	});
});
