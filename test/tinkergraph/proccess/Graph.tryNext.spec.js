import { TinkerFactory } from '../../../src';


describe('Graph tryNext', () => {
	const g = TinkerFactory.createModern().traversal();

	it('g.V().out().tryNext().getValue().value("name") should return "lop"', () => {
		expect(g.V().out().tryNext().getValue().value("name")).toBe("lop");
	});

	it('g.V().out("nothing").tryNext().getValue() should return "nothing"', () => {
		expect(g.V().out("nothing").tryNext().orElse("nothing")).toBe("nothing");
	});

});
