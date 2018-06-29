import { TinkerGraph, TinkerFactory } from '../../../../src';
import testUpdate2 from '../../../../data/tinkerpop-modern-existing-test.json';
import testUpdate from '../../../../data/tinkerpop-modern-update-test.json';

describe('GraphSONWriter', () => {

	it('TinkerFactory.createModern(); io = graph.io(); io.updateGraph(nodes)' +
		' should return size of vertices 7', () => {

		const graph = TinkerFactory.createModern();
		expect(graph._vertices.size()).toBe(6);
		expect(graph._edges.size()).toBe(6);
		graph.io().updateGraph(testUpdate);
		expect(graph._vertices.size()).toBe(7); // added one vertex
		expect(graph._edges.size()).toBe(7); // added one edge
	});

	it('TinkerFactory.createModern(); io = graph.io(); io.updateGraph(nodes)' +
		' peter knows should return "lop" before update, "josh" after update', () => {
		const graph = TinkerFactory.createModern();
		const g = graph.traversal();
		let query = g.V(6).out('created');

		expect(g.V(6).next().value('age')).toBe(35);
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next().value('name')).toBe("lop");
		}

		const io = graph.io();
		io.updateGraph(testUpdate2);

		query = g.V(6).out('created');

		expect(g.V(6).next().value('age')).toBe(37);
		while (query.hasNext()){
			expect(query.next().value('name')).toBe("josh");
		}

	});

});

