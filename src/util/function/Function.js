export default class Function {

	/**
	 * Applies this function to the given argument.
	 *
	 * @param t the function argument
	 * @return the function result
	 */
	apply(t) {
		throw ("Must be overloaded");
	}

	/**
	 * Returns a composed function that first applies the {@code before}
	 * function to its input, and then applies this function to the result.
	 * If evaluation of either function throws an exception, it is relayed to
	 * the caller of the composed function.
	 *
	 * @param <V> the type of input to the {@code before} function, and to the
	 *           composed function
	 * @param before the function to apply before this function is applied
	 * @return a composed function that first applies the {@code before}
	 * function and then applies this function
	 *
	 * @see #andThen(Function)
	 */
	compose(before) {
		return (v) => this.apply(before.apply(v));
	}

	/**
	 * Returns a composed function that first applies this function to
	 * its input, and then applies the {@code after} function to the result.
	 * If evaluation of either function throws an exception, it is relayed to
	 * the caller of the composed function.
	 *
	 * @param <V> the type of output of the {@code after} function, and of the
	 *           composed function
	 * @param after the function to apply after this function is applied
	 * @return a composed function that first applies this function and then
	 * applies the {@code after} function
	 * @throws NullPointerException if after is null
	 *
	 * @see #compose(Function)
	 */
	andThen(after) {
		return (t) => after.apply(this.apply(t));
	}

	/**
	 * Returns a function that always returns its input argument.
	 *
	 * @param <T> the type of the input and output objects to the function
	 * @return a function that always returns its input argument
	 */
	static identity() {
		return (t) => t;
	}
}
