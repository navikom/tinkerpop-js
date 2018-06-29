import { mixin, Pair } from '../../../util';
import GraphSONTokens from './GraphSONTokens';
import GraphSONUtil from './GraphSONUtil';
import Element from '../../Element';
import Vertex from '../../Vertex';
import Edge from '../../Edge';
import Property from '../../Property';
import VertexProperty from '../../VertexProperty';
import Path from '../../../proccess/traversal/Path';
import MutablePath from '../../../proccess/traversal/step/util/MutablePath';
import {
  DetachedVertexProperty,
  DetachedVertex,
  DetachedEdge,
  DetachedProperty
} from '../../util/detached';

/**
 * GraphSONSerializersV3d0
 * @type {{}}
 */
const GraphSONSerializersV3d0 = {}

/**
 * Handler
 * @param handledType
 * @constructor
 */
function Handler(handledType) {
  this.handledType = handledType;
}

Handler.prototype = {
  constructor: Handler,
}

////////////////////////////// SERIALIZERS /////////////////////////////////

/**
 * VertexJacksonSerializer
 * @param normalize
 * @constructor
 */
GraphSONSerializersV3d0.VertexJacksonSerializer = function(normalize) {
  Handler.call(Vertex);
  this.normalize = normalize;
};

GraphSONSerializersV3d0.VertexJacksonSerializer.prototype = {

  constructor: GraphSONSerializersV3d0.VertexJacksonSerializer,
  serialize(output, vertex, jsonGenerator, serializerProvider){
    jsonGenerator.writeStartObject();

    jsonGenerator.writeObjectField(GraphSONTokens.ID, vertex.id());
    jsonGenerator.writeComma();
    jsonGenerator.writeStringField(GraphSONTokens.LABEL, vertex.label());
    this.writeEdges(output, vertex.outEdges, jsonGenerator, serializerProvider, GraphSONTokens.OUT_E);
    this.writeEdges(output, vertex.inEdges, jsonGenerator, serializerProvider, GraphSONTokens.IN_E);
    this.writeProperties(output, vertex, jsonGenerator, serializerProvider);

    jsonGenerator.writeEndObject();

  },

  writeProperties(output, vertex, jsonGenerator, mapper) {

    if (vertex.keys().size() === 0)
      return;

    jsonGenerator.writeComma();
    jsonGenerator.writeFieldName(GraphSONTokens.PROPERTIES);
    jsonGenerator.writeStartObject();

    const keys = vertex.keys();

    while (keys.hasNext()) {
      const key = keys.getKey();
      const vertexProperties = vertex.properties(key);
      if (vertexProperties.hasNext()) {
        jsonGenerator.writeFieldName(key);

        jsonGenerator.writeStartArray();

        while (vertexProperties.hasNext()) {
          const vp = vertexProperties.next();
          const serializer = mapper.getValue(vp.type);
          serializer.serialize(output, vp, jsonGenerator, module);
          if(vertexProperties.hasNext()){
            jsonGenerator.writeComma();
          }
        }
        jsonGenerator.writeEndArray();
      }
      keys.next();
      if(keys.hasNext()){
        jsonGenerator.writeComma();
      }
    }

    jsonGenerator.writeEndObject();
  },

  writeEdges(output, edgesList, jsonGenerator, mapper, token) {
    if(!edgesList)
      return;
    jsonGenerator.writeComma();
    jsonGenerator.writeFieldName(token);
    jsonGenerator.writeStartObject();
    const edges = edgesList.iterator();
    while (edges.hasNext()) {
      const key = edges.getKey();
      jsonGenerator.writeFieldName(key);
      jsonGenerator.writeStartArray();
      const list = edges.getValue();
      //console.log('writeEdges2', list)
      const serializer = mapper.getValue(list.getFirst().type);
      for(let i = 0; i < list.size(); i++){
        const edge = list.getValue(i);
        serializer.serialize(output, edge, jsonGenerator, mapper);

        if(i < list.size() - 1){
          jsonGenerator.writeComma();
        }
      }
      jsonGenerator.writeEndArray();
      edges.next();
      if(edges.hasNext()){
        jsonGenerator.writeComma();
      }
    }

    jsonGenerator.writeEndObject();
  },

};

mixin(GraphSONSerializersV3d0.VertexJacksonSerializer, Handler.prototype);

/**
 * EdgeJacksonSerializer
 * @param normalize
 * @constructor
 */
GraphSONSerializersV3d0.EdgeJacksonSerializer = function(normalize) {
  Handler.call(Vertex);
  this.normalize = normalize;
};

GraphSONSerializersV3d0.EdgeJacksonSerializer.prototype = {
  constructor: GraphSONSerializersV3d0.EdgeJacksonSerializer,
  serialize(output, edge, jsonGenerator, mapper){
    jsonGenerator.writeStartObject();

    jsonGenerator.writeObjectField(GraphSONTokens.ID, edge.id());
    jsonGenerator.writeComma();
    jsonGenerator.writeStringField(GraphSONTokens.LABEL, edge.label());
    jsonGenerator.writeComma();
    jsonGenerator.writeStringField(GraphSONTokens.IN_LABEL, edge.inVertex().label());
    jsonGenerator.writeComma();
    jsonGenerator.writeStringField(GraphSONTokens.OUT_LABEL, edge.outVertex().label());
    jsonGenerator.writeComma();
    jsonGenerator.writeObjectField(GraphSONTokens.IN, edge.inVertex().id());
    jsonGenerator.writeComma();
    jsonGenerator.writeObjectField(GraphSONTokens.OUT, edge.outVertex().id());

    this.writeProperties(output, edge, jsonGenerator, mapper);
    output(edge);
    jsonGenerator.writeEndObject();
  },

  writeProperties(output, edge, jsonGenerator, mapper) {

    const elementProperties = edge.properties();

    if (elementProperties.hasNext()) {
      const serializer = mapper.getValue(elementProperties.getValue().type);
      jsonGenerator.writeComma();

      jsonGenerator.writeFieldName(GraphSONTokens.PROPERTIES);

      jsonGenerator.writeStartObject();
      while (elementProperties.hasNext()) {
        const p = elementProperties.next();

        serializer.serialize(output, p, jsonGenerator, mapper);

        if(elementProperties.hasNext()){
          jsonGenerator.writeComma();
        }
      }
      jsonGenerator.writeEndObject();
    }
  }
};

mixin(GraphSONSerializersV3d0.EdgeJacksonSerializer, Handler.prototype);

/**
 * PropertyJacksonSerializer
 * @constructor
 */
GraphSONSerializersV3d0.PropertyJacksonSerializer = function() {
  Handler.call(Property);
};

GraphSONSerializersV3d0.PropertyJacksonSerializer.prototype = {
  constructor: GraphSONSerializersV3d0.PropertyJacksonSerializer,
  serialize(output, property, jsonGenerator, serializerProvider) {
    //jsonGenerator.writeStartObject();
    jsonGenerator.writeObjectField(GraphSONTokens.KEY, property.key());
    jsonGenerator.writeComma();
    jsonGenerator.writeObjectField(GraphSONTokens.VALUE, property.value());
    output(property);
    //jsonGenerator.writeEndObject();
  }
};

mixin(GraphSONSerializersV3d0.PropertyJacksonSerializer, Handler.prototype);

/**
 * VertexPropertyJacksonSerializer
 * @param normalize
 * @param includeLabel
 * @constructor
 */
/**
 *
 * @param normalize
 * @param includeLabel
 * @constructor
 */
GraphSONSerializersV3d0.VertexPropertyJacksonSerializer = function(normalize, includeLabel) {
  Handler.call(Property);
  this.normalize = normalize;
  this.includeLabel = includeLabel;
};

GraphSONSerializersV3d0.VertexPropertyJacksonSerializer.prototype = {
  constructor: GraphSONSerializersV3d0.VertexPropertyJacksonSerializer,
  serialize(output, property, jsonGenerator, serializerProvider) {
    jsonGenerator.writeStartObject();
    jsonGenerator.writeObjectField(GraphSONTokens.ID, property.id());
    jsonGenerator.writeComma();
    jsonGenerator.writeObjectField(GraphSONTokens.VALUE, property.value());
    if (this.includeLabel){
      jsonGenerator.writeComma();
      jsonGenerator.writeStringField(GraphSONTokens.LABEL, property.label());
    }
    GraphSONSerializersV3d0.VertexPropertyJacksonSerializer.tryWriteMetaProperties(property, jsonGenerator, this.normalize);
    output(property);
    jsonGenerator.writeEndObject();
  }
};

GraphSONSerializersV3d0.VertexPropertyJacksonSerializer.tryWriteMetaProperties = (property, jsonGenerator, normalize) => {
  // when "detached" you can't check features of the graph it detached from so it has to be
  // treated differently from a regular VertexProperty implementation.
  if (property instanceof DetachedVertexProperty) {
    // only write meta properties key if they exist
    if (property.properties().hasNext()) {
      GraphSONSerializersV3d0.VertexPropertyJacksonSerializer.writeMetaProperties(property, jsonGenerator, normalize);
    }
  } else {
    // still attached - so we can check the features to see if it's worth even trying to write the
    // meta properties key
    if (property.graph().features.vertexFeatures.supportsMetaProperties() && property.properties().hasNext()) {
      GraphSONSerializersV3d0.VertexPropertyJacksonSerializer.writeMetaProperties(property, jsonGenerator, normalize);
    }
  }
};

GraphSONSerializersV3d0.VertexPropertyJacksonSerializer.writeMetaProperties = (property, jsonGenerator, normalize) => {
  jsonGenerator.writeFieldName(GraphSONTokens.PROPERTIES);
  jsonGenerator.writeStartObject();
  const metaProperties = property.properties();
  while (metaProperties.hasNext()) {
    const metaProperty = metaProperties.next();
    jsonGenerator.writeObjectField(metaProperty.key(), metaProperty.value());
    if(metaProperties.hasNext()){
      jsonGenerator.writeComma();
    }
  }

  jsonGenerator.writeEndObject();
};

mixin(GraphSONSerializersV3d0.VertexPropertyJacksonSerializer, Handler.prototype);

/**
 * PathJacksonSerializer
 * @constructor
 */
GraphSONSerializersV3d0.PathJacksonSerializer = function() {
  Handler.call(Path);
};

GraphSONSerializersV3d0.PathJacksonSerializer.prototype = {
  constructor: GraphSONSerializersV3d0.PathJacksonSerializer,
  serialize(output, path, jsonGenerator, serializerProvider) {
    jsonGenerator.writeStartObject();

    jsonGenerator.writeObjectField(GraphSONTokens.LABELS, path.labels());
    jsonGenerator.writeObjectField(GraphSONTokens.OBJECTS, path.objects());

    jsonGenerator.writeEndObject();
    output(path);
  }
};

mixin(GraphSONSerializersV3d0.PathJacksonSerializer, Handler.prototype);

/**
 * GraphSONKeySerializer
 * @constructor
 */
GraphSONSerializersV3d0.GraphSONKeySerializer = function() {
};

GraphSONSerializersV3d0.GraphSONKeySerializer.prototype = {
  constructor: GraphSONSerializersV3d0.GraphSONKeySerializer,
  serialize(o, jsonGenerator, serializerProvider) {
    this.ser(o, jsonGenerator, serializerProvider);
  },

  serializeWithType(o, jsonGenerator, serializerProvider, typeSerializer) {
    this.ser(o, jsonGenerator, serializerProvider);
  },

  ser(o, jsonGenerator, serializerProvider) {
    if (Element instanceof o)
      jsonGenerator.writeFieldName(o.id());
  }
};

mixin(GraphSONSerializersV3d0.GraphSONKeySerializer, Handler.prototype);

//////////////////////////// DESERIALIZERS ///////////////////////////

/**
 * VertexJacksonDeserializer
 * @param normalize
 * @constructor
 */
GraphSONSerializersV3d0.VertexJacksonDeserializer = function(normalize) {
  Handler.call(Vertex);
  this.normalize = normalize;
};

GraphSONSerializersV3d0.VertexJacksonDeserializer.prototype = {
  constructor: GraphSONSerializersV3d0.VertexJacksonDeserializer,
  createObject(vertexData) {
    return new DetachedVertex(
      vertexData.getValue(GraphSONTokens.ID),
      vertexData.getValue(GraphSONTokens.LABEL),
      vertexData.getValue(GraphSONTokens.PROPERTIES)
    );
  }
};

mixin(GraphSONSerializersV3d0.VertexJacksonDeserializer, Handler.prototype);

/**
 * EdgeJacksonDeserializer
 * @param normalize
 * @constructor
 */
GraphSONSerializersV3d0.EdgeJacksonDeserializer = function(normalize) {
  Handler.call(Edge);
  this.normalize = normalize;
};

GraphSONSerializersV3d0.EdgeJacksonDeserializer.prototype = {
  constructor: GraphSONSerializersV3d0.EdgeJacksonDeserializer,
  createObject(edgeData) {
    return new DetachedEdge(
      edgeData.getValue(GraphSONTokens.ID),
      edgeData.getValue(GraphSONTokens.LABEL),
      edgeData.getValue(GraphSONTokens.PROPERTIES),
      Pair.with(edgeData.getValue(GraphSONTokens.OUT), edgeData.getValue(GraphSONTokens.OUT_LABEL)),
      Pair.with(edgeData.getValue(GraphSONTokens.IN), edgeData.getValue(GraphSONTokens.IN_LABEL))
    );
  }
};

mixin(GraphSONSerializersV3d0.EdgeJacksonDeserializer, Handler.prototype);

/**
 * PropertyJacksonDeserializer
 * @param normalize
 * @constructor
 */
GraphSONSerializersV3d0.PropertyJacksonDeserializer = function(normalize) {
  Handler.call(Property);
  this.normalize = normalize;
};

GraphSONSerializersV3d0.PropertyJacksonDeserializer.prototype = {
  constructor: GraphSONSerializersV3d0.PropertyJacksonDeserializer,

  createObject(propData) {
    return new DetachedProperty(
      propData.getValue(GraphSONTokens.KEY),
      propData.getValue(GraphSONTokens.VALUE));
  }
};

mixin(GraphSONSerializersV3d0.PropertyJacksonDeserializer, Handler.prototype);

/**
 * PathJacksonDeserializer
 * @param normalize
 * @constructor
 */
GraphSONSerializersV3d0.PathJacksonDeserializer = function() {
  Handler.call(Path);
};

GraphSONSerializersV3d0.PathJacksonDeserializer.prototype = {
  constructor: GraphSONSerializersV3d0.PathJacksonDeserializer,
  createObject(pathData) {
    const p = MutablePath.make();

    const labels = pathData.getValue(GraphSONTokens.LABELS);
    const objects = pathData.getValue(GraphSONTokens.OBJECTS);

    for (let i = 0; i < objects.size(); i++) {
      p.extend(objects.getValue(i), new List(labels.getValue(i)));
    }
    return p;
  }
};

mixin(GraphSONSerializersV3d0.PathJacksonDeserializer, Handler.prototype);

/**
 * VertexPropertyJacksonDeserializer
 * @param normalize
 * @constructor
 */
GraphSONSerializersV3d0.VertexPropertyJacksonDeserializer = function() {
  Handler.call(VertexProperty);
};

GraphSONSerializersV3d0.VertexPropertyJacksonDeserializer.prototype = {
  constructor: GraphSONSerializersV3d0.VertexPropertyJacksonDeserializer,
  createObject(propData) {
    return new DetachedVertexProperty(
      propData.getValue(GraphSONTokens.ID),
      propData.getValue(GraphSONTokens.LABEL),
      propData.getValue(GraphSONTokens.VALUE),
      propData.getValue(GraphSONTokens.PROPERTIES)
    );
  }
};

mixin(GraphSONSerializersV3d0.VertexPropertyJacksonDeserializer, Handler.prototype);

export default GraphSONSerializersV3d0;