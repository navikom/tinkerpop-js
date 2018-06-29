import { TinkerGraph } from './TinkerGraph';
import { BaseConfiguration } from '../../util';
import T from '../../structure/T';
import VertexProperty from '../../structure/VertexProperty';

/**
 * TinkerFactory
 */
export class TinkerFactory {
	static createClassic() {
		const conf = new BaseConfiguration();
		conf.setProperty(TinkerGraph.GREMLIN_TINKERGRAPH_VERTEX_ID_MANAGER, TinkerGraph.NumberIDType);
		conf.setProperty(TinkerGraph.GREMLIN_TINKERGRAPH_EDGE_ID_MANAGER, TinkerGraph.NumberIDType);
		conf.setProperty(TinkerGraph.GREMLIN_TINKERGRAPH_VERTEX_PROPERTY_ID_MANAGER, TinkerGraph.NumberIDType);
		conf.setProperty(TinkerGraph.GREMLIN_LOGS, true);

		const g = TinkerGraph.open(conf);
		TinkerFactory.generateClassic(g);
		return g;
	}

	static generateClassic(g) {
		const marko = g.addVertex(T.id, 1, 'name', 'marko', 'age', 29);
		const vadas = g.addVertex(T.id, 2, 'name', 'vadas', 'age', 27);
		const lop = g.addVertex(T.id, 3, 'name', 'lop', 'lang', 'java');
		const josh = g.addVertex(T.id, 4, 'name', 'josh', 'age', 32);
		const ripple = g.addVertex(T.id, 5, 'name', 'ripple', 'lang', 'java');
		const peter = g.addVertex(T.id, 6, 'name', 'peter', 'age', 35);
		marko.addEdge('knows', vadas, T.id, 7, 'weight', 0.5);
		marko.addEdge('knows', josh, T.id, 8, 'weight', 1.0);
		marko.addEdge('created', lop, T.id, 9, 'weight', 0.4);
		josh.addEdge('created', ripple, T.id, 10, 'weight', 1.0);
		josh.addEdge('created', lop, T.id, 11, 'weight', 0.4);
		peter.addEdge('created', lop, T.id, 12, 'weight', 0.2);
	}

	static createClassic2() {
		const conf = new BaseConfiguration();
		conf.setProperty(TinkerGraph.GREMLIN_TINKERGRAPH_VERTEX_ID_MANAGER, TinkerGraph.UUIDType);
		conf.setProperty(TinkerGraph.GREMLIN_TINKERGRAPH_EDGE_ID_MANAGER, TinkerGraph.UUIDType);
		conf.setProperty(TinkerGraph.GREMLIN_TINKERGRAPH_VERTEX_PROPERTY_ID_MANAGER, TinkerGraph.UUIDType);

		const g = TinkerGraph.open(conf);
		TinkerFactory.generateClassic2(g);
		return g;
	}

	static generateClassic2(g) {
		const marko = g.addVertex('name', 'marko', 'age', 29);
		const vadas = g.addVertex('name', 'vadas', 'age', 27);
		const lop = g.addVertex('name', 'lop', 'lang', 'java');
		const josh = g.addVertex('name', 'josh', 'age', 32);
		const ripple = g.addVertex('name', 'ripple', 'lang', 'java');
		const peter = g.addVertex('name', 'peter', 'age', 35);
		marko.addEdge('knows', vadas, 'weight', 0.5);
		marko.addEdge('knows', josh, 'weight', 1.0);
		marko.addEdge('created', lop, 'weight', 0.4);
		josh.addEdge('created', ripple, 'weight', 1.0);
		josh.addEdge('created', lop, 'weight', 0.4);
		peter.addEdge('created', lop, 'weight', 0.2);
	}

	static createModern(conf) {
		const g = TinkerGraph.open(conf);
		TinkerFactory.generateModern(g);
		return g;
	}

	static generateModern(g) {
		const marko = g.addVertex(T.id, 1, T.label, 'person', 'name', 'marko', 'age', 29);
		const vadas = g.addVertex(T.id, 2, T.label, 'person', 'name', 'vadas', 'age', 27);
		const lop = g.addVertex(T.id, 3, T.label, 'software', 'name', 'lop', 'lang', 'java');
		const josh = g.addVertex(T.id, 4, T.label, 'person', 'name', 'josh', 'age', 32);
		const ripple = g.addVertex(T.id, 5, T.label, 'software', 'name', 'ripple', 'lang', 'java');
		const peter = g.addVertex(T.id, 6, T.label, 'person', 'name', 'peter', 'age', 35);
		marko.addEdge('knows', vadas, T.id, 7, 'weight', 0.5);
		marko.addEdge('knows', josh, T.id, 8, 'weight', 1.0);
		marko.addEdge('created', lop, T.id, 9, 'weight', 0.4);
		josh.addEdge('created', ripple, T.id, 10, 'weight', 1.0);
		josh.addEdge('created', lop, T.id, 11, 'weight', 0.4);
		peter.addEdge('created', lop, T.id, 12, 'weight', 0.2);
	}

	static createModern2() {
		const g = TinkerGraph.open();
		TinkerFactory.generateModern2(g);
		return g;
	}

	static generateModern2(g) {
		const marko = g.addVertex(T.label, 'person', 'name', 'marko', 'age', 29);
		const vadas = g.addVertex(T.label, 'person', 'name', 'vadas', 'age', 27);
		const lop = g.addVertex(T.label, 'software', 'name', 'lop', 'lang', 'java');
		const josh = g.addVertex(T.id, 4, T.label, 'person', 'name', 'josh', 'age', 32);
		const ripple = g.addVertex(T.label, 'software', 'name', 'ripple', 'lang', 'java');
		const peter = g.addVertex(T.label, 'person', 'name', 'peter', 'age', 35);
		marko.addEdge('knows', vadas, 'weight', 0.5);
		marko.addEdge('knows', josh, 'weight', 1.0);
		marko.addEdge('created', lop, T.id, 9, 'weight', 0.4);
		josh.addEdge('created', ripple, 'weight', 1.0);
		josh.addEdge('created', lop, 'weight', 0.4);
		peter.addEdge('created', lop, 'weight', 0.2);
	}

	static createTheCrew() {
		const g = TinkerGraph.open();
		TinkerFactory.generateTheCrew(g);
		return g;
	}

	static generateTheCrew(g) {
		const marko = g.addVertex(T.id, 1, T.label, "person", "name", "marko");
		const stephen = g.addVertex(T.id, 7, T.label, "person", "name", "stephen");
		const matthias = g.addVertex(T.id, 8, T.label, "person", "name", "matthias");
		const daniel = g.addVertex(T.id, 9, T.label, "person", "name", "daniel");
		const gremlin = g.addVertex(T.id, 10, T.label, "software", "name", "gremlin");
		const tinkergraph = g.addVertex(T.id, 11, T.label, "software", "name", "tinkergraph");

		marko.property(VertexProperty.Cardinality.list, "location", "san diego", "startTime", 1997, "endTime", 2001);
		marko.property(VertexProperty.Cardinality.list, "location", "santa cruz", "startTime", 2001, "endTime", 2004);
		marko.property(VertexProperty.Cardinality.list, "location", "brussels", "startTime", 2004, "endTime", 2005);
		marko.property(VertexProperty.Cardinality.list, "location", "santa fe", "startTime", 2005);

		stephen.property(VertexProperty.Cardinality.list, "location", "centreville", "startTime", 1990, "endTime", 2000);
		stephen.property(VertexProperty.Cardinality.list, "location", "dulles", "startTime", 2000, "endTime", 2006);
		stephen.property(VertexProperty.Cardinality.list, "location", "purcellville", "startTime", 2006);

		matthias.property(VertexProperty.Cardinality.list, "location", "bremen", "startTime", 2004, "endTime", 2007);
		matthias.property(VertexProperty.Cardinality.list, "location", "baltimore", "startTime", 2007, "endTime", 2011);
		matthias.property(VertexProperty.Cardinality.list, "location", "oakland", "startTime", 2011, "endTime", 2014);
		matthias.property(VertexProperty.Cardinality.list, "location", "seattle", "startTime", 2014);

		daniel.property(VertexProperty.Cardinality.list, "location", "spremberg", "startTime", 1982, "endTime", 2005);
		daniel.property(VertexProperty.Cardinality.list, "location", "kaiserslautern", "startTime", 2005, "endTime", 2009);
		daniel.property(VertexProperty.Cardinality.list, "location", "aachen", "startTime", 2009);

		marko.addEdge("develops", gremlin, T.id, 13, "since", 2009);
		marko.addEdge("develops", tinkergraph, T.id, 14, "since", 2010);
		marko.addEdge("uses", gremlin, T.id, 15, "skill", 4);
		marko.addEdge("uses", tinkergraph, T.id, 16, "skill", 5);

		stephen.addEdge("develops", gremlin, T.id, 17, "since", 2010);
		stephen.addEdge("develops", tinkergraph, T.id, 18, "since", 2011);
		stephen.addEdge("uses", gremlin, T.id, 19, "skill", 5);
		stephen.addEdge("uses", tinkergraph, T.id, 20, "skill", 4);

		matthias.addEdge("develops", gremlin, T.id, 21, "since", 2012);
		matthias.addEdge("uses", gremlin, T.id, 22, "skill", 3);
		matthias.addEdge("uses", tinkergraph, T.id, 23, "skill", 3);

		daniel.addEdge("uses", gremlin, T.id, 24, "skill", 5);
		daniel.addEdge("uses", tinkergraph, T.id, 25, "skill", 3);

		gremlin.addEdge("traverses", tinkergraph, T.id, 26);

		g.variables().put("creator", "marko");
		g.variables().put("lastModified", 2014);
		g.variables().put("comment", "this graph was created to provide examples and test coverage for tinkerpop3 api" +
			" advances");
	}
}
