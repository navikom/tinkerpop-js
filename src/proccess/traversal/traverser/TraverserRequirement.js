/**
 * A {@link TraverserRequirement} is a list of requirements that a {@link Traversal} requires of a {@link Traverser}.
 * The less requirements, the simpler the traverser can be (both in terms of space and time constraints).
 * Every {@link Step} provides its specific requirements via {@link Step#getRequirements()}.
 *
 */
const TraverserRequirement = {
  BULK: 'BULK',
  LABELED_PATH: 'LABELED_PATH',
  NESTED_LOOP: 'NESTED_LOOP',
  OBJECT: 'OBJECT',
  ONE_BULK: 'ONE_BULK',
  PATH: 'PATH',
  SACK: 'SACK',
  SIDE_EFFECTS: 'SIDE_EFFECTS',
  SINGLE_LOOP: 'SINGLE_LOOP',

};

export default TraverserRequirement;
