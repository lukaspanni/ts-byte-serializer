import { ByteArray } from '../serializable-primitives';
import { serializablePropertyPrefix } from './serializable-class';

/**
 * Decorator to include a string inside a serializable-decorated class in its byte-representation
 * @param lengthParameter: optionally specify either a fixed length or the name of a property to use as string-length during deserialization
 */
export const SerializableString = (lengthParameter?: number | string): Function => {
  return function (target: any, propertyKey: string) {
    const primitiveObject = new ByteArray(undefined, lengthParameter);
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    Object.defineProperty(target, serializablePropertyPrefix + propertyKey, {
      value: primitiveObject,
      enumerable: true
    });
    Object.defineProperty(target, propertyKey, {
      enumerable: true,
      get: () => {
        return decoder.decode(primitiveObject.value);
      },
      set: (value: string) => {
        if (value !== undefined) primitiveObject.value = encoder.encode(value);
      }
    });
  };
};
