import { TinkerGraph } from '../../../../src';
import tinkerpop_modern from '../../../../data/tinkerpop-modern.json';
import crew from '../../../../data/tinkerpop-crew-v2d0.json';

describe('GraphSONReader tinkerpop-modern', () => {
	const graph = TinkerGraph.open();
	const io = graph.io();
	io.readGraph(tinkerpop_modern);

	const g = graph.traversal();

	it('io.readGraph(tinkerpop_modern); graph._vertices.size(); should return 6', () => {
		expect(graph._vertices.size()).toBe(6);
	});

	it('marko then josh then peter asks out query should return them edges: ' +
		'marko - "vadas", "josh", "lop", for josh - "ripple", "lop", "peter", for peter - "lop"', () => {
		let query;

		g.V().has("name", "josh").next().addEdge("knows", g.V().has("name", "peter").next());

		const names1 = ["vadas", "josh", "lop"];

		// here marko asks query
		query = g.V(1).out();
		let i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next().value("name")).toBe(names1[i]);
			i++;
		}

		const names2 = ["peter", "ripple", "lop"];
		// here josh asks query
		query = g.V(1).out().out();
		i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next().value("name")).toBe(names2[i]);
			i++;
		}

		// here peter asks query
		query = g.V(1).out().out().out();
		i = 0;
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next().value("name")).toBe("lop");
			i++;
		}

	});

});

describe('GraphSONReader tinkerpop-crew-v2d0', () => {
	const graph = TinkerGraph.open();
	const io = graph.io();
	io.readGraph(crew);

	it('io.readGraph(crew); graph._edges.size(); should return 14', () => {
		expect(graph._edges.size()).toBe(14);
	});
});