import DefaultGraphTraversal from './DefaultGraphTraversal';

/**
 * An anonymous {@link GraphTraversal}.
 */
export default class __ {
	constructor() {
	}

	static start(source) {
		return new DefaultGraphTraversal(source);
	}

	///////////////////// MAP STEPS /////////////////////

	/**
	 * @see GraphTraversal#map(Traversal)
	 */
	static map(traversal) {
		return __.start().map(traversal);
	}

	/**
	 * @see GraphTraversal#flatMap(Traversal)
	 */
	static flatMap(flatMapTraversal) {
		return __.start().flatMap(flatMapTraversal);
	}

	/**
	 * @see GraphTraversal#identity()
	 */
	static identity() {
		return __.start().identity();
	}

	/**
	 * @see GraphTraversal#constant(Object)
	 */
	static constant(a) {
		return __.start().constant(a);
	}

	/**
	 * @see GraphTraversal#label()
	 */
	static label() {
		return __.start().label();
	}

	/**
	 * @see GraphTraversal#id()
	 */
	static id() {
		return __.start().id();
	}

	/**
	 * @see GraphTraversal#V(Object...)
	 */
	static V(...vertexIdsOrElements) {
		return __.start().V(vertexIdsOrElements);
	}

	/**
	 * @see GraphTraversal#out(String...)
	 */
	static out(...edgeLabels) {
		return __.start().out(edgeLabels);
	}

	/**
	 * @see GraphTraversal#in(String...)
	 */
	static in(...edgeLabels) {
		return __.start().in(edgeLabels);
	}

	/**
	 * @see GraphTraversal#both(String...)
	 */
	static both(...edgeLabels) {
		return __.start().both(edgeLabels);
	}

	/**
	 * @see GraphTraversal#outE(String...)
	 */
	static outE(...edgeLabels) {
		return __.start().outE(edgeLabels);
	}

	/**
	 * @see GraphTraversal#inE(String...)
	 */
	static inE(...edgeLabels) {
		return __.start().inE(edgeLabels);
	}

	/**
	 * @see GraphTraversal#bothE(String...)
	 */
	static bothE(...edgeLabels) {
		return __.start().bothE(edgeLabels);
	}

	/**
	 * @see GraphTraversal#inV()
	 */
	static inV() {
		return __.start().inV();
	}

	/**
	 * @see GraphTraversal#outV()
	 */
	static outV() {
		return __.start().outV();
	}

	/**
	 * @see GraphTraversal#bothV()
	 */
	static bothV() {
		return __.start().bothV();
	}

	/**
	 * @see GraphTraversal#otherV()
	 */
	static otherV() {
		return __.start().otherV();
	}

	/**
	 * @see GraphTraversal#identity()
	 */
	static identity() {
		return __.start().identity();
	}

	/**
	 * @see GraphTraversal#values(String...)
	 */
	static values(...propertyKeys) {
		return __.start().values(propertyKeys);
	}

	/**
	 * @see GraphTraversal#valueMap
	 */
	static valueMap() {
		return __.start().valueMap();
	}

	/**
	 * @see GraphTraversal#select(Column)
	 */
	static select(...properties) {
		return __.start().select(properties);
	}

	/**
	 * @see GraphTraversal#project(String, String...)
	 */
	static project(projectKey, ...projectKeys) {
		return __.start().project(projectKey, projectKeys);
	}

	/**
	 * @see GraphTraversal#unfold()
	 */
	static unfold() {
		return __.start().unfold();
	}

	/**
	 * @see GraphTraversal#fold(Object, BiFunction)
	 */
	static fold(seed, foldFunction) {
		return __.start().fold(seed, foldFunction);
	}

	/**
	 * @see GraphTraversal#path()
	 */
	static path() {
		return __.start().path();
	}

	/**
	 * @see GraphTraversal#key()
	 */
	static key() {
		return __.start().key();
	}

	/**
	 * @see GraphTraversal#value()
	 */
	static value() {
		return __.start().value();
	}

	/**
	 * @see GraphTraversal#match(Traversal[])
	 */
	static match(...matchTraversals) {
		return __.start().match(matchTraversals);
	}

	/**
	 * @see GraphTraversal#order(Scope)
	 */
	static order(scope) {
		return __.start().order(scope);
	}

	/**
	 * @see GraphTraversal#properties(String...)
	 */
	static properties(...propertyKeys) {
		return __.start().properties(propertyKeys);
	}

	/**
	 * @see GraphTraversal#count(Scope)
	 */
	static count(scope) {
		return __.start().count(scope);
	}

	/**
	 * @see GraphTraversal#sum(Scope)
	 */
	static sum(scope) {
		return __.start().sum(scope);
	}

	/**
	 * @see GraphTraversal#min(Scope)
	 */
	static min(scope) {
		return __.start().min(scope);
	}

	/**
	 * @see GraphTraversal#max(Scope)
	 */
	static max(scope) {
		return __.start().max(scope);
	}

	/**
	 * @see GraphTraversal#mean(Scope)
	 */
	static mean(scope) {
		return __.start().mean(scope);
	}

	///////////////////// FILTER STEPS /////////////////////

	/**
	 * @see GraphTraversal#filter(Traversal)
	 */
	static filter(filterTraversal) {
		return __.start().filter(filterTraversal);
	}

	/**
	 * @see GraphTraversal#and(Traversal[])
	 */
	static and(...andTraversals) {
		return __.start().and(andTraversals);
	}

	/**
	 * @see GraphTraversal#or(Traversal[])
	 */
	static or(...orTraversals) {
		return __.start().or(orTraversals);
	}

	/**
	 * @see GraphTraversal#inject(Object[])
	 */
	static inject(...injections) {
		return __.start().inject(injections);
	}

	/**
	 * @see GraphTraversal#has(String, Object)
	 */
	static has(...params) {
		return __.start().has(params);
	}

	/**
	 * @see GraphTraversal#hasLabel(String, String...)
	 */
	static hasLabel(label, ...otherLabels) {
		return __.start().hasLabel(label, otherLabels);
	}

	/**
	 * @see GraphTraversal#dedup(Scope, String...)
	 */
	static dedup(scope, ...dedupLabels) {
		return __.start().dedup(scope, dedupLabels);
	}

	/**
	 * @see GraphTraversal#range(Scope, long, long)
	 */
	static range(scope, low, high) {
		return __.start().range(scope, low, high);
	}

	/**
	 * @see GraphTraversal#limit(Scope, long)
	 */
	static limit(scope, limit) {
		return __.start().limit(scope, limit);
	}

	/**
	 * @see GraphTraversal#cyclicPath()
	 */
	static cyclicPath() {
		return __.start().cyclicPath();
	}

	/**
	 * @see GraphTraversal#where(String, P)
	 */
	static where(startKey, predicate) {
		return __.start().where(startKey, predicate);
	}

	/**
	 * @see GraphTraversal#is(Object)
	 */
	static is(value) {
		return __.start().is(value);
	}

	/**
	 * @see GraphTraversal#tail(Scope, long)
	 */
	static tail(scope, limit) {
		return __.start().tail(scope, limit);
	}

	/**
	 * @see GraphTraversal#simplePath()
	 */
	static simplePath() {
		return __.start().simplePath();
	}

	/**
	 * @see GraphTraversal#not(Traversal)
	 */
	static not(notTraversal) {
		return __.start().not(notTraversal);
	}

	/**
	 * @see GraphTraversal#coin(double)
	 */
	static coin(probability) {
		return __.start().coin(probability);
	}

	/**
	 * @see GraphTraversal#sample(Scope, int)
	 */
	static sample(scope, amountToSample) {
		return __.start().sample(scope, amountToSample);
	}

	/**
	 * @see GraphTraversal#drop()
	 */
	static drop() {
		return __.start().drop();
	}

	///////////////////// SIDE-EFFECT STEPS /////////////////////

	/**
	 * @see GraphTraversal#sideEffect(Consumer/Traversal)
	 */
	static sideEffect(param) {
		return __.start().sideEffect(param);
	}

	/**
	 * @see GraphTraversal#cap(String, String...)
	 */
	static cap(sideEffectKey, ...sideEffectKeys) {
		return __.start().cap(sideEffectKey, sideEffectKeys);
	}

	/**
	 * @see GraphTraversal#store(String)
	 */
	static store(sideEffectKey) {
		return __.start().store(sideEffectKey);
	}

	/**
	 * @see GraphTraversal#property(Cardinality, Object, Object, Object...)
	 */
	static property(cardinality, key, value, ...keyValues) {
		return __.start().property(cardinality, key, value, keyValues);
	}

	/**
	 * @see GraphTraversal#subgraph(String)
	 */
	static subgraph(sideEffectKey) {
		return __.start().subgraph(sideEffectKey);
	}

	/**
	 * @see GraphTraversal#aggregate(String)
	 */
	static aggregate(sideEffectKey) {
		return __.start().aggregate(sideEffectKey);
	}

	/**
	 * @see GraphTraversal#group(String)
	 */
	static group(sideEffectKey) {
		return __.start().group(sideEffectKey);
	}

	/**
	 * @see GraphTraversal#addV(String)
	 */
	static addV(vertexLabel) {
		return __.start().addV(vertexLabel);
	}

	/**
	 * @see GraphTraversal#addE(String)
	 */
	static addE(edgeLabel) {
		return __.start().addE(edgeLabel);
	}

	/**
	 * @see GraphTraversal#groupCount(String)
	 */
	static groupCount(sideEffectKey) {
		return __.start().groupCount(sideEffectKey);
	}

	/**
	 * @see GraphTraversal#tree(String)
	 */
	static tree(sideEffectKey) {
		return __.start().tree(sideEffectKey);
	}

	///////////////////// BRANCH STEPS /////////////////////

	/**
	 * @see GraphTraversal#choose(Traversal, Traversal, Traversal)
	 */
	static choose(traversalPredicate, trueChoice, falseChoice) {
		return __.start().choose(traversalPredicate, trueChoice, falseChoice);
	}

	/**
	 * @see GraphTraversal#repeat(Traversal)
	 */
	static repeat(traversal) {
		return __.start().repeat(traversal);
	}

	/**
	 * @see GraphTraversal#optional(Traversal)
	 */
	static optional(optionalTraversal) {
		return __.start().optional(optionalTraversal);
	}

	/**
	 * @see GraphTraversal#union(Traversal[])
	 */
	static union(...traversals) {
		return __.start().union(traversals);
	}

	/**
	 * @see GraphTraversal#coalesce(Traversal[])
	 */
	static coalesce(...traversals) {
		return __.start().coalesce(traversals);
	}

	/**
	 * @see GraphTraversal#emit(Traversal/Predicate)
	 */
	static emit(emitArgument) {
		return __.start().emit(emitArgument);
	}

	/**
	 * @see GraphTraversal#until(Traversal/Predicate)
	 */
	static until(untilTraversal) {
		return __.start().until(untilTraversal);
	}

	/**
	 * @see GraphTraversal#times(int)
	 */
	static times(maxLoops) {
		return __.start().times(maxLoops);
	}

	/**
	 * @see GraphTraversal#local(Traversal)
	 */
	static local(localTraversal) {
		return __.start().local(localTraversal);
	}

	///////////////////// UTILITY STEPS /////////////////////

	/**
	 * @see GraphTraversal#as(String, String...)
	 */
	static as(label, ...labels) {
		return __.start().as(label, labels);
	}

	/**
	 * @see GraphTraversal#barrier
	 */
	static barrier(parameter) {
		return __.start().barrier(parameter);
	}

}

const V = __.V;
const has = __.has;
const hasLabel = __.hasLabel;
const out = __.out;
const both = __.both;
const dedup = __.dedup;
const path = __.path;
const order = __.order;
const outE = __.outE;
const inE = __.inE;
const bothE = __.bothE;
const inV = __.inV;
const outV = __.outV;
const bothV = __.bothV;
const otherV = __.otherV;
const limit = __.limit;
const range = __.range;
const drop = __.drop;
const count = __.count;
const map = __.map;
const not = __.not;
const is = __.is;
const where = __.where;
const repeat = __.repeat;
const emit = __.emit;
const times = __.times;
const identity = __.identity;
const select = __.select;
const sum = __.sum;
const min = __.min;
const max = __.max;
const sideEffect = __.sideEffect;
const or = __.or;
const and = __.and;
const values = __.values;
const tree = __.tree;
const union = __.union;
const group = __.group;
const fold = __.fold;
const label = __.label;
const id = __.id;
const groupCount = __.groupCount;
const until = __.until;
const simplePath = __.simplePath;
const valueMap = __.valueMap;
const subGraph = __.subgraph;
const unfold = __.unfold;
const aggregate = __.aggregate;
const constant = __.constant;
const inject = __.inject;
const mean = __.mean;
const properties = __.properties;
const project = __.project;
const sample = __.sample;
const tail = __.tail;

export {
	__, V, has, hasLabel, out, both, dedup, path, order, outE, inE, limit, range, drop, count, map,
	not, is, where, bothE, inV, outV, bothV, otherV, repeat, emit, times, identity, select,
	sum, min, max, sideEffect, or, and, values, tree, union, group, fold, label, id, groupCount,
	until, simplePath, valueMap, subGraph, unfold, aggregate, constant, inject, mean,
	properties, project, sample, tail
}