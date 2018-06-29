import { Map, Logger } from '../../../util';
import GraphSONMapper from './GraphSONMapper';
import GraphSONTokens from './GraphSONTokens';
import GraphSONVersion from './GraphSONVersion';
import Direction from '../../Direction';

/**
 * GraphSONWriter
 */
export default class GraphSONWriter {

	constructor(builder) {
		this.mapper = builder._mapper;
		this.wrapAdjacencyList = builder._wrapAdjacencyList;
	}

	/**
	 * Writes a {@link Graph} to stream in an adjacency list format where vertices are written with edges from both
	 * directions.  Under this serialization model, edges are grouped by label.
	 *
	 * @param outputStream the stream to write to.
	 * @param g the graph to write to stream.
	 */
	writeGraph(outputStream, g, callback) {
		const logger = Logger.init();
		logger.start();
		if (this.wrapAdjacencyList){
			this.mapper.jsonGenerator.writeStartObject();
			this.mapper.jsonGenerator.writeFieldName(GraphSONTokens.VERTICES);
		}
		this.mapper.jsonGenerator.startGenerator();
		this.writeVertices(outputStream, g.vertices(), Direction.BOTH);
		this.mapper.jsonGenerator.stopGenerator();
		if (this.wrapAdjacencyList){
			this.mapper.jsonGenerator.writeEndObject();
		}
		callback(this.mapper.jsonGenerator);
		logger.info('GraphSONWriter::writeGraph');
	}

	writeGraphForJava(outputStream, g, callback) {
		const logger = Logger.init();
		logger.start();
		this.mapper.jsonGenerator.startGeneratorForJava();
		this.writeVerticesForJava(outputStream, g.vertices(), Direction.BOTH);
		this.mapper.jsonGenerator.stopGeneratorForJava();
		callback(this.mapper.jsonGenerator);
		logger.info('GraphSONWriter::writeGraphForJava');
	}

	/**
	 * Writes a single {@link Vertex} to stream where edges only from the specified direction are written.
	 * Under this serialization model, edges are grouped by label.
	 *
	 * @param direction the direction of edges to write or null if no edges are to be written.
	 */
	writeVertex(outputStream, v, direction) {
		if (!direction) {
			this.writeVertex(outputStream, v, null);
		}
		this.mapper.writeValue(outputStream, v, direction);
	}

	/**
	 * Writes a list of vertices in adjacency list format where vertices are written with edges from both
	 * directions.  Under this serialization model, edges are grouped by label.
	 *
	 * @param outputStream the stream to write to.
	 * @param vertexIterator    a traversal that returns a list of vertices.
	 * @param direction    if direction is null then no edges are written.
	 */
	writeVertices(output, vertexIterator, direction) {
		while (vertexIterator.hasNext()) {
			this.writeVertex(output, vertexIterator.next(), direction);
			if (vertexIterator.hasNext()) {
				this.mapper.jsonGenerator.writeComma();
				this.mapper.jsonGenerator.writeNextLine();
			}
		}
		return output;
	}

	writeVerticesForJava(output, vertexIterator, direction) {
		while (vertexIterator.hasNext()) {
			this.writeVertex(output, vertexIterator.next(), direction);
			if (vertexIterator.hasNext()) {
				this.mapper.jsonGenerator.writeNextLine();
			}
		}
		return output;
	}

	static build() {
		return new Builder();
	}
}

class Builder {
	constructor() {
		this._mapper = GraphSONMapper.build().create();
		this._wrapAdjacencyList = false;
	}

	/**
	 * Override all of the {@link GraphSONMapper} builder
	 * options with this mapper.  If this value is set to something other than null then that value will be
	 * used to construct the writer.
	 */
	mapper(mapper) {
		this._mapper = mapper;
		return this;
	}

	/**
	 * Wraps the output of {@link #writeGraph(OutputStream, Graph)}, {@link #writeVertices(OutputStream, Iterator)}
	 * and {@link #writeVertices(OutputStream, Iterator, Direction)} in a JSON object.  By default, this value
	 * is {@code false} which means that the output is such that there is one JSON object (vertex) per line.
	 * When {@code true} the line breaks are not written and instead a valid JSON object is formed where the
	 * vertices are part of a JSON array in a key called "vertices".
	 * <p/>
	 * By setting this value to {@code true}, the generated JSON is no longer "splittable" by line and thus not
	 * suitable for OLAP processing.  Furthermore, reading this format of the JSON with
	 * {@link GraphSONReader#readGraph(InputStream, Graph)} or
	 * {@link GraphSONReader#readVertices(InputStream, Function, Function, Direction)} requires that the
	 * entire JSON object be read into memory, so it is best saved for "small" graphs.
	 */
	wrapAdjacencyList(wrapAdjacencyListInObject) {
		this._wrapAdjacencyList = wrapAdjacencyListInObject;
		return this;
	}

	create() {
		return new GraphSONWriter(this);
	}
}