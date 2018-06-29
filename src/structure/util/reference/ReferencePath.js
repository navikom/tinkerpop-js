import { mixin } from '../../../util';
import Element from '../../Element';
function ReferencePath() {
  Element.call(this);
}

ReferencePath.prototype = {
  constructor: ReferencePath,
};

mixin(ReferencePath, Element.prototype);

export { ReferencePath };
