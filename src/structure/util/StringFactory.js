import { List, Map, isNull } from '../../util';
import VertexProperty from '../VertexProperty';
import TraversalRing from '../../proccess/traversal/util/TraversalRing';

const V = "v";
const E = "e";
const P = "p";
const VP = "vp";
const L_BRACKET = "[";
const R_BRACKET = "]";
const COMMA_SPACE = ", ";
const COLON = ":";
const EMPTY_MAP = "{}";
const DOTS = "...";
const DASH = "-";
const ARROW = "->";
const STAR = "*";
const EMPTY_PROPERTY = "p[empty]";
const EMPTY_VERTEX_PROPERTY = "vp[empty]";
const LINE_SEPARATOR = '/';
const STORAGE = "storage";

const featuresStartWith = "supports";
const prefixLength = featuresStartWith.length;

export default class StringFactory {
	/**
	 * Construct the representation for a {@link org.apache.tinkerpop.gremlin.structure.Vertex}.
	 */
	static vertexString(vertex) {
		return V + L_BRACKET + vertex.id() + R_BRACKET;
	}

	/**
	 * Construct the representation for a {@link org.apache.tinkerpop.gremlin.structure.Edge}.
	 */
	static edgeString(edge) {
		return E + L_BRACKET + edge.id() + R_BRACKET + L_BRACKET + edge.outVertex().id()
			+ DASH + edge.label() + ARROW + edge.inVertex().id() + R_BRACKET;
	}

	/**
	 * Construct the representation for a {@link org.apache.tinkerpop.gremlin.structure.Property}
	 * or {@link org.apache.tinkerpop.gremlin.structure.VertexProperty}.
	 */
	static propertyString(property) {
		if (property instanceof VertexProperty) {
			if (!property.isPresent()) return EMPTY_VERTEX_PROPERTY;
			const valueString = property.value();
			return VP + L_BRACKET + property.key() + ARROW +
				valueString.substring(0, Math.min(valueString.length, 20)) + R_BRACKET;
		} else {
			if (!property.isPresent()) return EMPTY_PROPERTY;
			const valueString = property.value() + '';
			return P + L_BRACKET + property.key() + ARROW +
				valueString.substring(0, Math.min(valueString.length, 20)) + R_BRACKET;
		}
	}

	/**
	 * Construct the representation for a {@link org.apache.tinkerpop.gremlin.structure.Graph}.
	 *
	 * @param internalString a mapper {@link String} that appends to the end of the standard representation
	 */
	static graphString(graph, internalString) {
		return graph.constructor.name.toLowerCase() + L_BRACKET + internalString + R_BRACKET;
	}

	static graphVariablesString(variables) {
		return "variables" + L_BRACKET + "size:" + variables.keys().size() + R_BRACKET;
	}

	static memoryString(memory) {
		return "memory" + L_BRACKET + "size:" + memory.keys().size() + R_BRACKET;
	}

	static computeResultString(computerResult) {
		return "result" + L_BRACKET + computerResult.graph() + ',' + computerResult.memory() + R_BRACKET;
	}

	static graphComputerString(graphComputer) {
		return graphComputer.constructor.name.toLowerCase();
	}

	static traversalSourceString(traversalSource) {
		const graphString = traversalSource.getGraph().toString();
		return traversalSource.constructor.name.toLowerCase() + L_BRACKET + graphString + COMMA_SPACE + R_BRACKET;
	}


	static traversalSideEffectsString(traversalSideEffects) {
		return "sideEffects" + L_BRACKET + "size:" + traversalSideEffects.keys().size() + R_BRACKET;
	}

	static traversalStrategiesString(traversalStrategies) {
		return "strategies" + traversalStrategies.toList();
	}

	static traversalStrategyString(traversalStrategy) {
		return traversalStrategy.constructor.name;
	}

	static translatorString(translator) {
		return "translator[" + translator.getTraversalSource() + ":" + translator.getTargetLanguage() + "]";
	}

	static vertexProgramString(vertexProgram, internalString) {
		return vertexProgram.constructor.name + L_BRACKET + internalString + R_BRACKET;
	}

	static vertexProgramString(vertexProgram) {
		return vertexProgram.constructor.name;
	}

	static mapReduceString(mapReduce, internalString) {
		return mapReduce.constructor.name + L_BRACKET + internalString + R_BRACKET;
	}

	static mapReduceString(mapReduce) {
		return mapReduce.constructor.name;
	}

	// static createTransform(features) {
	//	return FunctionUtils.wrapFunction((m) -> ">-- " + m.getName().substring(prefixLength) + ": " + m.invoke(features).toString() + LINE_SEPARATOR);
	//}

	static printFeatureTitle(featureClass, sb) {
		sb.push("> ");
		sb.push(featureClass.name);
		sb.push(LINE_SEPARATOR);
	}

	static stepString(step, ...args) {
		const builder = [step.constructor.name];

		const strings = args
			.filter(o => !isNull(o))
			.filter(o => {
				if (o instanceof TraversalRing || o instanceof List || o instanceof Map)
					return !o.isEmpty();
				else
					return o.toString().length > 0 && step.constructor.name.toLowerCase() !== o;
			})
			.map(o => {
				const string = o.toString();
				return string.indexOf("$") > -1 ? "lambda" : string;
			});
		if (strings.length > 0) {
			builder.push('(');
			builder.push(strings.join(","));
			builder.push(')');
		}
		if (!step.getLabels().isEmpty()) {
			builder.push('@');
			builder.concat(step.getLabels());
		}
		return builder.join('');
	}

	static traversalString(traversal) {
		const string = traversal.getSteps().toString();
		return string;
	}

	static  storageString(internalString) {
		return STORAGE + L_BRACKET + internalString + R_BRACKET;
	}

	static  removeEndBrackets(collection) {
		const string = collection.toString();
		return string.substring(1, string.length - 1);
	}
}