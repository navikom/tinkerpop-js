import { TinkerGraph, BaseConfiguration, TinkerFactory, __, out, T, outE, has, eq, neq} from './src';
import KeyValueHTTPApi from './api/KeyValueHTTPApi';
import apiSettings from './api/apiSettings';
import big_ontology from './data/pizza.json';

//const api = new KeyValueHTTPApi(apiSettings.temporaryKeyValueHTTPApi);
const conf = new BaseConfiguration();
conf.setProperty(TinkerGraph.GREMLIN_TINKERGRAPH_VERTEX_ID_MANAGER, TinkerGraph.NumberIDType);
conf.setProperty(TinkerGraph.GREMLIN_TINKERGRAPH_EDGE_ID_MANAGER, TinkerGraph.NumberIDType);
conf.setProperty(TinkerGraph.GREMLIN_TINKERGRAPH_VERTEX_PROPERTY_ID_MANAGER, TinkerGraph.NumberIDType);
conf.setProperty(TinkerGraph.GREMLIN_LOGS, false);
//const graph = TinkerGraph.open(conf);
//const io = graph.io();
//io.readGraph(big_ontology);
//console.time('gremlin');

const graph = TinkerFactory.createModern(conf);
//
const g = graph.traversal();
//const io = graph.io();
//io.writeGraph(null, (jsonGenerator) => {
//  console.log(jsonGenerator);
//});
//console.timeEnd('gremlin');

g.V(1).as("a").out("created").in("created").where(neq("a")).
addE("co-developer").from("a").property("year",2009).iterate();

const query = g.E().hasLabel("co-developer").count();
while (query.hasNext()){
  console.log(query.next());
}

console.log(__.out("knows", "some").getBytecode().stepInstructions[0].arguments.length);