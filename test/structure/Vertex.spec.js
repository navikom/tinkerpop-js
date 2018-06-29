import Vertex from '../../src/structure/Vertex';

describe('Vertex', () => {

  const vertex = new Vertex();
  it('property(null, "test") should throw error "Must be overloaded"', () => {
    expect(() => vertex.property(null, 'test')).toThrow("Must be overloaded");
  });

});