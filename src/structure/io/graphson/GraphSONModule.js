import { mixin, Map } from '../../../util';
import GraphSONTokens from './GraphSONTokens';
import GraphSONSerializersV3d0 from './GraphSONSerializersV3d0';

/**
 * GraphSONModule
 * @type {{}}
 */
const GraphSONModule = {};

/**
 * Module
 * @constructor
 */
function Module(){
  this.serializer = new Map();
  this.deserializer = new Map();
}
Module.prototype = {
  constructor: Module,

  put(key, value){
    this.serializer.put(key, value);
  }
};

/**
 * graphson-3.0
 * @constructor
 */
GraphSONModule.GraphSONModuleV3d0 = function(normalize) {
  Module.call(this);
  this.version = 'graphson-3.0';

  ///////// serialize  ///////////
  this.serializer.put('Edge', new GraphSONSerializersV3d0.EdgeJacksonSerializer(normalize));
  this.serializer.put('Vertex', new GraphSONSerializersV3d0.VertexJacksonSerializer(normalize));
  this.serializer.put('VertexProperty', new GraphSONSerializersV3d0.VertexPropertyJacksonSerializer(normalize, true));
  this.serializer.put('Property', new GraphSONSerializersV3d0.PropertyJacksonSerializer());

  ///////// deserialize /////////
  this.deserializer.put('Vertex', new GraphSONSerializersV3d0.VertexJacksonDeserializer());
  this.deserializer.put('Edge', new GraphSONSerializersV3d0.EdgeJacksonDeserializer());
  this.deserializer.put('Property', new GraphSONSerializersV3d0.PropertyJacksonDeserializer());
  this.deserializer.put('Path', new GraphSONSerializersV3d0.PathJacksonDeserializer());
  this.deserializer.put('VertexProperty', new GraphSONSerializersV3d0.VertexPropertyJacksonDeserializer());
};

GraphSONModule.GraphSONModuleV3d0.prototype = {
  constructor: GraphSONModule.GraphSONModuleV3d0,
  getTypeDefinitions() {
    return GraphSONModule.GraphSONModuleV3d0.TYPE_DEFINITIONS;
  },

  getTypeNamespace() {
    return GraphSONTokens.GREMLIN_TYPE_NAMESPACE;
  }
};

mixin(GraphSONModule.GraphSONModuleV3d0, Module.prototype);

GraphSONModule.GraphSONModuleV3d0.TYPE_DEFINITIONS = new Map();
GraphSONModule.GraphSONModuleV3d0.TYPE_DEFINITIONS.put('Vertex', "Vertex");
GraphSONModule.GraphSONModuleV3d0.TYPE_DEFINITIONS.put('Edge', "Edge");

GraphSONModule.GraphSONModuleV3d0.build = () => new Builder(GraphSONModule.GraphSONModuleV3d0);

/**
 * graphson-2.0
 * @constructor
 */
GraphSONModule.GraphSONModuleV2d0 = function(normalize) {
  Module.call(this);
  this.version = 'graphson-2.0';

  ///////// serialize  ///////////


  ///////// deserialize /////////


};

GraphSONModule.GraphSONModuleV2d0.prototype = {
  constructor: GraphSONModule.GraphSONModuleV2d0,
  getTypeDefinitions() {
    return GraphSONModule.GraphSONModuleV2d0.TYPE_DEFINITIONS;
  },

  getTypeNamespace() {
    return GraphSONTokens.GREMLIN_TYPE_NAMESPACE;
  },
};

mixin(GraphSONModule.GraphSONModuleV2d0, Module.prototype);

GraphSONModule.GraphSONModuleV2d0.TYPE_DEFINITIONS = new Map();
GraphSONModule.GraphSONModuleV2d0.TYPE_DEFINITIONS.put('Vertex', "Vertex");
GraphSONModule.GraphSONModuleV2d0.TYPE_DEFINITIONS.put('Edge', "Edge");


GraphSONModule.GraphSONModuleV2d0.build = () => new Builder(GraphSONModule.GraphSONModuleV2d0);

/**
 * Builder
 */
class Builder {

  constructor(versionClass) {
    this.versionClass = versionClass
  }

  create(normalize) {
    return new this.versionClass(normalize);
  }
}

export default GraphSONModule;