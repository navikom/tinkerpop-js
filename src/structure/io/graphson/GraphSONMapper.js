import { List } from '../../../util';
import Mapper from '../Mapper';
import GraphSONVersion from './GraphSONVersion';
import TypeInfo from './TypeInfo';
import JSONGenerator from '../JSONGenerator';

/**
 * An extension to the standard Jackson {@code ObjectMapper} which automatically registers the standard
 * {@link GraphSONModule} for serializing {@link Graph} elements.  This class
 * can be used for generalized JSON serialization tasks that require meeting GraphSON standards.
 * <p/>
 * {@link Graph} implementations providing an {@link IoRegistry} should register their {@code SimpleModule}
 * implementations to it as follows:
 * <pre>
 * {@code
 * public class MyGraphIoRegistry extends AbstractIoRegistry {
 *   public MyGraphIoRegistry() {
 *     register(GraphSONIo.class, null, new MyGraphSimpleModule());
 *   }
 * }
 * }
 * </pre>
 *
 */
export default class GraphSONMapper {

	constructor(builder) {
		this.customModules = builder.customModules;
		this.loadCustomSerializers = builder.loadCustomModules;
		this.normalize = builder.normalize;
		this.embedTypes = builder.embedTypes;
		this.version = builder.version;
		this.typeInfo = builder.typeInfo;
		this.module = this.customModules.getValue(0);
		this.jsonGenerator = new JSONGenerator();
	}

	getVersion() {
		return this.version;
	}

	writeValue(output, element, direction){
		const serializer = this.module.serializer.getValue(element.type);
		serializer.serialize(output, element, this.jsonGenerator, this.module.serializer);
  output(element);
	}

	static build() {
		return new Builder();
	}

	getTypeInfo() {
		return this.typeInfo;
	}
}

class Builder extends Mapper {

	constructor() {
		super()
		this.customModules = new List();
		this.loadCustomModules = false;
		this._normalize = false;
		this.embedTypes = false;
		this.registries = new List();
		this._version = GraphSONVersion.V3_0;
		// GraphSON 2.0 should have types activated by default, otherwise use there's no point in using it instead of 1.0.
		this._typeInfo = TypeInfo.PARTIAL_TYPES;
	}

	addRegistry(registry) {
		this.registries.add(registry);
		return this;
	}

	/**
	 * Supply a mapper module for serialization/deserialization.
	 */
	addCustomModule(custom) {
		this.customModules.add(custom);
		return this;
	}

	/**
	 * Set the version of GraphSON to use. The default is {@link GraphSONVersion#V2_0}.
	 */
	version(version) {
		this._version = version;
		return this;
	}

	/**
	 * Forces keys to be sorted.
	 */
	normalize(normalize) {
		this._normalize = normalize;
		return this;
	}

	/**
	 * Specify if the values are going to be typed or not, and at which level. Setting this value will override
	 * the value of {@link #embedTypes(boolean)} where {@link TypeInfo#PARTIAL_TYPES} will set it to true and
	 * {@link TypeInfo#NO_TYPES} will set it to false.
	 *
	 * The level can be {@link TypeInfo#NO_TYPES} or {@link TypeInfo#PARTIAL_TYPES}, and could be extended in the
	 * future.
	 */
	typeInfo(typeInfo) {
		this._typeInfo = typeInfo;
		if (typeInfo === TypeInfo.PARTIAL_TYPES)
			this.embedTypes = true;
		else if (typeInfo === TypeInfo.NO_TYPES)
			this.embedTypes = false;
		else
			throw("This value can only be set to PARTIAL_TYPES and NO_TYPES");

		return this;
	}

	create() {
		return new GraphSONMapper(this);
	}
}