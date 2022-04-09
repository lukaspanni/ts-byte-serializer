import { ByteArray } from '../serializable-primitives';
import { serializablePropertyPrefix, serializablePropertyTypeInfoSuffix } from './serializable-class';

/**
 * Decorator to include a string inside a serializable-decorated class in its byte-representation
 * @param lengthParameter: optionally specify either a fixed length or the name of a property to use as string-length during deserialization
 */
export const SerializableString = (lengthParameter?: number | string): Function => {
  return function (target: any, propertyKey: string) {
    const serializablePropertyName = serializablePropertyPrefix + propertyKey;
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    Object.defineProperty(target, propertyKey, {
      enumerable: true,
      get: function () {
        return decoder.decode(this[serializablePropertyName].value);
      },
      set: function (value: string) {
        if (this[serializablePropertyName] !== undefined && value !== undefined)
          this[serializablePropertyName].value = encoder.encode(value);
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
