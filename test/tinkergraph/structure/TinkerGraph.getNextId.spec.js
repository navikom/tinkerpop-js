import { TinkerGraph, TinkerFactory, T } from '../../../src';
import ontology from '../../../data/ontology.json';

describe('TinkerGraph getNextId', () => {
	TinkerGraph.open().clear();
	const graph = TinkerFactory.createModern();
	TinkerGraph.open().clear();
	const graph2 = TinkerFactory.createModern2();

	it('TinkerFactory.createModern(); ' +
		'graph._vertices.getValue(1)._properties.getValue("name").getValue(0).id() should return 0', () => {
		const vertex = graph._vertices.getValue(1);
		expect(vertex._properties.getValue('name').getValue(0).id()).toBe(0);
		expect(vertex._properties.getValue('age').getValue(0).id()).toBe(2);
	});


	it('graph._vertices.getValue(3)._properties.getValue("name").getValue(0).id() should return 5', () => {
		const vertex = graph._vertices.getValue(3);
		expect(vertex._properties.getValue('name').getValue(0).id()).toBe(5);
		expect(vertex._properties.getValue('lang').getValue(0).id()).toBe(6);
	});

	it('graph._vertices.getValue(6)._properties.getValue("name").getValue(0).id() should return 11', () => {
		const vertex = graph._vertices.getValue(6);
		expect(vertex._properties.getValue('name').getValue(0).id()).toBe(11);
		expect(vertex._properties.getValue('age').getValue(0).id()).toBe(12);
	});

	it('TinkerFactory.createModern2(); ' +
		'vertices[0]._properties.getValue("name").getValue(0).id() should return 1', () => {
		const vertex = graph2._vertices._table[0];
		expect(vertex.id()).toBe(0);
		expect(vertex._properties.getValue('name').getValue(0).id()).toBe(1);
		expect(vertex._properties.getValue('age').getValue(0).id()).toBe(2);
	});

	//it('vertices[3]._properties.getValue("name").getValue(0).id() should return 7', () => {
	//	const vertex = graph2._vertices.list[3].value;
	//	expect(vertex.id()).toBe(6);
	//	expect(vertex._properties.getValue('name').getValue(0).id()).toBe(7);
	//	expect(vertex._properties.getValue('lang').getValue(0).id()).toBe(8);
	//});

	it('vertices[5]._properties.getValue("name").getValue(0).id() should return 15', () => {
		const vertex = graph2._vertices._table[5];
		expect(vertex.id()).toBe(14);
		expect(vertex._properties.getValue('name').getValue(0).id()).toBe(15);
		expect(vertex._properties.getValue('age').getValue(0).id()).toBe(16);
	});


	it('import ontology; vertices[27].id() should return 0', () => {
		TinkerGraph.open().clear();
		const graph3 = TinkerGraph.open();
		graph3.io().readGraph(ontology);

		const parent = graph3.addVertex(T.label, 'NEW');
		const v27 = graph3.addVertex(T.label, 'NEW V28');
		v27.addEdge('EDGE', parent);
		const vertex = graph3._vertices._table[27];
		const edge = graph3._edges._table[26];
		expect(vertex.id()).toBe(0);
		expect(edge.id()).toBe(2);
	});

});
