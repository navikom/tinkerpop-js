import { TinkerGraph, BaseConfiguration, TinkerFactory, __, out, tail, local, unfold} from './src';
//import big_ontology from './data/big_ontology.json';


//const conf = new BaseConfiguration();
//conf.setProperty(TinkerGraph.GREMLIN_TINKERGRAPH_VERTEX_ID_MANAGER, TinkerGraph.NumberIDType);
//conf.setProperty(TinkerGraph.GREMLIN_TINKERGRAPH_EDGE_ID_MANAGER, TinkerGraph.NumberIDType);
//conf.setProperty(TinkerGraph.GREMLIN_TINKERGRAPH_VERTEX_PROPERTY_ID_MANAGER, TinkerGraph.NumberIDType);
//conf.setProperty(TinkerGraph.GREMLIN_LOGS, false);
//const graph = TinkerGraph.open(conf);
//const io = graph.io();
//io.readGraph(big_ontology);

const graph = TinkerFactory.createModern();
//
const g = graph.traversal();

self.addEventListener('message', function(e) {
	// Send the message back.
	applyQuery(e.data);
}, false);

const applyQuery = (data) => {
	let object = null;
	switch (data.key) {
		case 'someQueryName1':
			object = g.V().valueMap().tail(local).toList();
			break;
		case 'someQueryName2':
			object = g.V().values("name").order().toList();
			break;
		default:
	}
	self.postMessage({ key: data.key, object});
};
