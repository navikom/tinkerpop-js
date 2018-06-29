import { path } from '../../../../../src';

describe('PathStep', () => {
	it('path().steps.get(0).constructor.name should return "PathStep"', () => {
		expect(path().steps.get(0).constructor.name).toBe('PathStep');
	});
});
