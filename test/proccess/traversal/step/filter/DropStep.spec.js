import __ from '../../../../../src/proccess/traversal/dsl/graph/__';

describe('DropStep', () => {

	it('__.drop().steps.get(0).constructor.name should return DropStep', () => {
		expect(__.drop().steps.get(0).constructor.name).toBe("DropStep");
	});

});