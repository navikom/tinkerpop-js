import { mixin } from '../util';
import T from './T';
import VertexProperty from './VertexProperty';
import { ArrayUtils } from '../util';
import GraphTraversalSource from '../proccess/traversal/dsl/graph/GraphTraversalSource';
import GraphVariableHelper from './util/GraphVariableHelper';

/**
 *
 * @constructor
 */
function Graph(anonymous, clazz) {
  this.anonymous = anonymous;
  this.class = clazz;
}

Graph.prototype = {
  constructor: Graph,
  /**
   * Add a {@link Vertex} to the graph with provided vertex label.
   *
   * or
   *
   * Add a {@link Vertex} to the graph given an optional series of key/value pairs.  These key/values
   * must be provided in an even number where the odd numbered arguments are {@link String} property keys and the
   * even numbered arguments are the related property values.
   *
   * @param label the label of the vertex
   * @return The newly created labeled vertex
   */
  addVertex(...label) {
    if (label.length === 1) {
      return this.addVertex(T.label, label[0]);
    }
    throw new Error('Must be overloaded');
  },


  /**
   * Generate a reusable {@link GraphTraversalSource} instance.
   * The {@link GraphTraversalSource} provides methods for creating
   * {@link org.apache.tinkerpop.gremlin.process.traversal.dsl.graph.GraphTraversal} instances.
   *
   * @return A graph traversal source
   */
  traversal() {
    return new GraphTraversalSource(this);
  },

  /**
   * Get the {@link Vertex} objects in this graph with the provided vertex ids or {@link Vertex} objects themselves.
   * If no ids are provided, get all vertices.  Note that a vertex identifier does not need to correspond to the
   * actual id used in the graph.  It needs to be a bit more flexible than that in that given the
   * {@link Graph.Features} around id support, multiple arguments might be applicable here.
   * <p/>
   * If the graph return {@code true} for {@link Features.VertexFeatures#supportsNumericIds()} then it should support
   * filters as with:
   * <ul>
   * <li>g.vertices(v)</li>
   * <li>g.vertices(v.id())</li>
   * <li>g.vertices(1)</li>
   * <li>g.vertices(1L)</li>
   * <li>g.vertices(1.0d)</li>
   * <li>g.vertices(1.0f)</li>
   * <li>g.vertices("1")</li>
   * </ul>
   * <p/>
   * If the graph return {@code true} for {@link Features.VertexFeatures#supportsCustomIds()} ()} then it should support
   * filters as with:
   * <ul>
   * <li>g.vertices(v)</li>
   * <li>g.vertices(v.id())</li>
   * <li>g.vertices(v.id().toString())</li>
   * </ul>
   * <p/>
   * If the graph return {@code true} for {@link Features.VertexFeatures#supportsAnyIds()} ()} then it should support
   * filters as with:
   * <ul>
   * <li>g.vertices(v)</li>
   * <li>g.vertices(v.id())</li>
   * </ul>
   * <p/>
   * If the graph return {@code true} for {@link Features.VertexFeatures#supportsStringIds()} ()} then it should support
   * filters as with:
   * <ul>
   * <li>g.vertices(v)</li>
   * <li>g.vertices(v.id().toString())</li>
   * <li>g.vertices("id")</li>
   * </ul>
   * <p/>
   * If the graph return {@code true} for {@link Features.EdgeFeatures#supportsStringIds()} ()} then it should support
   * filters as with:
   * <ul>
   * <li>g.vertices(v)</li>
   * <li>g.vertices(v.id().toString())</li>
   * <li>g.vertices("id")</li>
   * </ul>
   *
   * @param vertexIds the ids of the vertices to get
   * @return an {@link Iterator} of vertices that match the provided vertex ids
   */
  vertices(...vertexIds) {
    throw new Error('Must be overloaded');
  },

  /**
   * Get the {@link Edge} objects in this graph with the provided edge ids or {@link Edge} objects. If no ids are
   * provided, get all edges. Note that an edge identifier does not need to correspond to the actual id used in the
   * graph.  It needs to be a bit more flexible than that in that given the {@link Graph.Features} around id support,
   * multiple arguments might be applicable here.
   * <p/>
   * If the graph return {@code true} for {@link Features.EdgeFeatures#supportsNumericIds()} then it should support
   * filters as with:
   * <ul>
   * <li>g.edges(e)</li>
   * <li>g.edges(e.id())</li>
   * <li>g.edges(1)</li>
   * <li>g.edges(1L)</li>
   * <li>g.edges(1.0d)</li>
   * <li>g.edges(1.0f)</li>
   * <li>g.edges("1")</li>
   * </ul>
   * <p/>
   * If the graph return {@code true} for {@link Features.EdgeFeatures#supportsCustomIds()} ()} then it should support
   * filters as with:
   * <ul>
   * <li>g.edges(e)</li>
   * <li>g.edges(e.id())</li>
   * <li>g.edges(e.id().toString())</li>
   * </ul>
   * <p/>
   * If the graph return {@code true} for {@link Features.EdgeFeatures#supportsAnyIds()} ()} then it should support
   * filters as with:
   * <ul>
   * <li>g.edges(e)</li>
   * <li>g.edges(e.id())</li>
   * </ul>
   * <p/>
   * If the graph return {@code true} for {@link Features.EdgeFeatures#supportsStringIds()} ()} then it should support
   * filters as with:
   * <ul>
   * <li>g.edges(e)</li>
   * <li>g.edges(e.id().toString())</li>
   * <li>g.edges("id")</li>
   * </ul>
   *
   * @param edgeIds the ids of the edges to get
   * @return an {@link Iterator} of edges that match the provided edge ids
   */
  edges(...edgeIds) {
    throw new Error('Must be overloaded');
  },


  /**
   * Construct a particular {@link Io} implementation for reading and writing the {@code Graph} and other data.
   * End-users will "select" the {@link Io} implementation that they want to use by supplying the
   * {@link org.apache.tinkerpop.gremlin.structure.io.Io.Builder} that constructs it.  In this way, {@code Graph}
   * vendors can supply their {@link IoRegistry} to that builder thus allowing for custom serializers to be
   * auto-configured into the {@link Io} instance.  Registering custom serializers is particularly useful for those
   * graphs that have complex types for {@link Element} identifiers.
   * </p>
   * For those graphs that do not need to register any custom serializers, the default implementation should suffice.
   * If the default is overridden, take care to register the current graph via the
   * {@link org.apache.tinkerpop.gremlin.structure.io.Io.Builder#graph(Graph)} method.
   */
  io(builder) {
    return builder.graph(this).create();
  },

  /**
   * A collection of global {@link Variables} associated with the graph.
   * Variables are used for storing metadata about the graph.
   *
   * @return The variables associated with this graph
   */
  variables() {
    throw new Error('Must be overloaded');
  },

  /**
   * Get the {@link org.apache.commons.configuration.Configuration} associated with the construction of this graph.
   * Whatever configuration was passed to {@link GraphFactory#open(org.apache.commons.configuration.Configuration)}
   * is what should be returned by this method.
   *
   * @return the configuration used during graph construction.
   */
  configuration() {
    throw new Error('Must be overloaded');
  },
};

Graph.GRAPH = 'graph';

/**
 * Graph.Variables
 * @constructor
 */
Graph.Variables = function () {
  this.variables = new Map();
};

Graph.Variables.prototype = {
  constructor: Graph.Variables,
  keys() {
    return this.variables.keySet();
  },

  getValue(var1) {
    return this.variables.getValue(var1);
  },

  setValue(var1, var2) {
    GraphVariableHelper.validateVariable(var1, var2);
    this.variables.put(var1, var2);
  },

  remove(var1) {
    this.variables.remove(var1);
  },

  asMap() {
    const map = new Map();
    this.keys().map(key => map.put(key, this.getValue(key)));
    return map;
  },
};

/**
 * Graph.Features
 * @constructor
 */
Graph.Features = function () {

};

Graph.Features.prototype = {
  constructor: Graph.Features,
  /**
   * Gets the features related to "graph" operation.
   */
  graph() {
    return new Graph.Features.GraphFeatures();
  },

  /**
   * Gets the features related to "vertex" operation.
   */
  vertex() {
    return new Graph.Features.VertexFeatures();
  },

  /**
   * Gets the features related to "edge" operation.
   */
  edge() {
    return new Graph.Features.EdgeFeatures();
  },
};

/**
 * Graph.Features.ElementFeatures
 * @constructor
 */
Graph.Features.ElementFeatures = function () {

};

Graph.Features.ElementFeatures.prototype = {
  constructor: Graph.Features.ElementFeatures,
  /**
   * Determines if an {@link Element} allows properties to be added.  This feature is set independently from
   * supporting "data types" and refers to support of calls to {@link Element#property(String, Object)}.
   */
  supportsAddProperty() {
    return true;
  },

  /**
   * Determines if an {@link Element} allows properties to be removed.
   */
  supportsRemoveProperty() {
    return true;
  },

  /**
   * Determines if an {@link Element} can have a user defined identifier.  Implementation that do not support
   * this feature will be expected to auto-generate unique identifiers.  In other words, if the {@link Graph}
   * allows {@code graph.addVertex(id,x)} to work and thus set the identifier of the newly added
   * {@link Vertex} to the value of {@code x} then this feature should return true.  In this case, {@code x}
   * is assumed to be an identifier datat ype that the {@link Graph} will accept.
   */
  supportsUserSuppliedIds() {
    return true;
  },

  /**
   * Determines if an {@link Element} has numeric identifiers as their internal representation. In other
   * words, if the value returned from {@link Element#id()} is a numeric value then this method
   * should be return {@code true}.
   * <p/>
   * Note that this feature is most generally used for determining the appropriate tests to execute in the
   * Gremlin Test Suite.
   */
  supportsNumericIds() {
    return true;
  },

  /**
   * Determines if an {@link Element} has string identifiers as their internal representation. In other
   * words, if the value returned from {@link Element#id()} is a string value then this method
   * should be return {@code true}.
   * <p/>
   * Note that this feature is most generally used for determining the appropriate tests to execute in the
   * Gremlin Test Suite.
   */
  supportsStringIds() {
    return true;
  },

  /**
   * Determines if an {@link Element} has UUID identifiers as their internal representation. In other
   * words, if the value returned from {@link Element#id()} is a {@link UUID} value then this method
   * should be return {@code true}.
   * <p/>
   * Note that this feature is most generally used for determining the appropriate tests to execute in the
   * Gremlin Test Suite.
   */
  supportsUuidIds() {
    return true;
  },

  /**
   * Determines if an {@link Element} has a specific custom object as their internal representation.
   * In other words, if the value returned from {@link Element#id()} is a type defined by the graph
   * implementations, such as OrientDB's {@code Rid}, then this method should be return {@code true}.
   * <p/>
   * Note that this feature is most generally used for determining the appropriate tests to execute in the
   * Gremlin Test Suite.
   */
  supportsCustomIds() {
    return true;
  },

  /**
   * Determines if an {@link Element} any Java object is a suitable identifier. TinkerGraph is a good
   * example of a {@link Graph} that can support this feature, as it can use any {@link Object} as
   * a value for the identifier.
   * <p/>
   * Note that this feature is most generally used for determining the appropriate tests to execute in the
   * Gremlin Test Suite. This setting should only return {@code true} if {@link #supportsUserSuppliedIds()}
   * is {@code true}.
   */
  supportsAnyIds() {
    return true;
  },

  /**
   * Determines if an identifier will be accepted by the {@link Graph}.  This check is different than
   * what identifier internally supports as defined in methods like {@link #supportsNumericIds()}.  Those
   * refer to internal representation of the identifier.  A {@link Graph} may accept an identifier that
   * is not of those types and internally transform it to a native representation.
   * <p/>
   * Note that this method only applies if {@link #supportsUserSuppliedIds()} is {@code true}. Those that
   * return {@code false} for that method can immediately return false for this one as it allows no ids
   * of any type (it generates them all).
   * <p/>
   * The default implementation will immediately return {@code false} if {@link #supportsUserSuppliedIds()}
   * is {@code false}.  If custom identifiers are supported then it will throw an exception.  Those that
   * return {@code true} for {@link #supportsCustomIds()} should override this method. If
   * {@link #supportsAnyIds()} is {@code true} then the identifier will immediately be allowed.  Finally,
   * if any of the other types are supported, they will be typed checked against the class of the supplied
   * identifier.
   */
  willAllowId(id) {
    if (!this.supportsUserSuppliedIds()) return false;
    if (this.supportsCustomIds()) { throw ('The default implementation is not capable of validating custom ids - please override'); }

    return this.supportsAnyIds() || (this.supportsStringIds() && typeof id === 'string')
      || (supportsNumericIds() && !isNaN(id)) || (supportsUuidIds() && typeof id === 'string');
  },
};

Graph.Features.ElementFeatures.FEATURE_USER_SUPPLIED_IDS = 'UserSuppliedIds';
Graph.Features.ElementFeatures.FEATURE_NUMERIC_IDS = 'NumericIds';
Graph.Features.ElementFeatures.FEATURE_STRING_IDS = 'StringIds';
Graph.Features.ElementFeatures.FEATURE_UUID_IDS = 'UuidIds';
Graph.Features.ElementFeatures.FEATURE_CUSTOM_IDS = 'CustomIds';
Graph.Features.ElementFeatures.FEATURE_ANY_IDS = 'AnyIds';
Graph.Features.ElementFeatures.FEATURE_ADD_PROPERTY = 'AddProperty';
Graph.Features.ElementFeatures.FEATURE_REMOVE_PROPERTY = 'RemoveProperty';

/**
 * Graph.Features.GraphFeatures
 * @constructor
 */
Graph.Features.GraphFeatures = function () {

};

Graph.Features.GraphFeatures.prototype = {
  constructor: Graph.Features.GraphFeatures,
};


Graph.Features.VertexFeatures = function () {

};

Graph.Features.VertexFeatures.prototype = {

  constructor: Graph.Features.VertexFeatures,
  /**
   * Gets the {@link VertexProperty.Cardinality} for a key.  By default, this method will return
   * {@link VertexProperty.Cardinality#list}.  Implementations that employ a schema can consult it to
   * determine the {@link VertexProperty.Cardinality}.  Those that do no have a schema can return their
   * default {@link VertexProperty.Cardinality} for every key.
   */
  getCardinality(key) {
    return VertexProperty.Cardinality.list;
  },

  /**
   * Determines if a {@link Vertex} can be added to the {@code Graph}.
   */
  supportsAddVertices() {
    return true;
  },

  /**
   * Determines if a {@link Vertex} can be removed from the {@code Graph}.
   */
  supportsRemoveVertices() {
    return true;
  },

  /**
   * Determines if a {@link Vertex} can support multiple properties with the same key.
   */
  supportsMultiProperties() {
    return true;
  },

  /**
   * Determines if a {@link Vertex} can support non-unique values on the same key. For this value to be
   * {@code true}, then {@link #supportsMetaProperties()} must also return true. By default this method,
   * just returns what {@link #supportsMultiProperties()} returns.
   */
  supportsDuplicateMultiProperties() {
    return this.supportsMultiProperties();
  },

  /**
   * Determines if a {@link Vertex} can support properties on vertex properties.  It is assumed that a
   * graph will support all the same data types for meta-properties that are supported for regular
   * properties.
   */
  supportsMetaProperties() {
    return true;
  },

  /**
   * Gets features related to "properties" on a {@link Vertex}.
   */
  properties() {
    return new Graph.Features.VertexPropertyFeatures();
  },
};

mixin(Graph.Features.VertexFeatures, Graph.Features.ElementFeatures.prototype);

Graph.Features.VertexFeatures.FEATURE_ADD_VERTICES = 'AddVertices';
Graph.Features.VertexFeatures.FEATURE_MULTI_PROPERTIES = 'MultiProperties';
Graph.Features.VertexFeatures.FEATURE_DUPLICATE_MULTI_PROPERTIES = 'DuplicateMultiProperties';
Graph.Features.VertexFeatures.FEATURE_META_PROPERTIES = 'MetaProperties';
Graph.Features.VertexFeatures.FEATURE_REMOVE_VERTICES = 'RemoveVertices';

/**
 * Graph.Features.EdgeFeatures
 * @constructor
 */
Graph.Features.EdgeFeatures = function () {

};

Graph.Features.EdgeFeatures.prototype = {
  constructor: Graph.Features.EdgeFeatures,
  /**
   * Determines if an {@link Edge} can be added to a {@code Vertex}.
   */
  supportsAddEdges() {
    return true;
  },

  /**
   * Determines if an {@link Edge} can be removed from a {@code Vertex}.
   */
  supportsRemoveEdges() {
    return true;
  },

  /**
   * Gets features related to "properties" on an {@link Edge}.
   */
  properties() {
    return new Graph.Features.EdgePropertyFeatures();
  },
};

mixin(Graph.Features.EdgeFeatures, Graph.Features.ElementFeatures.prototype);

Graph.Features.EdgeFeatures.FEATURE_ADD_EDGES = 'AddEdges';
Graph.Features.EdgeFeatures.FEATURE_REMOVE_EDGES = 'RemoveEdges';

/**
 * Graph.Features.DataTypeFeatures
 * @constructor
 */
Graph.Features.DataTypeFeatures = function () {

};

Graph.Features.DataTypeFeatures.prototype = {
  constructor: Graph.Features.DataTypeFeatures,
  /**
   * Supports setting of a boolean value.
   */
  supportsBooleanValues() {
    return true;
  },

  /**
   * Supports setting of a byte value.
   */
  supportsByteValues() {
    return true;
  },

  /**
   * Supports setting of a double value.
   */
  supportsDoubleValues() {
    return true;
  },

  /**
   * Supports setting of a float value.
   */
  supportsFloatValues() {
    return true;
  },

  /**
   * Supports setting of a integer value.
   */
  supportsIntegerValues() {
    return true;
  },

  /**
   * Supports setting of a long value.
   */
  supportsLongValues() {
    return true;
  },

  /**
   * Supports setting of a {@code Map} value.  The assumption is that the {@code Map} can contain
   * arbitrary serializable values that may or may not be defined as a feature itself.
   */
  supportsMapValues() {
    return true;
  },

  /**
   * Supports setting of a {@code List} value.  The assumption is that the {@code List} can contain
   * arbitrary serializable values that may or may not be defined as a feature itself.  As this
   * {@code List} is "mixed" it does not need to contain objects of the same type.
   *
   * @see #supportsMixedListValues()
   */
  supportsMixedListValues() {
    return true;
  },

  /**
   * Supports setting of an array of boolean values.
   */
  supportsBooleanArrayValues() {
    return true;
  },

  /**
   * Supports setting of an array of byte values.
   */
  supportsByteArrayValues() {
    return true;
  },

  /**
   * Supports setting of an array of double values.
   */
  supportsDoubleArrayValues() {
    return true;
  },

  /**
   * Supports setting of an array of float values.
   */
  supportsFloatArrayValues() {
    return true;
  },

  /**
   * Supports setting of an array of integer values.
   */
  supportsIntegerArrayValues() {
    return true;
  },

  /**
   * Supports setting of an array of string values.
   */
  supportsStringArrayValues() {
    return true;
  },

  /**
   * Supports setting of an array of long values.
   */
  supportsLongArrayValues() {
    return true;
  },

  /**
   * Supports setting of a Java serializable value.
   */
  supportsSerializableValues() {
    return true;
  },

  /**
   * Supports setting of a string value.
   */
  supportsStringValues() {
    return true;
  },

  /**
   * Supports setting of a {@code List} value.  The assumption is that the {@code List} can contain
   * arbitrary serializable values that may or may not be defined as a feature itself.  As this
   * {@code List} is "uniform" it must contain objects of the same type.
   *
   * @see #supportsMixedListValues()
   */
  supportsUniformListValues() {
    return true;
  },
};

Graph.Features.DataTypeFeatures.FEATURE_BOOLEAN_VALUES = 'BooleanValues';
Graph.Features.DataTypeFeatures.FEATURE_BYTE_VALUES = 'ByteValues';
Graph.Features.DataTypeFeatures.FEATURE_DOUBLE_VALUES = 'DoubleValues';
Graph.Features.DataTypeFeatures.FEATURE_FLOAT_VALUES = 'FloatValues';
Graph.Features.DataTypeFeatures.FEATURE_INTEGER_VALUES = 'IntegerValues';
Graph.Features.DataTypeFeatures.FEATURE_LONG_VALUES = 'LongValues';
Graph.Features.DataTypeFeatures.FEATURE_MAP_VALUES = 'MapValues';
Graph.Features.DataTypeFeatures.FEATURE_MIXED_LIST_VALUES = 'MixedListValues';
Graph.Features.DataTypeFeatures.FEATURE_BOOLEAN_ARRAY_VALUES = 'BooleanArrayValues';
Graph.Features.DataTypeFeatures.FEATURE_BYTE_ARRAY_VALUES = 'ByteArrayValues';
Graph.Features.DataTypeFeatures.FEATURE_DOUBLE_ARRAY_VALUES = 'DoubleArrayValues';
Graph.Features.DataTypeFeatures.FEATURE_FLOAT_ARRAY_VALUES = 'FloatArrayValues';
Graph.Features.DataTypeFeatures.FEATURE_INTEGER_ARRAY_VALUES = 'IntegerArrayValues';
Graph.Features.DataTypeFeatures.FEATURE_LONG_ARRAY_VALUES = 'LongArrayValues';
Graph.Features.DataTypeFeatures.FEATURE_SERIALIZABLE_VALUES = 'SerializableValues';
Graph.Features.DataTypeFeatures.FEATURE_STRING_ARRAY_VALUES = 'StringArrayValues';
Graph.Features.DataTypeFeatures.FEATURE_STRING_VALUES = 'StringValues';
Graph.Features.DataTypeFeatures.FEATURE_UNIFORM_LIST_VALUES = 'UniformListValues';

/**
 * Graph.Features.VertexPropertyFeatures
 * @constructor
 */
Graph.Features.VertexPropertyFeatures = function () {

};

Graph.Features.VertexPropertyFeatures.prototype = {
  constructor: Graph.Features.VertexPropertyFeatures,
  /**
   * Determines if a {@link VertexProperty} allows properties to be removed.
   */
  supportsRemoveProperty() {
    return true;
  },

  /**
   * Determines if a {@link VertexProperty} allows an identifier to be assigned to it.
   */
  supportsUserSuppliedIds() {
    return true;
  },

  /**
   * Determines if an {@link VertexProperty} has numeric identifiers as their internal representation.
   */
  supportsNumericIds() {
    return true;
  },

  /**
   * Determines if an {@link VertexProperty} has string identifiers as their internal representation.
   */
  supportsStringIds() {
    return true;
  },

  /**
   * Determines if an {@link VertexProperty} has UUID identifiers as their internal representation.
   */
  supportsUuidIds() {
    return true;
  },

  /**
   * Determines if an {@link VertexProperty} has a specific custom object as their internal representation.
   */
  supportsCustomIds() {
    return true;
  },

  /**
   * Determines if an {@link VertexProperty} any Java object is a suitable identifier.  Note that this
   * setting can only return true if {@link #supportsUserSuppliedIds()} is true.
   */
  supportsAnyIds() {
    return true;
  },

  /**
   * Determines if an identifier will be accepted by the {@link Graph}.  This check is different than
   * what identifier internally supports as defined in methods like {@link #supportsNumericIds()}.  Those
   * refer to internal representation of the identifier.  A {@link Graph} may accept an identifier that
   * is not of those types and internally transform it to a native representation.
   * <p/>
   * Note that this method only applies if {@link #supportsUserSuppliedIds()} is {@code true}. Those that
   * return {@code false} for that method can immediately return false for this one as it allows no ids
   * of any type (it generates them all).
   * <p/>
   * The default implementation will immediately return {@code false} if {@link #supportsUserSuppliedIds()}
   * is {@code false}.  If custom identifiers are supported then it will throw an exception.  Those that
   * return {@code true} for {@link #supportsCustomIds()} should override this method. If
   * {@link #supportsAnyIds()} is {@code true} then the identifier will immediately be allowed.  Finally,
   * if any of the other types are supported, they will be typed checked against the class of the supplied
   * identifier.
   */
  willAllowId(id) {
    if (!this.supportsUserSuppliedIds()) return false;
    if (this.supportsCustomIds()) { throw ('The default implementation is not capable of validating custom ids - please override'); }

    return this.supportsAnyIds() || (this.supportsStringIds() && typeof id === 'string')
      || (this.supportsNumericIds() && !isNaN(id)) || (this.supportsUuidIds() && typeof id === 'string');
  },
};

mixin(Graph.Features.VertexPropertyFeatures, Graph.Features.DataTypeFeatures.prototype);

Graph.Features.VertexPropertyFeatures.FEATURE_ADD_PROPERTY = 'AddProperty';
Graph.Features.VertexPropertyFeatures.FEATURE_REMOVE_PROPERTY = 'RemoveProperty';
Graph.Features.VertexPropertyFeatures.FEATURE_USER_SUPPLIED_IDS = 'UserSuppliedIds';
Graph.Features.VertexPropertyFeatures.FEATURE_NUMERIC_IDS = 'NumericIds';
Graph.Features.VertexPropertyFeatures.FEATURE_STRING_IDS = 'StringIds';
Graph.Features.VertexPropertyFeatures.FEATURE_UUID_IDS = 'UuidIds';
Graph.Features.VertexPropertyFeatures.FEATURE_CUSTOM_IDS = 'CustomIds';
Graph.Features.VertexPropertyFeatures.FEATURE_ANY_IDS = 'AnyIds';

/**
 * Graph.Features.EdgePropertyFeatures
 * @constructor
 */
Graph.Features.EdgePropertyFeatures = function () {

};

Graph.Features.EdgePropertyFeatures.prototype = {
  constructor: Graph.Features.EdgePropertyFeatures,
};

mixin(Graph.Features.EdgePropertyFeatures, Graph.Features.DataTypeFeatures.prototype);

export default Graph;
