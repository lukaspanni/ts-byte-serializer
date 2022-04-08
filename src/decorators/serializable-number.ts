import { SerializablePrimitive } from "../serializable-primitives";
import { serializablePropertyPrefix, serializablePropertyTypeInfoSuffix } from "./serializable-class";

type SerializableNumberConstructor =
  { new(value?: number): SerializablePrimitive<number> }
  | { new(value?: bigint): SerializablePrimitive<bigint> };
/**
 * Decorator to include a number-property inside a serializable-decorated class in its byte-representation
 * @param type type of the number (uint8/16/32/64 or int8/16/32/64)
 */
export const SerializableNumber = (type: SerializableNumberConstructor) => {
  return function(target: any, propertyKey: string) {
    const serializablePropertyName = serializablePropertyPrefix + propertyKey;

    Object.defineProperty(target, propertyKey, {
      enumerable: true,
      get: function() {
        return this[serializablePropertyName].value ?? 0;
      },
      set: function(value: number | bigint) {
        if (this[serializablePropertyName] !== undefined)
          this[serializablePropertyName].value = value ?? 0;
      }
    });
    //TODO: extract duplicate code

    // underlying object, holds actual data
    Object.defineProperty(target, serializablePropertyName, {
      value: undefined,
      enumerable: true,
      writable: true
    });
    // store method to call constructor
    Object.defineProperty(target, serializablePropertyName + serializablePropertyTypeInfoSuffix, {
      value: () => new type(),
      enumerable: true
    });
  };
};


