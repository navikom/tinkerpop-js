import { TinkerGraph, TinkerFactory,neq } from '../../../src';

describe('Graph addE', () => {
	TinkerGraph.open().clear();
	const g = TinkerFactory.createModern().traversal();

	it('g.V(1).as("a").out("created").in("created").where(neq("a")).addE("co-developer")' +
		'.from("a").property("year",2009).iterate(); g.E().hasLabel("co-developer").count(); should return 2', () => {
		g.V(1).as("a").out("created").in("created").where(neq("a")).
		addE("co-developer").from("a").property("year",2009).iterate();
		const query = g.E().hasLabel("co-developer").count();
		expect(query.hasNext()).toBe(true);
		while (query.hasNext()){
			expect(query.next()).toBe(2);
		}
	});

});

