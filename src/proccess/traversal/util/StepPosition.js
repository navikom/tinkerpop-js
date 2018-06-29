/**
 * StepPosition
 */
class StepPosition {
  /**
   *
   * @param x
   * @param y
   * @param z
   * @param parentId
   */
  constructor(x, y, z, parentId) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.parentId = parentId || '';
  }

  nextXId() {
    return (this.x++) + StepPosition.DOT + this.y + StepPosition.DOT + this.z
      + StepPosition.LEFT_PARENTHESES + this.parentId + StepPosition.RIGHT_PARENTHESES;
  }
}

StepPosition.DOT = '.';
StepPosition.LEFT_PARENTHESES = '(';
StepPosition.RIGHT_PARENTHESES = ')';

export default StepPosition;
