import { TinkerGraph, BaseConfiguration, T } from '../../../src';

describe('TinkerGraph getNextId', () => {

	it('vertex.id() should be number and return true', () => {
		const graph = TinkerGraph.open();
		const vertex = graph.addVertex(T.label, 'someVertex');
		expect(!isNaN(vertex.id())).toBe(true);
	});

	it('vertex.id() should be UUID and return false', () => {
		const conf = new BaseConfiguration();
		conf.setProperty(TinkerGraph.GREMLIN_TINKERGRAPH_VERTEX_ID_MANAGER, TinkerGraph.UUIDType);
		conf.setProperty(TinkerGraph.GREMLIN_TINKERGRAPH_EDGE_ID_MANAGER, TinkerGraph.UUIDType);
		conf.setProperty(TinkerGraph.GREMLIN_TINKERGRAPH_VERTEX_PROPERTY_ID_MANAGER, TinkerGraph.UUIDType);
		const graph = TinkerGraph.open(conf);
		const vertex = graph.addVertex(T.label, 'someVertex');
		expect(!isNaN(vertex.id())).toBe(false);
	});

});
