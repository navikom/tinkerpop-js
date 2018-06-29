import GraphSONModule from './GraphSONModule';

/**
 * The set of available GraphSON versions.
 *
 */
const GraphSONVersion = {};
class Versions {
	constructor(builder, versionNumber) {
		this.builder = builder;
		this.versionNumber = versionNumber;
	}

	getBuilder() {
		return this.builder;
	}

	getVersion() {
		return this.versionNumber;
	}
}

//GraphSONVersion.V1_0 = new Versions(GraphSONModule.GraphSONModuleV1d0.build(), "1.0");
GraphSONVersion.V2_0 = new Versions(GraphSONModule.GraphSONModuleV2d0.build(), "2.0");
GraphSONVersion.V3_0 = new Versions(GraphSONModule.GraphSONModuleV3d0.build(), "3.0");

export default GraphSONVersion;