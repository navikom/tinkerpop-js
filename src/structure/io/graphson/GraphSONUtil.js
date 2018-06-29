export default class GraphSONUtil {

  static writeWithType(key, object, jsonGenerator, serializerProvider, typeSerializer) {
    if (!typeSerializer) {
      GraphSONUtil.writeWithType(null, key, object, jsonGenerator, serializerProvider);
    } else {
      const serializer = serializerProvider.findValueSerializer(object.getClass(), null);
      if (typeSerializer != null) {
        // serialize with types embedded
        if (key && !key.isEmpty()) jsonGenerator.writeFieldName(key);
        serializer.serializeWithType(object, jsonGenerator, serializerProvider, typeSerializer);
      } else {
        // types are not embedded, but use the serializer when possible or else custom serializers will get
        // bypassed and you end up with the default jackson serializer when you don't want it.
        if (key && !key.isEmpty()) jsonGenerator.writeFieldName(key);
        serializer.serialize(object, jsonGenerator, serializerProvider);
      }
    }
  }


  static writeStartObject(o, jsonGenerator, typeSerializer) {
    if (typeSerializer != null)
      typeSerializer.writeTypePrefixForObject(o, jsonGenerator);
    else
      jsonGenerator.writeStartObject();
  }

  static writeEndObject(o, jsonGenerator, typeSerializer) {
    if (typeSerializer)
      typeSerializer.writeTypeSuffixForObject(o, jsonGenerator);
    else
      jsonGenerator.writeEndObject();
  }

  static writeStartArray(o, jsonGenerator, typeSerializer) {
    if (typeSerializer)
      typeSerializer.writeTypePrefixForArray(o, jsonGenerator);
    else
      jsonGenerator.writeStartArray();
  }


  static  writeEndArray(o, jsonGenerator, typeSerializer) {
    if (typeSerializer)
      typeSerializer.writeTypeSuffixForArray(o, jsonGenerator);
    else
      jsonGenerator.writeEndArray();
  }

  static safeWriteObjectField(jsonGenerator, key, value) {
    jsonGenerator.writeObjectField(key, value);
  }
}