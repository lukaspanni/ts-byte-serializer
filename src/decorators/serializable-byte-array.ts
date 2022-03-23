import { ByteArray } from '../serializable-primitives';
import { serializablePropertyPrefix } from './serializable';

/**
 * Decorator to include a uint8 property inside a serializable-decorated class in its byte-representation
 */

export const SerializableByteArray = (): Function => {
  return function (target: any, propertyKey: string) {
    let primitiveObject = new ByteArray();
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
