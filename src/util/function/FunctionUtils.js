export default class FunctionUtils {
  static wrapFunction(functionThatThrows) {
    return (a) => {
      try {
        return functionThatThrows.apply(a);

      } catch (e) {
        throw (e);
      }
    };
  }

  static wrapConsumer(consumerThatThrows) {
    return (a) => {
      try {
        consumerThatThrows.accept(a);
      } catch (e) {
        throw(e);
      }
    };
  }

  static wrapBiConsumer(consumerThatThrows) {
    return (a, b) => {
      try {
        consumerThatThrows.accept(a, b);
      } catch (e) {
        throw(e);
      }
    };
  }

  static wrapSupplier(supplierThatThrows) {
    return () => {
      try {
        return supplierThatThrows.getValue();
      } catch (e) {
        throw(e);
      }
    };
  }
}