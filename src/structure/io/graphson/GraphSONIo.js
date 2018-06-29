import { Optional } from '../../../util';
import GraphSONVersion from './GraphSONVersion';
import GraphSONMapper from './GraphSONMapper';
import GraphSONReader from './GraphSONReader';
import GraphSONModule from './GraphSONModule';
import GraphSONWriter from './GraphSONWriter';
import GraphSONUpdater from './GraphSONUpdater';

/**
 * GraphSONIo
 */
export default class GraphSONIo {

  constructor(builder) {
    this.registry = builder.registry;
    this.graph = builder.graph;
    this.onMapper = Optional.ofNullable(builder.onMapper);
    this.version = builder.version;
  }

  reader() {
    return GraphSONReader.build().mapper(this.mapper().create());
  }

  writer() {
    return GraphSONWriter.build().mapper(this.mapper().create());
  }

  updater() {
    return GraphSONUpdater.build().mapper(this.mapper().create());
  }

  mapper() {
    const builder = GraphSONMapper.build().version(this.version)
      .addCustomModule(GraphSONModule.GraphSONModuleV3d0.build().create(false));

    return builder;
  }

  writeGraph(stream = () => {}, callback = () => {}) {
    this.writer().create().writeGraph(!stream || stream === null ? () => {} : stream, this.graph, callback);

  }

  writeGraphForJava(file = '', callback = () => {}) {
    this.writer().create().writeGraphForJava(file, this.graph, callback);
  }

  updateGraph(data) {
    this.updater().create().updateGraph(data, this.graph);

  }

  readGraph(data) {
    this.reader().create().readGraph(data, this.graph);
  }

  /**
   * Create a new builder using the version of GraphSON.
   */
  static build(version) {
    if (!version) {
      return GraphSONIo.build(GraphSONVersion.V3_0);
    }
    return new Builder(version);
  }
}

class Builder {

  constructor(version) {
    this.version = version;
    this.registry = null;
    this.onMapper = null;
  }

  onMapper(onMapper) {
    this.onMapper = onMapper;
    return this;
  }

  graph(g) {
    this.graph = g;
    return this;
  }

  create() {
    if (!this.graph) throw ("The graph argument was not specified");
    return new GraphSONIo(this);
  }
}
