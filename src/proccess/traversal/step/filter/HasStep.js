import { mixin, ArrayUtils, List } from '../../../../util';
import { FilterStep } from './FilterStep';
import HasContainerHolder from '../HasContainerHolder';
import HasContainer from '../util/HasContainer';
import TraverserRequirement from '../../traverser/TraverserRequirement';

/**
 * HasStep
 * @param traversal
 * @param hasContainers
 * @constructor
 */
function HasStep(traversal, ...hasContainers) {
  FilterStep.call(this, traversal);
  hasContainers = ArrayUtils.checkArray(hasContainers);
  this.hasContainers = new List(hasContainers);
}

HasStep.prototype = {
  constructor: HasStep,


  filter(traverser) {
    return HasContainer.testAll(traverser.get(), this.hasContainers);
  },


  getHasContainers() {
    return this.hasContainers;
  },

  removeHasContainer(hasContainer) {
    this.hasContainers.remove(hasContainer);
  },

  addHasContainer(hasContainer) {
    this.hasContainers.add(hasContainer);
  },

  getRequirements() {
    return new List([TraverserRequirement.OBJECT]);
  },

  clone() {
    const clone = FilterStep.prototype.clone.call(this);
    clone.hasContainers = new List();
    for (let i = 0; i < this.hasContainers.size(); i++) {
      clone.addHasContainer(this.hasContainers.get(i).clone());
    }
    return clone;
  },

};

mixin(HasStep, FilterStep.prototype, HasContainerHolder.prototype);

export { HasStep };
