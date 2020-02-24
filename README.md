# Gremlin core Javascript

## [Apache TinkerPop3](http://tinkerpop.apache.org/) is a graph based database used for graph analytics.

## [TinkerGraph](https://github.com/tinkerpop/blueprints/wiki/TinkerGraph) is a lightweight, [POJO](https://en.wikipedia.org/wiki/Plain_old_Java_object) based, in-memory [property graph](https://github.com/tinkerpop/blueprints/wiki/Property-Graph-Model) that serves as the reference implementation for the property graph model. If you have a small graph that can be loaded and saved using the [GraphML reader and writer library](https://github.com/tinkerpop/blueprints/wiki/GraphML-Reader-and-Writer-Library), then TinkerGraph can be handy to use. It is also great for use in writing unit tests in place of other implementations that require greater resources.

<p align="center">
<img src="https://raw.githubusercontent.com/tinkerpop/blueprints/master/doc/images/graph-example-1.jpg" width="40%"/>
</p>


## Gremlin core JavaScript is a ported javascript version of TinkerGraph. 

## Prerequisites

### Dependency module install
`npm install`


### Build

`npm run build`

### Running the tests

`npm run test`

### Clean

 `rm -f dist/*`

 Delete existing dist files
 
## Usage sample

### Graph Configuration

```javascript
const conf = new BaseConfiguration();
conf.setProperty(TinkerGraph.GREMLIN_TINKERGRAPH_VERTEX_ID_MANAGER, TinkerGraph.NumberIDType);
conf.setProperty(TinkerGraph.GREMLIN_TINKERGRAPH_EDGE_ID_MANAGER, TinkerGraph.NumberIDType);
conf.setProperty(TinkerGraph.GREMLIN_TINKERGRAPH_VERTEX_PROPERTY_ID_MANAGER, TinkerGraph.NumberIDType);
conf.setProperty(TinkerGraph.GREMLIN_LOGS, false);
```

### Sample usage

```javascript
const g = TinkerFactory.createModern().traversal();
g.addV("person").property("name", "stephen").iterate();

g.V().values("name");
//output "marko", "vadas", "lop", "josh", "ripple", "peter", "stephen"
```
