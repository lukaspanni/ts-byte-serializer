import { Serializable } from "../serializable";
import { serializablePropertyPrefix, serializablePropertyTypeInfoSuffix } from "./serializable-class";

/**
 * Decorator to include a object property inside a serializable-decorated class in its byte-representation
 * @param type type of the property (any serializable type is allowed)
 */
export const SerializableObjectProperty = <T extends Serializable>(type: {
  new(...args: any[]): Serializable;
}): Function => {
  return function(target: any, propertyKey: string) {
    const serializablePropertyName = serializablePropertyPrefix + propertyKey;

    Object.defineProperty(target, propertyKey, {
      enumerable: true,
      get: function() {
        return this[serializablePropertyName].value;
      },
      set: function(value: T) {
        if (this[serializablePropertyName] !== undefined)
          this[serializablePropertyName].value = value;
      }
    });

    Object.defineProperty(target, serializablePropertyName, {
      value: undefined,
      enumerable: true,
      writable: true
    });

    Object.defineProperty(target, serializablePropertyName + serializablePropertyTypeInfoSuffix, {
      value: () => new type(),
      enumerable: true
    });
  };
};
