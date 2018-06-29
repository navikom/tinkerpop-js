import GraphTraversal from '../../../../../src/proccess/traversal/dsl/graph/GraphTraversal';
import __ from '../../../../../src/proccess/traversal/dsl/graph/__';

describe('GraphTraversal', () => {
  const graphTraversal = new GraphTraversal();
  it('asAdmin should return GraphTraversal', () => {
    expect(graphTraversal.asAdmin().constructor.name).toBe('GraphTraversal');
  });

  const someLabel = [
    Math.random().toString(36).substr(2, 5),
    Math.random().toString(36).substr(2, 5),
    Math.random().toString(36).substr(2, 5),
    Math.random().toString(36).substr(2, 5),
  ];
  const mapTraversal =
    __.out(someLabel[0])
    .in(someLabel[1], someLabel[3])
    .both(someLabel[2]);

  it(`map(__.out(${someLabel[0]}).in(${someLabel[1]}, ${someLabel[3]}).both(${someLabel[2]}))
  .steps.array[0].mapTraversal.steps.array[1].edgeLabels[0] should return "${someLabel[1]}"`, () => {
    expect(__.map(mapTraversal).steps.array[0].mapTraversal.steps.array[1].edgeLabels[0]).toBe(someLabel[1]);
  });

  it(`flatMap(__.out(${someLabel[0]}).in(${someLabel[1]}, ${someLabel[3]}).both(${someLabel[2]}))
  .steps.array[0].flatMapTraversal.steps.array[1].edgeLabels[1] should return "${someLabel[3]}"`, () => {
    expect(__.flatMap(mapTraversal).steps.array[0].flatMapTraversal.steps.array[1].edgeLabels[1]).toBe(someLabel[3]);
  });
});