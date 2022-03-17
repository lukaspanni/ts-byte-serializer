import { SerializablePrimitive } from '../serializable-primitives';
import { serializablePropertyPrefix } from './serializable';

export const SerializableNumber = (type: { new (value: number): SerializablePrimitive<number> }) => {
  return function (target: any, propertyKey: string) {
    const primitiveObject = new type(0);
    Object.defineProperty(target, propertyKey, {
      enumerable: true,
      get: () => {
        return primitiveObject.value;
      },
      set: (value: number) => {
        primitiveObject.value = value ?? 0;
      }
    });
    Object.defineProperty(target, serializablePropertyPrefix + propertyKey, {
      value: primitiveObject,
      enumerable: true
    });
  };
};
