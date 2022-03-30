import { ByteArray } from '../serializable-primitives';
import { serializablePropertyPrefix } from './serializable';

/**
 * Decorator to include a uint8 property inside a serializable-decorated class in its byte-representation
 * @param lengthParameter: optionally specify either a fixed length or the name of a property to use as array-length during deserialization
 */
export const SerializableByteArray = (lengthParameter?: number | string): Function => {
  return function (target: any, propertyKey: string) {
    const primitiveObject = new ByteArray(undefined, lengthParameter);
    Object.defineProperty(target, serializablePropertyPrefix + propertyKey, {
      value: primitiveObject,
      enumerable: true
    });
    Object.defineProperty(target, propertyKey, {
      enumerable: true,
      get: () => {
        return primitiveObject.value;
      },
      set: (value: Uint8Array) => {
        if (value !== undefined) primitiveObject.value = value;
      }
    });
  };
};
