import { SerializablePrimitive } from "../serializable-primitives";
import { serializablePropertyPrefix } from "./serializable";

/**
 * Decorator to include a number-property inside a serializable-decorated class in its byte-representation
 * @param type type of the number (uint8/16/32/64 or int8/16/32/64)
 */
export const SerializableNumber = (type: { new(value: number | bigint): SerializablePrimitive<number | bigint> }) => {
  return function(target: any, propertyKey: string) {
    const primitiveObject = new type(0);
    Object.defineProperty(target, propertyKey, {
      enumerable: true,
      get: () => {
        return primitiveObject.value;
      },
      set: (value: number | bigint) => {
        primitiveObject.value = value ?? 0;
      }
    });
    Object.defineProperty(target, serializablePropertyPrefix + propertyKey, {
      value: primitiveObject,
      enumerable: true
    });
  };
};
