import { mixin, ArrayUtils, Optional, isNull } from '../../../../util';
import ConstantSupplier from '../../../../util/function/ConstantSupplier';
import Traversal from '../../Traversal';
import __ from './__';
import ByModulating from '../../ByModulating';
import TraversalHelper from '../../util/TraversalHelper';
import TimesModulating from '../../step/TimesModulating';
import TraversalOptionParent from '../../step/TraversalOptionParent';
import { TraversalFilterStep,
	DropStep,
	LambdaFilterStep,
	DedupGlobalStep,
	RangeGlobalStep,
	NotStep,
	IsStep,
	WhereTraversalStep,
	WherePredicateStep,
	OrStep,
	AndStep,
	SimplePathStep,
	ConnectiveStep,
	CoinStep,
	CyclicPathStep,
	SampleGlobalStep,
	TailGlobalStep
} from '../../step/filter';
import { TraversalMapStep,
	GraphStep,
	VertexStep,
	TraversalFlatMapStep,
	NoOpBarrierStep,
	PropertiesStep,
	AddVertexStep,
	AddEdgeStep,
	AddVertexStartStep,
	DedupLocalStep,
	PathStep,
	OrderGlobalStep,
	OrderLocalStep,
	RangeLocalStep,
	CountGlobalStep,
	CountLocalStep,
	EdgeVertexStep,
	EdgeOtherVertexStep,
	SelectStep,
	SelectOneStep,
	SumGlobalStep,
	SumLocalStep,
	MaxGlobalStep,
	MaxLocalStep,
	MinGlobalStep,
	MinLocalStep,
	LambdaMapStep,
	TreeStep,
	FoldStep,
	GroupStep,
	IdStep,
	LabelStep,
	GroupCountStep,
	PropertyMapStep,
	MatchStep,
	CoalesceStep,
	ConstantStep,
	UnfoldStep,
	MeanGlobalStep,
	MeanLocalStep,
	LambdaCollectingBarrierStep,
	PropertyValueStep,
	PropertyKeyStep,
	ProjectStep,
	SampleLocalStep,
	TailLocalStep
} from '../../step/map';
import { IdentityStep,
	AddPropertyStep,
	StartStep,
	LambdaSideEffectStep,
	TraversalSideEffectStep,
	TreeSideEffectStep,
	GroupSideEffectStep,
	GroupCountSideEffectStep,
	SubgraphStep,
	SideEffectCapStep,
	AggregateStep,
	InjectStep,
	ProfileSideEffectStep,
	StoreStep
} from '../../step/sideEffects';
import { RepeatStep, UnionStep, OptionalStep, ChooseStep, LocalStep } from '../../step/branch';
import ColumnTraversal from '../../lambda/ColumnTraversal';
import LoopTraversal from '../../lambda/LoopTraversal';
import TrueTraversal from '../../lambda/TrueTraversal';
import FunctionTraverser from '../../lambda/FunctionTraverser';
import PredicateTraverser from '../../lambda/PredicateTraverser';
import Vertex from '../../../../structure/Vertex';
import Edge from '../../../../structure/Edge';
import Direction from '../../../../structure/Direction';
import Column from '../../../../structure/Column';
import PropertyType from '../../../../structure/PropertyType';
import VertexProperty from '../../../../structure/VertexProperty';
import HasContainer from '../../step/util/HasContainer';
import P from '../../P';
import AndP from '../../util/AndP';
import OrP from '../../util/OrP';
import Pop from '../../Pop';
import T from '../../../../structure/T';
import Scope from '../../Scope';


/**
 * GraphTraversal
 */
function GraphTraversal() {
	Traversal.call(this);
}

GraphTraversal.prototype = {
	constructor: GraphTraversal,
	/**
	 *
	 * @returns {GraphTraversal}
	 */
	asAdmin() {
		return this;
	},

	///////////////////// MAP STEPS /////////////////////

	/**
	 * Map a {@link Traverser} referencing an object of type <code>E</code> to an object of type <code>E2</code>.
	 *
	 * @param mapTraversal the traversal expression that does the functional mapping
	 * @return the traversal with an appended {@link LambdaMapStep}.
	 *
	 */
	map(param) {
		if (param.asAdmin) {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.map, param);
			return Traversal.prototype.addStep.call(this, new TraversalMapStep(this.asAdmin(), param));
		} else {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.map, param);
			return Traversal.prototype.addStep.call(this, new LambdaMapStep(this.asAdmin(), param));
		}
	},

	/**
	 * A {@code V} step is usually used to start a traversal but it may also be used mid-traversal.
	 *
	 * @param vertexIdsOrElements vertices to inject into the traversal
	 * @return the traversal with an appended {@link GraphStep}
	 */
	V(...vertexIdsOrElements) {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.V,...vertexIdsOrElements);
		return Traversal.prototype.addStep.call(this, new GraphStep(this.asAdmin(), Vertex, false, vertexIdsOrElements));
	},

	/**
	 * Map a {@link Traverser} referencing an object of type <code>E</code> to an iterator of objects of type <code>E2</code>.
	 * The internal traversal is drained one-by-one before a new <code>E</code> object is pulled in for processing.
	 *
	 * @param flatMapTraversal the traversal generating objects of type <code>E2</code>
	 * @param <E2>             the end type of the internal traversal
	 * @return the traversal with an appended {@link TraversalFlatMapStep}.
	 */
	flatMap(flatMapTraversal) {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.flatMap, flatMapTraversal);
		return Traversal.prototype.addStep.call(this, new TraversalFlatMapStep(this.asAdmin(), flatMapTraversal));
	},

	/**
	 * Map the {@link Element} to its {@link Element#id}.
	 *
	 * @return the traversal with an appended {@link IdStep}.
	 */
	id() {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.id);
		return Traversal.prototype.addStep.call(this, new IdStep(this.asAdmin()));
	},

	/**
	 * Map the {@link Element} to its {@link Element#label}.
	 *
	 * @return the traversal with an appended {@link LabelStep}.
	 * @since 3.0.0-incubating
	 * @see <a href="http://tinkerpop.apache.org/docs/${project.version}/reference/#label-step" target="_blank">Reference Documentation - Label Step</a>
	 */
	label() {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.label);
		return Traversal.prototype.addStep.call(this, new LabelStep(this.asAdmin()));
	},

	/**
	 * Map the <code>E</code> object to itself. In other words, a "no op."
	 *
	 * @return the traversal with an appended {@link IdentityStep}.
	 */
	identity() {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.identity);
		return Traversal.prototype.addStep.call(this, new IdentityStep(this.asAdmin()));
	},

	/**
	 * Map any object to a fixed <code>E</code> value.
	 *
	 * @return the traversal with an appended {@link ConstantStep}.
	 */
	constant(e) {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.constant, e);
		return Traversal.prototype.addStep.call(this, new ConstantStep(this.asAdmin(), e));
	},

	/**
	 * Map the {@link Vertex} to its outgoing adjacent vertices given the edge labels.
	 *
	 * @param edgeLabels the edge labels to traverse
	 * @return the traversal with an appended {@link VertexStep}.
	 */
	out(...edgeLabels) {
  console.log(111, edgeLabels);
		edgeLabels = ArrayUtils.checkArray(edgeLabels);
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.out, edgeLabels);
		return Traversal.prototype.addStep.call(this, new VertexStep(this.asAdmin(), Vertex, Direction.OUT, edgeLabels));
	},

	/**
	 * Map the {@link Vertex} to its incoming adjacent vertices given the edge labels.
	 *
	 * @param edgeLabels the edge labels to traverse
	 * @return the traversal with an appended {@link VertexStep}.
	 */
	in(...edgeLabels) {
		edgeLabels = ArrayUtils.checkArray(edgeLabels);
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.in, edgeLabels);
		return Traversal.prototype.addStep.call(this, new VertexStep(this.asAdmin(), Vertex, Direction.IN, edgeLabels));
	},

	/**
	 * Map the {@link Vertex} to its adjacent vertices given the edge labels.
	 *
	 * @param edgeLabels the edge labels to traverse
	 * @return the traversal with an appended {@link VertexStep}.
	 */
	both(...edgeLabels) {
		edgeLabels = ArrayUtils.checkArray(edgeLabels);
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.both, edgeLabels);
		return Traversal.prototype.addStep.call(this, new VertexStep(this.asAdmin(), Vertex, Direction.BOTH, edgeLabels));
	},

	/**
	 * Map the {@link Vertex} to its outgoing incident edges given the edge labels.
	 *
	 * @param edgeLabels the edge labels to traverse
	 * @return the traversal with an appended {@link VertexStep}.
	 */
	outE(...edgeLabels) {
		edgeLabels = ArrayUtils.checkArray(edgeLabels);
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.outE, edgeLabels);
		return Traversal.prototype.addStep.call(this, new VertexStep(this.asAdmin(), Edge, Direction.OUT, edgeLabels));
	},

	/**
	 * Map the {@link Vertex} to its incoming incident edges given the edge labels.
	 *
	 * @param edgeLabels the edge labels to traverse
	 * @return the traversal with an appended {@link VertexStep}.
	 */
	inE(...edgeLabels) {
		edgeLabels = ArrayUtils.checkArray(edgeLabels);
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.inE, edgeLabels);
		return Traversal.prototype.addStep.call(this, new VertexStep(this.asAdmin(), Edge, Direction.IN, edgeLabels));
	},

	/**
	 * Map the {@link Vertex} to its incident edges given the edge labels.
	 *
	 * @param edgeLabels the edge labels to traverse
	 * @return the traversal with an appended {@link VertexStep}.
	 */
	bothE(...edgeLabels) {
		edgeLabels = ArrayUtils.checkArray(edgeLabels);
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.bothE, edgeLabels);
		return Traversal.prototype.addStep.call(this, new VertexStep(this.asAdmin(), Edge, Direction.BOTH, edgeLabels));
	},

	/**
	 * Map the {@link Edge} to its incoming/head incident {@link Vertex}.
	 *
	 * @return the traversal with an appended {@link EdgeVertexStep}.
	 */
	inV() {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.inV);
		return Traversal.prototype.addStep.call(this, new EdgeVertexStep(this.asAdmin(), Direction.IN));
	},

	/**
	 * Map the {@link Edge} to its outgoing/tail incident {@link Vertex}.
	 *
	 * @return the traversal with an appended {@link EdgeVertexStep}.
	 */
	outV() {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.outV);
		return Traversal.prototype.addStep.call(this, new EdgeVertexStep(this.asAdmin(), Direction.OUT));
	},

	/**
	 * Map the {@link Edge} to its incident vertices.
	 *
	 * @return the traversal with an appended {@link EdgeVertexStep}.
	 */
	bothV() {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.bothV);
		return Traversal.prototype.addStep.call(this, new EdgeVertexStep(this.asAdmin(), Direction.BOTH));
	},

	/**
	 * Map the {@link Edge} to the incident vertex that was not just traversed from in the path history.
	 *
	 * @return the traversal with an appended {@link EdgeOtherVertexStep}.
	 */
	otherV() {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.otherV);
		return Traversal.prototype.addStep.call(this, new EdgeOtherVertexStep(this.asAdmin()));
	},

	/**
	 * Map the <code>E</code> object to itself. In other words, a "no op."
	 *
	 * @return the traversal with an appended {@link IdentityStep}.
	 */
	identity() {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.identity);
		return Traversal.prototype.addStep.call(this, new IdentityStep(this.asAdmin()));
	},

	/**
	 * Map the {@link Element} to the values of the associated properties given the provide property keys.
	 * If no property keys are provided, then all property values are emitted.
	 *
	 * @param propertyKeys the properties to retrieve their value from
	 * @param <E2>         the value type of the properties
	 * @return the traversal with an appended {@link PropertiesStep}.
	 */
	values(...propertyKeys) {
		propertyKeys = ArrayUtils.checkArray(propertyKeys);
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.values, propertyKeys);
		return Traversal.prototype.addStep.call(this, new PropertiesStep(this.asAdmin(), PropertyType.VALUE, propertyKeys));
	},

	/**
	 * Projects the current object in the stream into a {@code Map} that is keyed by the provided labels.
	 *
	 * @return the traversal with an appended {@link ProjectStep}
	 */
	project(projectKey, ...otherProjectKeys) {
		otherProjectKeys = ArrayUtils.checkArray(otherProjectKeys);
		const projectKeys = [projectKey].concat(otherProjectKeys);

		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.project, projectKey, otherProjectKeys);
		return Traversal.prototype.addStep.call(this, new ProjectStep(this.asAdmin(), projectKeys));
	},

	/**
	 * Map the {@link Traverser} to a {@link Map} projection of sideEffect values, map values, and/or path values.
	 *
	 * @param pop/column      if there are multiple objects referenced in the path, the {@link Pop} to use.
	 * @param selectKey1      the first key to project
	 * @param selectKey2      the second key to project
	 * @param otherSelectKeys the third+ keys to project
	 * @param <E2>            the type of the objects projected
	 * @return the traversal with an appended {@link SelectStep}.
	 */
	select(...params){
		let type;
		params = ArrayUtils.checkArray(params);
		if (params.length === 1) {
			if (Column.has(params[0])) {
				type = Methods.select.COLUMN;
			} else {
				type = Methods.select.KEY;
			}
		} else {
			if (Pop.contains(params[0])) {
				if (params.length === 2) {
					type = Methods.select.POP_KEY;
				} else {
					type = Methods.select.POP_KEY_KEY_KEYS;
				}
			} else if (typeof params[0] === 'string' && typeof params[1] === 'string') {
				type = Methods.select.KEY_KEY_KEYS;
			}
		}
		if (type) {
			return this.applySelect(type, params);
		}
		throw ("Wrong arguments");
	},

	applySelect(type, params){
		let column;
		let pop;
		let selectKey;
		let selectKey1;
		let selectKey2;
		let otherSelectKeys;
		let selectKeys = [];
		switch (type) {
			case Methods.select.COLUMN:
				column = params[0];
				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.select, column);
				return Traversal.prototype.addStep.call(this, new TraversalMapStep(this.asAdmin(), new ColumnTraversal(column)));
			case Methods.select.KEY:
				selectKey = params[0];
				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.select, selectKey);
				return Traversal.prototype.addStep.call(this, new SelectOneStep(this.asAdmin(), Pop.last, selectKey));
			case Methods.select.POP_KEY:
				pop = params[0];
				selectKey = params[1];
				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.select, pop, selectKey);
				return Traversal.prototype.addStep.call(this, new SelectOneStep(this.asAdmin(), pop, selectKey));
			case Methods.select.POP_KEY_KEY_KEYS:
				pop = params[0];
				selectKey1 = params[1];
				selectKey2 = params[2];
				otherSelectKeys = params.slice(3, params.length);
				selectKeys.push(selectKey1, selectKey2);
				selectKeys = selectKeys.concat(otherSelectKeys);
				otherSelectKeys.splice(0, 0, pop, selectKey1, selectKey2)
				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.select, otherSelectKeys);
				return Traversal.prototype.addStep.call(this, new SelectStep(this.asAdmin(), pop, selectKeys));
			case Methods.select.KEY_KEY_KEYS:
				selectKey1 = params[0];
				selectKey2 = params[1];
				otherSelectKeys = params.slice(2, params.length);
				selectKeys.push(selectKey1, selectKey2);
				selectKeys = selectKeys.concat(otherSelectKeys);
				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.select, selectKeys);
				return Traversal.prototype.addStep.call(this, new SelectStep(this.asAdmin(), Pop.last, selectKeys));
			default:
		}
	},

	/**
	 * Unrolls a {@code Iterator}, {@code Iterable} or {@code Map} into a linear form or simply emits the object if it
	 * is not one of those types.
	 *
	 * @return the traversal with an appended {@link UnfoldStep}
	 */
	unfold() {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.unfold);
		return Traversal.prototype.addStep.call(this, new UnfoldStep(this.asAdmin()));
	},

	/**
	 * Rolls up objects in the stream into an aggregate value as defined by a {@code seed} and {@code BiFunction}.
	 *
	 * @param seed the value to provide as the first argument to the {@code foldFunction}
	 * @param foldFunction the function to fold by where the first argument is the {@code seed} or the value returned from subsequent calss and
	 *                     the second argument is the value from the stream
	 * @return the traversal with an appended {@link FoldStep}
	 */
	fold(seed, foldFunction) {
		if (seed !== undefined) {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.fold, seed, foldFunction);
			return Traversal.prototype.addStep.call(this,
				new FoldStep(this.asAdmin(), new ConstantSupplier(seed), foldFunction)); // TODO: User should provide supplier?
		} else {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.fold);
			return Traversal.prototype.addStep.call(this, new FoldStep(this.asAdmin()));
		}

	},

	/**
	 * Map the {@link Element} to a {@link Map} of the property values key'd according to their {@link Property#key}.
	 * If no property keys are provided, then all property values are retrieved.
	 *
	 * @param <E2>          the value type of the returned properties
	 * @return the traversal with an appended {@link PropertyMapStep}.
	 */
	valueMap(...params) {
		params = ArrayUtils.checkArray(params);
		if (typeof params[0] === 'boolean') {
			const includeTokens = params.splice(0, 1)[0];
			const propertyKeys = params;
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.valueMap, includeTokens, propertyKeys);
			return Traversal.prototype.addStep.call(this,
				new PropertyMapStep(this.asAdmin(), includeTokens, PropertyType.VALUE, propertyKeys));
		} else {
			const propertyKeys = params;
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.valueMap, propertyKeys);
			return Traversal.prototype.addStep.call(this,
				new PropertyMapStep(this.asAdmin(), false, PropertyType.VALUE, propertyKeys));
		}
	},

	/**
	 * Map the {@link Traverser} to its {@link Path} history via {@link Traverser#path}.
	 *
	 * @return the traversal with an appended {@link PathStep}.
	 */
	path() {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.path);
		return Traversal.prototype.addStep.call(this, new PathStep(this.asAdmin()));
	},

	/**
	 * Map the {@link Property} to its {@link Property#key}.
	 *
	 * @return the traversal with an appended {@link PropertyKeyStep}.
	 */
	key() {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.key);
		return Traversal.prototype.addStep.call(this, new PropertyKeyStep(this.asAdmin()));
	},

	/**
	 * Map the {@link Property} to its {@link Property#value}.
	 *
	 * @return the traversal with an appended {@link PropertyValueStep}.
	 */
	value() {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.value);
		return Traversal.prototype.addStep.call(this, new PropertyValueStep(this.asAdmin()));
	},

	/**
	 * Map the {@link Traverser} to a {@link Map} of bindings as specified by the provided match traversals.
	 *
	 * @param matchTraversals the traversal that maintain variables which must hold for the life of the traverser
	 * @param <E2>            the type of the obejcts bound in the variables
	 * @return the traversal with an appended {@link MatchStep}.
	 */
	match(...matchTraversals) {
		matchTraversals = ArrayUtils.checkArray(matchTraversals);
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.match, matchTraversals);
		return Traversal.prototype.addStep.call(this,
			new MatchStep(this.asAdmin(), ConnectiveStep.Connective.AND, matchTraversals));
	},

	/**
	 * Order either the {@link Scope#local} object (e.g. a list, map, etc.) or the entire {@link Scope#global} traversal stream.
	 *
	 * @param scope whether the ordering is the current local object or the entire global stream.
	 * @return the traversal with an appended {@link OrderGlobalStep} or {@link OrderLocalStep} depending on the {@code scope}.
	 */
	order(scope) {
		if (scope !== undefined) {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.order, scope);
			return Traversal.prototype.addStep.call(this, scope === Scope.global
				? new OrderGlobalStep(this.asAdmin()) : new OrderLocalStep(this.asAdmin()));
		} else {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.order);
			return Traversal.prototype.addStep.call(this, new OrderGlobalStep(this.asAdmin()));
		}
	},

	/**
	 * Map the {@link Element} to its associated properties given the provide property keys.
	 * If no property keys are provided, then all properties are emitted.
	 *
	 * @param propertyKeys the properties to retrieve
	 * @param <E2>         the value type of the returned properties
	 * @return the traversal with an appended {@link PropertiesStep}.
	 */
	properties(...propertyKeys) {
		propertyKeys = ArrayUtils.checkArray(propertyKeys);
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.properties, propertyKeys);
		return Traversal.prototype.addStep.call(this, new PropertiesStep(this.asAdmin(), PropertyType.PROPERTY, propertyKeys));
	},

	/**
	 * Map the traversal stream to its reduction as a sum of the {@link Traverser#bulk} values given the specified
	 * {@link Scope} (i.e. count the number of traversers up to this point).
	 *
	 * @return the traversal with an appended {@link CountGlobalStep} or {@link CountLocalStep} depending on the {@link Scope}
	 * @since 3.0.0-incubating
	 * @see <a href="http://tinkerpop.apache.org/docs/${project.version}/reference/#count-step" target="_blank">Reference Documentation - Count Step</a>
	 */
	count(scope) {
		if (scope !== undefined) {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.count, scope);
			return Traversal.prototype.addStep.call(this,
				scope === Scope.global ? new CountGlobalStep(this.asAdmin()) : new CountLocalStep(this.asAdmin())
			);
		} else {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.count);
			return Traversal.prototype.addStep.call(this, new CountGlobalStep(this.asAdmin()));
		}
	},

	/**
	 * Map the traversal stream to its reduction as a sum of the {@link Traverser#get} values multiplied by their
	 * {@link Traverser#bulk} given the specified {@link Scope} (i.e. sum the traverser values up to this point).
	 *
	 * @return the traversal with an appended {@link SumGlobalStep} or {@link SumLocalStep} depending on the {@link Scope}.
	 */
	sum(scope) {
		if (scope !== undefined) {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.sum, scope);
			return Traversal.prototype.addStep.call(this,
				scope === Scope.global ? new SumGlobalStep(this.asAdmin()) : new SumLocalStep(this.asAdmin()));
		} else {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.sum);
			return Traversal.prototype.addStep.call(this, new SumGlobalStep(this.asAdmin()));
		}
	},

	/**
	 * Determines the largest value in the stream given the {@link Scope}.
	 *
	 * @return the traversal with an appended {@link MaxGlobalStep} or {@link MaxLocalStep} depending on the {@link Scope}
	 */
	max(scope) {
		if (scope !== undefined) {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.max, scope);
			return Traversal.prototype.addStep.call(this,
				scope === Scope.global ? new MaxGlobalStep(this.asAdmin()) : new MaxLocalStep(this.asAdmin()));
		} else {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.max);
			return Traversal.prototype.addStep.call(this, new MaxGlobalStep(this.asAdmin()));
		}
	},

	/**
	 * Determines the smallest value in the stream given the {@link Scope}.
	 *
	 * @return the traversal with an appended {@link MinGlobalStep} or {@link MinLocalStep} depending on the {@link Scope}
	 */
	min(scope) {
		if (!isNull(scope)) {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.min, scope);
			return Traversal.prototype.addStep.call(this,
				scope === Scope.global ? new MinGlobalStep(this.asAdmin()) : new MinLocalStep(this.asAdmin()));
		} else {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.min);
			return Traversal.prototype.addStep.call(this, new MinGlobalStep(this.asAdmin()));
		}
	},

	/**
	 * Determines the mean value in the stream given the {@link Scope}.
	 *
	 * @return the traversal with an appended {@link MeanGlobalStep} or {@link MeanLocalStep} depending on the {@link Scope}
	 */
	mean(scope) {
		if (!isNull(scope)) {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.mean, scope);
			return Traversal.prototype.addStep.call(this,
				scope === Scope.global) ? new MeanGlobalStep(this.asAdmin()) : new MeanLocalStep(this.asAdmin());
		} else {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.mean);
			return Traversal.prototype.addStep.call(this, new MeanGlobalStep(this.asAdmin()));
		}
	},

	///////////////////// FILTER STEPS /////////////////////

	/**
	 * Map the {@link Traverser} to either {@code true} or {@code false}, where {@code false} will not pass the
	 * traverser to the next step.
	 *
	 * @param param the filter function to apply
	 * @return the traversal with the {@link LambdaFilterStep || TraversalFilterStep} added
	 */
	filter(param) {
		if (param.graph) {
			const filterTraversal = param;
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.filter, filterTraversal);
			//console.log('filter', param)
			return Traversal.prototype.addStep.call(this, new TraversalFilterStep(this.asAdmin(), filterTraversal));
		} else {
			const predicate = param;
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.filter, predicate);
			return Traversal.prototype.addStep.call(this, new LambdaFilterStep(this.asAdmin(), predicate));
		}
	},

	/**
	 * Ensures that at least one of the provided traversals yield a result.
	 *
	 * @param orTraversals filter traversals where at least one must be satisfied
	 * @return the traversal with an appended {@link OrStep}
	 */
	or(...orTraversals) {
		orTraversals = ArrayUtils.checkArray(orTraversals);
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.or, orTraversals);
		return Traversal.prototype.addStep.call(this, new OrStep(this.asAdmin(), orTraversals));
	},

	/**
	 * Ensures that all of the provided traversals yield a result.
	 *
	 * @param andTraversals filter traversals that must be satisfied
	 * @return the traversal with an appended {@link AndStep}
	 */
	and(...andTraversals) {
		andTraversals = ArrayUtils.checkArray(andTraversals);
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.and, andTraversals);
		return Traversal.prototype.addStep.call(this, new AndStep(this.asAdmin(), andTraversals));
	},

	/**
	 * Provides a way to add arbitrary objects to a traversal stream.
	 *
	 * @param injections the objects to add to the stream
	 * @return the traversal with an appended {@link InjectStep}
	 *
	 */
	inject(...injections) {
		injections = ArrayUtils.checkArray(injections);
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.inject, injections);
		return Traversal.prototype.addStep.call(this, new InjectStep(this.asAdmin(), injections));
	},

	/**
	 * Filters the current object based on the object itself or the path history.
	 *
	 * @param startKey/predicate/traversal the key containing the object to filter
	 * @param predicate the filter to apply
	 * @return the traversal with an appended {@link WherePredicateStep}
	 */
	where() {
		if (arguments.length === 2) {
			const startKey = arguments[0];
			const predicate = arguments[1];
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.where, startKey, predicate);
			return Traversal.prototype.addStep.call(this,
				new WherePredicateStep(this.asAdmin(), startKey, predicate));
		} else if (arguments.length === 1) {
			if (arguments[0].asAdmin) {
				const whereTraversal = arguments[0];

				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.where, whereTraversal);
				return TraversalHelper.getVariableLocations(whereTraversal.asAdmin()).isEmpty() ?
					Traversal.prototype.addStep.call(this, new TraversalFilterStep(this.asAdmin(), whereTraversal)) :
					Traversal.prototype.addStep.call(this, new WhereTraversalStep(this.asAdmin(), whereTraversal));
			} else {
				const predicate = arguments[0];
				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.where, predicate);
				return Traversal.prototype.addStep.call(this, new WherePredicateStep(this.asAdmin(), undefined, predicate));
			}
		}
	},

	/**
	 * Filters vertices, edges and vertex properties based on their properties.
	 *
	 * @param propertyKey the key of the property to filter on
	 * @param value the value to compare the property value to for equality
	 * @return the traversal with an appended {@link HasStep}
	 */
	has(...params) {
		let type;
		params = ArrayUtils.checkArray(params);
		if (params.length === 1) {
			type = Methods.has.KEY;
		} else if (params.length === 2) {
			let propertyKey = params[0];
			let value = params[1];
			if (value instanceof P || value instanceof AndP || value instanceof OrP) {
				if (T.contains(propertyKey)) {
					type = Methods.has.ACCESSOR_PREDICATE;
				} else {
					type = Methods.has.KEY_PREDICATE;
				}
			} else if (value.asAdmin) {
				if (T.contains(propertyKey)) {
					type = Methods.has.ACCESSOR_TRAVERSAL;
				} else {
					type = Methods.has.KEY_TRAVERSAL;
				}
			} else {
				if (T.contains(propertyKey)) {
					type = Methods.has.ACCESSOR_VALUE;
				} else {
					type = Methods.has.KEY_VALUE;
				}
			}
		} else if (params.length === 3) {
			let value = params[2];
			if (value instanceof P || value instanceof AndP || value instanceof OrP) {
				type = Methods.has.LABEL_PROPERTY_PREDICATE;
			} else {
				type = Methods.has.LABEL_PROPERTY_VALUE;
			}
		}

		return this.applyHas(type, params);
	},

	applyHas(type, params){
		switch (type) {
			case Methods.has.KEY_VALUE:
				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.has, params[0], params[1]);
				return TraversalHelper.addHasContainer(this.asAdmin(), new HasContainer(params[0], P.eq(params[1])));
			case Methods.has.KEY_PREDICATE:
				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.has, params[0], params[1]);
				return TraversalHelper.addHasContainer(this.asAdmin(), new HasContainer(params[0], params[1]));
			case Methods.has.ACCESSOR_PREDICATE:
				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.has, params[0], params[1]);
				return TraversalHelper.addHasContainer(this.asAdmin(), new HasContainer(params[0].getAccessor(), params[1]));
			case Methods.has.ACCESSOR_VALUE:
				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.has, params[0], params[1]);
				return TraversalHelper.addHasContainer(this.asAdmin(), new HasContainer(params[0].getAccessor(), P.eq(params[1])));
			case Methods.has.LABEL_PROPERTY_VALUE:
				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.has, params[0], params[1], params[2]);
				TraversalHelper.addHasContainer(this.asAdmin(), new HasContainer(T.label.getAccessor(), P.eq(params[0])));
				return TraversalHelper.addHasContainer(
					this.asAdmin(),
					new HasContainer(params[1], (params[2] instanceof P || params[2] instanceof AndP || params[2] instanceof OrP)
						? params[2] : P.eq(params[2])));
			case Methods.has.LABEL_PROPERTY_PREDICATE:
				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.has, params[0], params[1], params[2]);
				TraversalHelper.addHasContainer(this.asAdmin(), new HasContainer(T.label.getAccessor(), P.eq(params[0])));
				return TraversalHelper.addHasContainer(this.asAdmin(), new HasContainer(params[1], params[2]));
			case Methods.has.ACCESSOR_TRAVERSAL:
				// need to implement strategies (AdjacentToIncidentStrategy),
				// because this method should use TraversalHelper.replaceStep()
				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.has, params[0], params[1]);
				return Traversal.prototype.addStep.call(this,
					new TraversalFilterStep(this.asAdmin(), params[1].asAdmin().addStep(
						new PropertiesStep(params[1].asAdmin(), PropertyType.VALUE, params[0].getAccessor()),
						0)));
			case Methods.has.KEY_TRAVERSAL:
				// need to implement strategies (AdjacentToIncidentStrategy),
				// because this method should use TraversalHelper.replaceStep()
				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.has, params[0], params[1]);
				return Traversal.prototype.addStep.call(this,
					new TraversalFilterStep(this.asAdmin(), params[1].asAdmin().addStep(
						new PropertiesStep(params[1].asAdmin(), PropertyType.VALUE, params[0]),
						0)));
			case Methods.has.KEY:
				// need to implement strategies (AdjacentToIncidentStrategy),
				// because this method should use TraversalHelper.replaceStep()
				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.has, params[0]);
				return Traversal.prototype.addStep.call(this, new TraversalFilterStep(this.asAdmin(), __.values(params[0])));
			default:
		}
	},

	/**
	 * Filters vertices, edges and vertex properties based on their label.
	 *
	 * @param label the label of the {@link Element}
	 * @param otherLabels additional labels of the {@link Element}
	 * @return the traversal with an appended {@link HasStep}
	 */
	hasLabel(label, ...otherLabels) {
		if (label instanceof P || label instanceof AndP || label instanceof OrP) {
			const predicate = label;
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.hasLabel, predicate);
			return TraversalHelper.addHasContainer(this.asAdmin(), new HasContainer(T.label.getAccessor(), predicate));
		} else {
			otherLabels = ArrayUtils.checkArray(otherLabels);
			const labels = [label].concat(otherLabels);

			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.hasLabel, labels);
			return TraversalHelper.addHasContainer(
				this.asAdmin(),
				new HasContainer(T.label.getAccessor(), labels.length == 1 ? P.eq(labels[0]) : P.within(labels)));
		}
	},

	/**
	 * Remove all duplicates in the traversal stream up to this point.
	 *
	 * @param scope       whether the deduplication is on the stream (global) or the current object (local).
	 * @param dedupLabels if labels are provided, then the scope labels determine de-duplication. No labels implies current object.
	 * @return the traversal with an appended {@link DedupGlobalStep}.
	 */
	dedup(scope, ...dedupLabels) {
		dedupLabels = ArrayUtils.checkArray(dedupLabels);
		if (scope in Scope) {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.dedup, scope, dedupLabels);
			return Traversal.prototype.addStep.call(this, scope === Scope.global
				? new DedupGlobalStep(this.asAdmin(), dedupLabels) : new DedupLocalStep(this.asAdmin()));
		} else {
			if (scope) {
				dedupLabels = [scope].concat(dedupLabels);
			}
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.dedup, dedupLabels);
			return Traversal.prototype.addStep.call(this, new DedupGlobalStep(this.asAdmin(), dedupLabels));
		}

	},

	/**
	 * Filter the objects in the traversal by the number of them to pass through the stream as constrained by the
	 * {@link Scope}. Those before the value of {@code low} do not pass through and those that exceed the value of
	 * {@code high} will end the iteration.
	 *
	 * @param scope the scope of how to apply the {@code range}
	 * @param low the number at which to start allowing objects through the stream
	 * @param high the number at which to end the stream
	 * @return the traversal with an appended {@link RangeGlobalStep} or {@link RangeLocalStep} depending on {@code scope}
	 */
	range(scope, low, high) {
		if (high !== undefined) {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.range, scope, low, high);
			return Traversal.prototype.addStep.call(this, scope === Scope.global
				? new RangeGlobalStep(this.asAdmin(), low, high)
				: new RangeLocalStep(this.asAdmin(), low, high));
		} else {
			high = low;
			low = scope;
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.range, low, high);
			return Traversal.prototype.addStep.call(this, new RangeGlobalStep(this.asAdmin(), low, high));
		}
	},

	/**
	 * Filter the objects in the traversal by the number of them to pass through the stream given the {@link Scope},
	 * where only the first {@code n} objects are allowed as defined by the {@code limit} argument.
	 *
	 * @param scope the scope of how to apply the {@code limit}
	 * @param limit the number at which to end the stream
	 * @return the traversal with an appended {@link RangeGlobalStep} or {@link RangeLocalStep} depending on {@code scope}
	 */
	limit(scope, limit) {
		if (limit !== undefined) {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.limit, scope, limit);
			return Traversal.prototype.addStep.call(this, scope === Scope.global
				? new RangeGlobalStep(this.asAdmin(), 0, limit)
				: new RangeLocalStep(this.asAdmin(), 0, limit));
		} else {
			limit = scope;
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.limit, limit);
			return Traversal.prototype.addStep.call(this, new RangeGlobalStep(this.asAdmin(), 0, limit));
		}
	},

	/**
	 * Filter the <code>E</code> object if its {@link Traverser#path} is {@link Path#isSimple}.
	 *
	 * @return the traversal with an appended {@link CyclicPathStep}.
	 */
	cyclicPath() {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.cyclicPath);
		return Traversal.prototype.addStep.call(this, new CyclicPathStep(this.asAdmin()));
	},

	/**
	 * Filter the <code>E</code> object if it is not {@link P#eq} to the provided value.
	 *
	 * @param value the value that the object must equal.
	 * @return the traversal with an appended {@link IsStep}.
	 */
	is(value) {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.is, value);
		return Traversal.prototype.addStep.call(this,
			new IsStep(this.asAdmin(), (value instanceof P || value instanceof AndP || value instanceof OrP) ? value : P.eq(value)));
	},

	/**
	 * Filters the objects in the traversal emitted as being last objects in the stream given the {@link Scope}. In
	 * this case, only the last {@code n} objects will be returned as defined by the {@code limit}.
	 *
	 * @param scope the scope of how to apply the {@code tail}
	 * @param limit the number at which to end the stream
	 * @return the traversal with an appended {@link TailGlobalStep} or {@link TailLocalStep} depending on {@code scope}
	 */
	tail(scope, limit) {
		if(limit){
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.tail, scope, limit);
			return Traversal.prototype.addStep.call(this, scope === Scope.global
				? new TailGlobalStep(this.asAdmin(), limit)
				: new TailLocalStep(this.asAdmin(), limit));
		} else {
			if(!isNull(scope) && isNaN(scope)){
				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.tail, scope);
				return Traversal.prototype.addStep.call(this, scope === Scope.global
					? new TailGlobalStep(this.asAdmin(), 1)
					: new TailLocalStep(this.asAdmin(), 1));
			} else if(!isNull(scope) && !isNaN(scope)){
				limit = scope;
				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.tail, limit);
				return Traversal.prototype.addStep.call(this, new TailGlobalStep(this.asAdmin(), limit));
			} else if(isNull(scope)){
				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.tail);
				return Traversal.prototype.addStep.call(this, new TailGlobalStep(this.asAdmin(), 1));
			} else {
				throw ("Wrong arguments")
			}
		}
	},

	/**
	 * Filter the <code>E</code> object if its {@link Traverser#path} is not {@link Path#isSimple}.
	 *
	 * @return the traversal with an appended {@link SimplePathStep}.
	 */
	simplePath() {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.simplePath);
		return Traversal.prototype.addStep.call(this, new SimplePathStep(this.asAdmin()));
	},

	/**
	 * Removes objects from the traversal stream when the traversal provided as an argument does not return any objects.
	 *
	 * @param notTraversal the traversal to filter by.
	 * @return the traversal with an appended {@link NotStep}.
	 */
	not(notTraversal) {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.not, notTraversal);
		return Traversal.prototype.addStep.call(this, new NotStep(this.asAdmin(), notTraversal));
	},

	/**
	 * Filter the <code>E</code> object given a biased coin toss.
	 *
	 * @param probability the probability that the object will pass through
	 * @return the traversal with an appended {@link CoinStep}.
	 */
	coin(probability) {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.coin, probability);
		return Traversal.prototype.addStep.call(this, new CoinStep(this.asAdmin(), probability));
	},

	/**
	 * Allow some specified number of objects to pass through the stream.
	 *
	 * @param scope the scope of how to apply the {@code sample}
	 * @param amountToSample the number of objects to allow
	 * @return the traversal with an appended {@link SampleGlobalStep} or {@link SampleLocalStep} depending on the {@code scope}
	 */
	sample(scope, amountToSample) {
		if (isNull(amountToSample)) {
			amountToSample = scope;
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.sample, amountToSample);
			return Traversal.prototype.addStep.call(this, new SampleGlobalStep(this.asAdmin(), amountToSample));
		} else {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.sample, scope, amountToSample);
			return Traversal.prototype.addStep.call(this, scope === Scope.global
				? new SampleGlobalStep(this.asAdmin(), amountToSample)
				: new SampleLocalStep(this.asAdmin(), amountToSample));
		}
	},

	/**
	 * Removes elements and properties from the graph. This step is not a terminating, in the sense that it does not
	 * automatically iterate the traversal. It is therefore necessary to do some form of iteration for the removal
	 * to actually take place. In most cases, iteration is best accomplished with {@code g.V().drop().iterate()}.
	 *
	 * @return the traversal with the {@link DropStep} added
	 */
	drop() {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.drop);
		return Traversal.prototype.addStep.call(this, new DropStep(this.asAdmin()));
	},

	///////////////////// SIDE-EFFECT STEPS /////////////////////

	/**
	 * Perform some operation on the {@link Traverser} and pass it to the next step unmodified.
	 *
	 * @param consumer/sideEffectTraversal the operation to perform at this step in relation to the {@link Traverser}
	 * @return the traversal with an appended {@link LambdaSideEffectStep}
	 * @since 3.0.0-incubating
	 * @see <a href="http://tinkerpop.apache.org/docs/${project.version}/reference/#general-steps" target="_blank">Reference Documentation - General Steps</a>
	 */
	sideEffect(param) {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.sideEffect, param);
		if (param.asAdmin) {
			return Traversal.prototype.addStep.call(this, new TraversalSideEffectStep(this.asAdmin(), param));
		} else {
			return Traversal.prototype.addStep.call(this, new LambdaSideEffectStep(this.asAdmin(), param));
		}
	},

	/**
	 * Lazily aggregates objects in the stream into a side-effect collection.
	 *
	 * @param sideEffectKey the name of the side-effect key that will hold the aggregate
	 * @return the traversal with an appended {@link StoreStep}
	 */
	store(sideEffectKey) {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.store, sideEffectKey);
		return Traversal.prototype.addStep.call(this, new StoreStep(this.asAdmin(), sideEffectKey));
	},

	/**
	 * Allows developers to examine statistical information about a traversal providing data like execution times,
	 * counts, etc.
	 *
	 * @param sideEffectKey the name of the side-effect key within which to hold the profile object
	 * @return the traversal with an appended {@link ProfileSideEffectStep}
	 * @since 3.2.0-incubating
	 * @see <a href="http://tinkerpop.apache.org/docs/${project.version}/reference/#profile-step" target="_blank">Reference Documentation - Profile Step</a>
	 */
	profile(sideEffectKey) {
		if (!isNull(sideEffectKey)) {
			this.asAdmin().getBytecode().addStep(Traversal.Symbols.profile, sideEffectKey);
			return Traversal.prototype.addStep.call(this, new ProfileSideEffectStep(this.asAdmin(), sideEffectKey));
		} else {
			this.asAdmin().getBytecode().addStep(Traversal.Symbols.profile);
			Traversal.prototype.addStep.call(this,
				new ProfileSideEffectStep(this, ProfileSideEffectStep.DEFAULT_METRICS_KEY));
			return Traversal.prototype.addStep.call(this,
				new SideEffectCapStep(this, ProfileSideEffectStep.DEFAULT_METRICS_KEY));
		}
	},

	/**
	 * Sets a {@link Property} value and related meta properties if supplied, if supported by the {@link Graph}
	 * and if the {@link Element} is a {@link VertexProperty}.  This method is the long-hand version of
	 * {@link #property(Object, Object, Object...)} with the difference that the
	 * {@link org.apache.tinkerpop.gremlin.structure.VertexProperty.Cardinality} can be supplied.
	 * <p/>
	 * Generally speaking, this method will append an {@link AddPropertyStep} to the {@link Traversal} but when
	 * possible, this method will attempt to fold key/value pairs into an {@link AddVertexStep}, {@link AddEdgeStep} or
	 * {@link AddVertexStartStep}.  This potential optimization can only happen if cardinality is not supplied
	 * and when meta-properties are not included.
	 *
	 * @param cardinality the specified cardinality of the property where {@code null} will allow the {@link Graph}
	 *                    to use its default settings
	 * @param key         the key for the property
	 * @param value       the value for the property
	 * @param keyValues   any meta properties to be assigned to this property
	 * @return the traversal with the last step modified to add a property
	 */
	property(cardinality, key, value, ...keyValues) {
		let keyProperty = key;
		let valueProperty = value;
		let cardinalityProperty = cardinality;
		if (VertexProperty.Cardinality.contains(cardinality)) {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.property, cardinality, key, value, ArrayUtils.checkArray(keyValues));
		} else {
			cardinalityProperty = null;
			keyProperty = cardinality;
			valueProperty = key;
			if (value) {
				keyValues = [value].concat(ArrayUtils.checkArray(keyValues));
			} else {
				keyValues = ArrayUtils.checkArray(keyValues);
			}
			if (keyValues.length > 0) {
				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.property, keyProperty, valueProperty, keyValues);
			} else {
				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.property, keyProperty, valueProperty);
			}
		}

		// if it can be detected that this call to property() is related to an addV/E() then we can attempt to fold
		// the properties into that step to gain an optimization for those graphs that support such capabilities.
		if ((this.asAdmin().getEndStep() instanceof AddVertexStep || this.asAdmin().getEndStep() instanceof AddEdgeStep
			|| this.asAdmin().getEndStep() instanceof AddVertexStartStep)
			&& keyValues.length === 0 && isNull(cardinalityProperty)) {
			this.asAdmin().getEndStep().addPropertyMutations(keyProperty, valueProperty);
		} else {
			Traversal.prototype.addStep.call(this,
				new AddPropertyStep(this.asAdmin(), cardinalityProperty, keyProperty, valueProperty));
			this.asAdmin().getEndStep().addPropertyMutations(keyValues);
		}
		return this;
	},

	/**
	 * Iterates the traversal up to the itself and emits the side-effect referenced by the key. If multiple keys are
	 * supplied then the side-effects are emitted as a {@code Map}.
	 *
	 * @param sideEffectKey the side-effect to emit
	 * @param sideEffectKeys other side-effects to emit
	 * @return the traversal with an appended {@link SideEffectCapStep}
	 */
	cap(sideEffectKey, ...sideEffectKeys) {
		sideEffectKeys = ArrayUtils.checkArray(sideEffectKeys)
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.cap, sideEffectKey, sideEffectKeys);
		return Traversal.prototype.addStep.call(this,
			new SideEffectCapStep(this.asAdmin(), sideEffectKey, sideEffectKeys));
	},

	/**
	 * Extracts a portion of the graph being traversed into a {@link Graph} object held in the specified side-effect
	 * key.
	 *
	 * @param sideEffectKey the name of the side-effect key that will hold the subgraph
	 * @return the traversal with an appended {@link SubgraphStep}
	 */
	subgraph(sideEffectKey) {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.subgraph, sideEffectKey);
		return Traversal.prototype.addStep.call(this, new SubgraphStep(this.asAdmin(), sideEffectKey));
	},

	/**
	 * Eagerly collects objects up to this step into a side-effect.
	 *
	 * @param sideEffectKey the name of the side-effect key that will hold the aggregated objects
	 * @return the traversal with an appended {@link AggregateStep}
	 */
	aggregate(sideEffectKey) {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.aggregate, sideEffectKey);
		return Traversal.prototype.addStep.call(this, new AggregateStep(this.asAdmin(), sideEffectKey));
	},

	/**
	 * Organize objects in the stream into a {@code Map}. Calls to {@code group()} are typically accompanied with
	 * {@link #by()} modulators which help specify how the grouping should occur.
	 *
	 * @param sideEffectKey the name of the side-effect key that will hold the aggregated grouping
	 * @return the traversal with an appended {@link GroupStep}.
	 */
	group(sideEffectKey) {
		if (sideEffectKey !== undefined) {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.group, sideEffectKey);
			return Traversal.prototype.addStep.call(this, new GroupSideEffectStep(this.asAdmin(), sideEffectKey));
		} else {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.group);
			return Traversal.prototype.addStep.call(this, new GroupStep(this.asAdmin()));
		}
	},

	/**
	 * Counts the number of times a particular objects has been part of a traversal, returning a {@code Map} where the
	 * object is the key and the value is the count.
	 *
	 * @param sideEffectKey the name of the side-effect key that will hold the aggregated grouping
	 * @return the traversal with an appended {@link GroupCountStep}.
	 */
	groupCount(sideEffectKey) {
		if (sideEffectKey !== undefined) {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.groupCount, sideEffectKey);
			return Traversal.prototype.addStep.call(this, new GroupCountSideEffectStep(this.asAdmin(), sideEffectKey));
		} else {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.groupCount);
			return Traversal.prototype.addStep.call(this, new GroupCountStep(this.asAdmin()));
		}
	},

	/**
	 * Aggregates the emanating paths into a {@link Tree} data structure.
	 *
	 * @param sideEffectKey the name of the side-effect key that will hold the tree
	 * @return the traversal with an appended {@link TreeStep}
	 */
	tree(sideEffectKey) {
		if (sideEffectKey !== undefined) {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.tree, sideEffectKey);
			return Traversal.prototype.addStep.call(this, new TreeSideEffectStep(this.asAdmin(), sideEffectKey));
		} else {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.tree);
			return Traversal.prototype.addStep.call(this, new TreeStep(this.asAdmin()));
		}
	},

	/**
	 * Adds a {@link Vertex}.
	 *
	 * @param vertexLabel the label of the {@link Vertex} to add
	 * @return the traversal with the {@link AddVertexStep} added
	 */
	addV(vertexLabel) {
		if (isNull(vertexLabel)) {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.addV);
			return Traversal.prototype.addStep.call(this, new AddVertexStep(this.asAdmin(), null));
		} else {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.addV, vertexLabel);
			return Traversal.prototype.addStep.call(this, new AddVertexStep(this.asAdmin(), vertexLabel));
		}
	},

	/**
	 * Adds an {@link Edge} with the specified edge label.
	 *
	 * @param edgeLabel the label of the newly added edge
	 * @return the traversal with the {@link AddEdgeStep} added
	 */
	addE(edgeLabel) {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.addE, edgeLabel);
		return Traversal.prototype.addStep.call(this, new AddEdgeStep(this.asAdmin(), edgeLabel));
	},

	/**
	 * When used as a modifier to {@link #addE(String)} this method specifies the step label to use for selecting the
	 * incoming vertex of the newly added {@link Edge}.
	 *
	 * @param toStepLabel the step label of the incoming vertex
	 * @return the traversal with the modified {@link AddEdgeStep}
	 */
	to(toStepLabel) {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.to, toStepLabel);
		if (typeof toStepLabel === 'string') {
			this.asAdmin().getEndStep().addTo(__.select(toStepLabel));
		} else {
			const toVertex = toStepLabel
			this.asAdmin().getEndStep().addTo(toVertex);
		}

		return this;
	},

	/**
	 * When used as a modifier to {@link #addE(String)} this method specifies the step label to use for selecting the
	 * outgoing vertex of the newly added {@link Edge}.
	 *
	 * @param fromStepLabel the step label of the outgoing vertex
	 * @return the traversal with the modified {@link AddEdgeStep}
	 */
	from(fromStepLabel) {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.from, fromStepLabel);
		if (typeof fromStepLabel === 'string') {
			this.asAdmin().getEndStep().addFrom(__.select(fromStepLabel));
		} else {
			const fromVertex = fromStepLabel;
			this.asAdmin().getEndStep().addFrom(fromVertex);
		}

		return this;
	},

	///////////////////// BRANCH STEPS /////////////////////
	/**
	 * Routes the current traverser to a particular traversal branch option which allows the creation of if-then-else
	 * like semantics within a traversal. A {@code choose} is modified by {@link #option} which provides the various
	 * branch choices.
	 *
	 * @param choiceTraversal the traversal used to determine the value for the branch
	 * @return the traversal with the appended {@link ChooseStep}
	 */
	choose(...params) {
		let type;
		if (params.length === 1) {
			type = params[0].asAdmin ? Methods.choose.TRAVERSAL : Methods.choose.FUNCTION;
		} else if (params.length === 2) {
			type = params[1].asAdmin ? Methods.choose.TRAVERSAL_TRAVERSAL : Methods.choose.PREDICATE_TRAVERSAL;
		} else if (params.length === 3) {
			type = params[2].asAdmin
				? Methods.choose.TRAVERSAL_TRAVERSAL_TRAVERSAL : Methods.choose.PREDICATE_TRAVERSAL_TRAVERSAL;
		}
		if (!isNull(type))
			return this.applyChoose(type, params);
		else
			throw ("Wrong arguments");

	},

	applyChoose(type, params) {
		let choiceFunction;
		let choosePredicate;
		let trueChoice;
		let falseChoice;
		let choiceTraversal;
		let traversalPredicate;
		switch (type) {
			case Methods.choose.FUNCTION:
				choiceFunction = params[0];
				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.choose, choiceFunction);
				return Traversal.prototype.addStep.call(this,
					new ChooseStep(this, __.map(new FunctionTraverser(choiceFunction))));
			case Methods.choose.PREDICATE_TRAVERSAL:
				choosePredicate = params[0];
				trueChoice = params[1];
				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.choose, choosePredicate, trueChoice);
				return Traversal.prototype.addStep.call(this,
					new ChooseStep(this, __.filter(new PredicateTraverser(choosePredicate)), trueChoice, __.identity()));
			case Methods.choose.PREDICATE_TRAVERSAL_TRAVERSAL:
				choosePredicate = params[0];
				trueChoice = params[1];
				falseChoice = params[2];
				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.choose, choosePredicate, trueChoice, falseChoice);
				return Traversal.prototype.addStep.call(this,
					new ChooseStep(this, __.filter(new PredicateTraverser(choosePredicate)), trueChoice, falseChoice));
			case Methods.choose.TRAVERSAL:
				choiceTraversal = params[0];
				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.choose, choiceTraversal);
				return Traversal.prototype.addStep.call(this, new ChooseStep(this.asAdmin(), choiceTraversal));
			case Methods.choose.TRAVERSAL_TRAVERSAL:
				traversalPredicate = params[0];
				trueChoice = params[1];
				this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.choose, traversalPredicate, trueChoice);
				return Traversal.prototype.addStep.call(this,
					new ChooseStep(this, traversalPredicate, trueChoice, __.identity()));
			case Methods.choose.TRAVERSAL_TRAVERSAL_TRAVERSAL:
				traversalPredicate = params[0];
				trueChoice = params[1];
				falseChoice = params[2];
				this.asAdmin().getBytecode().addStep(
					GraphTraversal.Symbols.choose, traversalPredicate, trueChoice, falseChoice);
				return Traversal.prototype.addStep.call(this,
					new ChooseStep(this, traversalPredicate, trueChoice, falseChoice));
			default:
		}
	},

	/**
	 * Returns the result of the specified traversal if it yields a result, otherwise it returns the calling element.
	 *
	 * @param optionalTraversal the traversal to execute for a potential result
	 * @return the traversal with the appended {@link ChooseStep}
	 */
	optional(optionalTraversal) {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.optional, optionalTraversal);
		return Traversal.prototype.addStep.call(this, new OptionalStep(this.asAdmin(), optionalTraversal));
	},

	/**
	 * Merges the results of an arbitrary number of traversals.
	 *
	 * @param unionTraversals the traversals to merge
	 * @return the traversal with the appended {@link UnionStep}
	 */
	union(...unionTraversals) {
		unionTraversals = ArrayUtils.checkArray(unionTraversals);
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.union, unionTraversals);
		return Traversal.prototype.addStep.call(this, new UnionStep(this.asAdmin(), unionTraversals));
	},

	/**
	 * Evaluates the provided traversals and returns the result of the first traversal to emit at least one object.
	 *
	 * @param coalesceTraversals the traversals to coalesce
	 * @return the traversal with the appended {@link CoalesceStep}
	 */
	coalesce(...coalesceTraversals) {
		coalesceTraversals = ArrayUtils.checkArray(coalesceTraversals);
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.coalesce, coalesceTraversals);
		return Traversal.prototype.addStep.call(this,
			new CoalesceStep(this.asAdmin(), coalesceTraversals));
	},

	/**
	 * This step is used for looping over a some traversal given some break predicate.
	 *
	 * @param repeatTraversal the traversal to repeat over
	 * @return the traversal with the appended {@link RepeatStep}
	 */
	repeat(repeatTraversal) {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.repeat, repeatTraversal);
		return RepeatStep.addRepeatToTraversal(this, repeatTraversal);
	},

	/**
	 * Emit is used in conjunction with {@link #repeat(Traversal)} to determine what objects get emit from the loop.
	 *
	 * @param emitTraversal/emitPredicate the emit predicate defined as a traversal
	 * @return the traversal with the appended {@link RepeatStep}
	 */
	emit(emitArgument) {
		if (emitArgument === undefined) {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.emit);
			return RepeatStep.addEmitToTraversal(this, TrueTraversal.instance());
		} else if (emitArgument.asAdmin) {
			const emitTraversal = emitArgument;
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.emit, emitTraversal);
			return RepeatStep.addEmitToTraversal(this, emitTraversal);
		} else {
			const emitPredicate = emitArgument;
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.emit, emitPredicate);
			return RepeatStep.addEmitToTraversal(this, __.filter(emitPredicate));
		}
	},

	/**
	 * Modifies a {@link #repeat(Traversal)} to determine when the loop should exit.
	 *
	 * @param untilArgument the traversal/predicate that determines when the loop exits
	 * @return the traversal with the appended {@link RepeatStep}
	 */
	until(untilArgument) {
		if (untilArgument.asAdmin) {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.until, untilArgument);
			return RepeatStep.addUntilToTraversal(this, untilArgument);
		} else {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.until, untilArgument);
			return RepeatStep.addEmitToTraversal(this, __.filter(untilArgument));
		}

	},

	/**
	 * Modifies a {@link #repeat(Traversal)} to specify how many loops should occur before exiting.
	 *
	 * @param maxLoops the number of loops to execute prior to exiting
	 * @return the traversal with the appended {@link RepeatStep}
	 */
	times(maxLoops) {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.times, maxLoops);
		if (this.asAdmin().getEndStep() instanceof TimesModulating) {
			this.asAdmin().getEndStep().modulateTimes(maxLoops);
			return this;
		} else
			return RepeatStep.addUntilToTraversal(this, new LoopTraversal(maxLoops));
	},

	/**
	 * Provides a execute a specified traversal on a single element within a stream.
	 *
	 * @param localTraversal the traversal to execute locally
	 * @return the traversal with the appended {@link LocalStep}
	 */
	local(localTraversal) {
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.local, localTraversal);
		return Traversal.prototype.addStep.call(this, new LocalStep(this.asAdmin(), localTraversal.asAdmin()));
	},

	/////////////////// VERTEX PROGRAM STEPS ////////////////

	///////////////////// UTILITY STEPS /////////////////////

	/**
	 * A step modulator that provides a lable to the step that can be accessed later in the traversal by other steps.
	 *
	 * @param stepLabel the name of the step
	 * @param stepLabels additional names for the label
	 * @return the traversal with the modified end step
	 */
	as(stepLabel, ...stepLabels) {
		stepLabels = ArrayUtils.checkArray(stepLabels);
		stepLabels.splice(0, 0, stepLabel);
		this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.as, stepLabels);
		if (this.asAdmin().getSteps().size() === 0)
			Traversal.prototype.addStep.call(this, new StartStep(this.asAdmin()));
		const endStep = this.asAdmin().getEndStep();
		stepLabels.map((label) => endStep.addLabel(label));

		return this;
	},

	/**
	 * Turns the lazy traversal pipeline into a bulk-synchronous pipeline which basically iterates that traversal to
	 * the size of the barrier.
	 *
	 * @param parameter the size/consumer of the barrier
	 * @return the traversal with an appended {@link NoOpBarrierStep}
	 */
	barrier(parameter) {
		if (isNull(parameter)) {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.barrier);
			return Traversal.prototype.addStep.call(this, new NoOpBarrierStep(this.asAdmin(), Number.MAX_VALUE));
		} else if (!isNaN(parameter)) {
			const maxBarrierSize = parameter
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.barrier, maxBarrierSize);
			return Traversal.prototype.addStep.call(this, new NoOpBarrierStep(this.asAdmin(), maxBarrierSize));
		} else if (isNaN(parameter)) {
			const barrierConsumer = parameter;
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.barrier, barrierConsumer);
			return Traversal.prototype.addStep.call(this,
				new LambdaCollectingBarrierStep(this.asAdmin(), barrierConsumer, Number.MAX_VALUE));
		} else {
			throw ("Wrong parameter");
		}

	},

	//// BY-MODULATORS || COMPARATOR BY-MODULATORS

	/**
	 * The {@code by()} can be applied to a number of different step to alter their behaviors. Modifies the previous
	 * step with the specified function.
	 *
	 * @param function/key/order/comparator/traversal/token the function to apply
	 * @param comparator the comparator to apply typically for some {@link #order()}
	 * @return the traversal with a modulated step.
	 */
	by() {
		if (arguments.length === 2) {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.by, arguments[0], arguments[1]);
			ByModulating.prototype.modulateBy.call(this.asAdmin().getEndStep(), arguments[0], arguments[1]);
		} else if (arguments.length === 1) {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.by, arguments[0]);
			ByModulating.prototype.modulateBy.call(this.asAdmin().getEndStep(), arguments[0]);
		} else {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.by);
			ByModulating.prototype.modulateBy.call(this.asAdmin().getEndStep());
		}

		return this;
	},

	////
	/**
	 * This step modifies {@link #choose(Function)} to specifies the available choices that might be executed.
	 *
	 * @param pickToken the token that would trigger this option
	 * @param traversalOption the option as a traversal
	 * @return the traversal with the modulated step
	 */
	option(pickToken, traversalOption) {
		if (isNull(traversalOption)) {
			traversalOption = pickToken;
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.option, traversalOption);
			this.asAdmin().getEndStep().addGlobalChildOption(TraversalOptionParent.Pick.any, traversalOption.asAdmin());
		} else {
			this.asAdmin().getBytecode().addStep(GraphTraversal.Symbols.option, pickToken, traversalOption);
			this.asAdmin().getEndStep().addGlobalChildOption(pickToken, traversalOption.asAdmin());
			return this;
		}
	},

	////
	/**
	 * Iterates the traversal presumably for the generation of side-effects.
	 */
	iterate() {
		Traversal.prototype.iterate.call(this);
		return this;
	}
};

mixin(GraphTraversal, Traversal.prototype);

const Methods = {
	has: {
		'KEY_VALUE': 'KEY_VALUE',
		'KEY_PREDICATE': 'KEY_PREDICATE',
		'ACCESSOR_PREDICATE': 'ACCESSOR_PREDICATE',
		'ACCESSOR_VALUE': 'ACCESSOR_VALUE',
		'LABEL_PROPERTY_VALUE': 'LABEL_PROPERTY_VALUE',
		'LABEL_PROPERTY_PREDICATE': 'LABEL_PROPERTY_PREDICATE',
		'ACCESSOR_TRAVERSAL': 'ACCESSOR_TRAVERSAL',
		'KEY_TRAVERSAL': 'KEY_TRAVERSAL',
		'KEY': 'KEY'
	},
	select: {
		'COLUMN': 'COLUMN',
		'KEY': 'KEY',
		'POP_KEY': 'POP_KEY',
		'KEY_KEY_KEYS': 'KEY_KEY_KEYS',
		'POP_KEY_KEY_KEYS': 'POP_KEY_KEY_KEYS',
	},
	choose: {
		'TRAVERSAL': 'TRAVERSAL',
		'TRAVERSAL_TRAVERSAL_TRAVERSAL': 'TRAVERSAL_TRAVERSAL_TRAVERSAL',
		'TRAVERSAL_TRAVERSAL': 'TRAVERSAL_TRAVERSAL',
		'FUNCTION': 'FUNCTION',
		'PREDICATE_TRAVERSAL_TRAVERSAL': 'PREDICATE_TRAVERSAL_TRAVERSAL',
		'PREDICATE_TRAVERSAL': 'PREDICATE_TRAVERSAL',
	}
};

GraphTraversal.Symbols = {
	map: 'map',
	flatMap: 'flatMap',
	id: 'id',
	label: 'label',
	identity: 'identity',
	constant: 'constant',
	V: 'V',
	E: 'E',
	to: 'to',
	out: 'out',
	both: 'both',
	toE: 'toE',
	outE: 'outE',
	inE: 'inE',
	bothE: 'bothE',
	toV: 'toV',
	outV: 'outV',
	inV: 'inV',
	bothV: 'bothV',
	otherV: 'otherV',
	order: 'order',
	properties: 'properties',
	values: 'values',
	propertyMap: 'propertyMap',
	valueMap: 'valueMap',
	addV: 'addV',
	selectV3d2: 'selectV3d2',
	key: 'key',
	value: 'value',
	path: 'path',
	match: 'match',
	sack: 'sack',
	loops: 'loops',
	project: 'project',
	unfold: 'unfold',
	fold: 'fold',
	count: 'count',
	sum: 'sum',
	max: 'max',
	min: 'min',
	mean: 'mean',
	group: 'group',
	is: 'is',
	where: 'where',
	emit: 'emit',
	repeat: 'repeat',
	times: 'times',
	by: 'by',
	or: 'or',
	and: 'and',
	tree: 'tree',
	union: 'union',
	groupCount: 'groupCount',
	hasLabel: 'hasLabel',
	until: 'until',
	simplePath: 'simplePath',
	subgraph: 'subgraph',
	cap: 'cap',
	optional: 'optional',
	from: 'from',
	addE: 'addE',
	property: 'property',
	'choose': 'choose',
	'aggregate': 'aggregate',
	'coalesce': 'coalesce',
	'inject': 'inject',
	'option': 'option',
	'barrier': 'barrier',
	'coin': 'coin',
	'sample': 'sample',
	'local': 'local',
	'store': 'store',
	'tail': 'tail'
};
GraphTraversal.Symbols.in = 'in';
GraphTraversal.Symbols.select = 'select';
GraphTraversal.Symbols.as = 'as';

export default GraphTraversal;
