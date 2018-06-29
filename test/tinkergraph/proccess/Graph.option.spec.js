import { TinkerGraph, TinkerFactory, __, values, valueMap, label, none } from '../../../src';

describe('Graph option', () => {
	const graph = TinkerFactory.createModern();
	const g = graph.traversal();

	it('g.V().hasLabel("person").choose(values("age")).option(27, __.in()).option(32, __.out()).values("name"); ' +
		'should return "marko", "ripple", "lop"', () => {
		const query = g.V().hasLabel("person").choose(values("age")).option(27, __.in())
			.option(32, __.out()).values("name");
		expect(query.hasNext()).toBe(true);
		const names = ["marko", "ripple", "lop"];
		let i = 0;
		while (query.hasNext()){
			expect(query.next()).toBe(names[i++]);
		}
	});

	it('g.V().hasLabel("person").choose(values("name")).option("marko", values("age"))' +
		'.option("josh", values("name")).option("vadas", valueMap()).option("peter", label()); ' +
		'should return 29, "[age->27,name->vadas]", "josh", "person"', () => {
		const query = g.V().hasLabel("person").choose(values("name")).option("marko", values("age")).
		option("josh", values("name")).option("vadas", valueMap()).option("peter", label());
		expect(query.hasNext()).toBe(true);
		const vals = [29, "[name->vadas,age->27]", "josh", "person"];
		let i = 0;
		while (query.hasNext()){
			const value = query.next();
			let newValue;
			if(i === 1){
				newValue = '[';
				value.forEach((it) => newValue += (it.cursor > 0 ? ',' : '') + it.getKey() + '->' + it.getValue().get(0));
				newValue += ']';
			}
			expect(newValue || value).toBe(vals[i++]);
		}
	});

	it('g.V().hasLabel("person").choose(values("name")).option("marko", values("age")).option(none, values("name")); ' +
		'should return 29, "vadas", "josh", "peter"', () => {
		const query = g.V().hasLabel("person").choose(values("name")).option("marko", values("age"))
			.option(none, values("name"));
		expect(query.hasNext()).toBe(true);
		const vals = [29, "vadas", "josh", "peter"];
		let i = 0;
		while (query.hasNext()){
			expect(query.next()).toBe(vals[i++]);
		}
	});
});

