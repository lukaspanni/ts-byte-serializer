import { Serializable } from '../serializable';
import { serializablePropertyPrefix } from './serializable';

/**
 * Decorator to include a property inside a serializable-decorated class in its byte-representation
 * @param type type of the property (any serializable type is allowed)
 */
export const SerializableProperty = <T extends Serializable>(type: { new (...args: any[]): Serializable }) => {
  return function (target: any, propertyKey: string) {
    let object = new type() as T;
    Object.defineProperty(target, serializablePropertyPrefix + propertyKey, {
      value: object,
      enumerable: true,
      writable: true
    });
    Object.defineProperty(target, propertyKey, {
      enumerable: true,
      get: () => {
        return object;
      },
      set: (value: T) => {
        if (value !== undefined) object = value;
      }
    });
  };
};
