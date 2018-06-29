import { dedup } from '../../../../../src';

describe('DedupGlobalStep', () => {
	it('dedup().steps.get(0).constructor.name should return "DedupGlobalStep"', () => {
		expect(dedup().steps.get(0).constructor.name).toBe('DedupGlobalStep');
	});
});