import EmptyGraph from '../../../../src/structure/util/empty/EmptyGraph';

describe('EmptyGraph', () => {

  it('features.graph().variables() should return null', () => {
    expect(EmptyGraph.instance().features.graph().variables()).toBe(null);
  });
  it('features.vertex().getCardinality() should return "list"', () => {
    expect(EmptyGraph.instance().features.vertex().getCardinality()).toBe('list');
  });

  it('features.edge().properties().supportsAddProperty() should return false', () => {
    expect(EmptyGraph.instance().features.edge().properties().supportsAddProperty()).toBe(false);
  });

});
