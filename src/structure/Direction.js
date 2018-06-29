
/**
 * {@link Direction} is used to denote the direction of an {@link Edge} or location of a {@link Vertex} on an
 * {@link Edge}. For example:
 * <p/>
 * <pre>
 * gremlin--knows-->rexster
 * </pre>
 * is an {@link Direction#OUT} {@link Edge} for Gremlin and an {@link Direction#IN} edge for Rexster. Moreover, given
 * that {@link Edge}, Gremlin is the {@link Direction#OUT} {@link Vertex} and Rexster is the {@link Direction#IN}
 * {@link Vertex}.
 */

const Direction = {
  /**
   * Refers to an outgoing direction.
   */
  OUT: 'OUT',

  /**
   * Refers to an incoming direction.
   */
  IN: 'IN',

  /**
   * Refers to either direction ({@link #IN} or {@link #OUT}).
   */
  BOTH: 'BOTH',
};

/**
 * The actual direction of an {@link Edge} may only be {@link #IN} or {@link #OUT}, as defined in this array.
 */
Direction.proper = [Direction.OUT, Direction.IN];

/**
 * Produce the opposite representation of the current {@code Direction} enum.
 */
Direction.opposite = function (dir) {
  if (dir === Direction.OUT) { return Direction.IN; } else if (dir === Direction.IN) { return Direction.OUT; }
  return Direction.BOTH;
};

export default Direction;
