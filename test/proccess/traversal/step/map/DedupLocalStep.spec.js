import { dedup, local } from '../../../../../src';

describe('DedupLocalStep', () => {
	it('dedup(local).steps.get(0).constructor.name should return "DedupLocalStep"', () => {
		expect(dedup(local).steps.get(0).constructor.name).toBe('DedupLocalStep');
	});
});
