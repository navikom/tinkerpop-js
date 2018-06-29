import { TinkerGraph, TinkerFactory } from '../../../../src';

describe('GraphSONWriter', () => {

	it('TinkerFactory.createModern(); io = graph.io(); io.writeGraph((generator) => {generator.getOutputJSON()})' +
		' should return json object with array of vertices, wrote from graph with length = 6', () => {

		const graph = TinkerFactory.createModern();
		const io = graph.io();
		io.writeGraph(null, (jsonGenerator) => {
			expect(jsonGenerator.getOutputJSON().length).toBe(6);
		});
	});

	it('TinkerFactory.createModern(); g.E(11).next().remove(); io = graph.io(); ' +
		'io.writeGraph((generator) => {generator.getOutputJSON()[2].inE.created.length})' +
		' should return 2', () => {

		const graph = TinkerFactory.createModern();
		const g = graph.traversal();
		g.E(11).next().remove();
		const io = graph.io();
		io.writeGraph(null, (jsonGenerator) => {
			expect(jsonGenerator.getOutputJSON()[2].inE.created.length).toBe(2);
		});
	});
});