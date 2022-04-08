import { ByteArray } from "../serializable-primitives";
import { serializablePropertyPrefix, serializablePropertyTypeInfoSuffix } from "./serializable-class";

/**
 * Decorator to include a uint8Array inside a serializable-decorated class in its byte-representation
 * @param lengthParameter: optionally specify either a fixed length or the name of a property to use as array-length during deserialization
 */
export const SerializableByteArray = (lengthParameter?: number | string): Function => {
  return function(target: any, propertyKey: string) {
    const serializablePropertyName = serializablePropertyPrefix + propertyKey;

    Object.defineProperty(target, propertyKey, {
      enumerable: true,
      get: function() {
        return this[serializablePropertyName].value ?? 0;
      },
      set: function(value: Uint8Array) {
        if (this[serializablePropertyName] !== undefined)
          this[serializablePropertyName].value = value ?? 0;
      }
    });

    Object.defineProperty(target, serializablePropertyName, {
      value: undefined,
      enumerable: true,
      writable: true
    });

    Object.defineProperty(target, serializablePropertyName + serializablePropertyTypeInfoSuffix, {
      value: () => new ByteArray(undefined, lengthParameter),
      enumerable: true
    });
  };
};
