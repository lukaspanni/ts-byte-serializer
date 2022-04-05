import { Serializable } from '../serializable';
import { serializablePropertyPrefix } from './serializable-class';

/**
 * Decorator to include a object property inside a serializable-decorated class in its byte-representation
 * @param type type of the property (any serializable type is allowed)
 */
export const SerializableObjectProperty = <T extends Serializable>(type: {
  new (...args: any[]): Serializable;
}): Function => {
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
