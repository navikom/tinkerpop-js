/**
 * This enumeration allows for the specification of the type of a {@link Property}.
 * Properties can either be their standard form or value form. Note that this is different than a property
 * class like {@link Property} or {@link VertexProperty}. This enumeration is used to denote those aspects of a
 * property that can not be realized by class alone.
 *
 * @type {{}}
 */
const PropertyType = {
  PROPERTY: {
    forProperties: () => true,
    forValues: () => false,
  },
  VALUE: {
    forProperties: () => false,
    forValues: () => true,
  }
};

export default PropertyType;