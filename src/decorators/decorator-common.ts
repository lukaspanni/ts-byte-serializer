import { serializablePropertyPrefix, serializablePropertyConstructFunctionSuffix } from './serializable-class';

export const prepareUnderlyingObject = <T>(
  target: any,
  serializablePropertyName: string,
  constructFunction: () => T
) => {
  const serializablePropertyConstructFunctionName =
    serializablePropertyName + serializablePropertyConstructFunctionSuffix;
  // underlying object, holds actual data
  Object.defineProperty(target, serializablePropertyName, {
    value: undefined,
    enumerable: true,
    writable: true
  });

  // constructor call for underlying object
  Object.defineProperty(target, serializablePropertyConstructFunctionName, {
    value: constructFunction,
    enumerable: true
  });
};
