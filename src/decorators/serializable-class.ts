import { AppendableByteStream, ensureCapacity, isSerializable } from '../serializable';
import { isSerializablePrimitive } from '../serializable-primitives/serializable-primitive';

export const serializablePropertyPrefix = '_serializableProperty_';
export const serializablePropertyConstructFunctionSuffix = '_construct_';

/**
 * Decorator to add a default serialize and deserialize implementation to a given class
 * The constructor of a decorated class cannot access serializable-decorated properties, they can be initialized in a
 * method called 'init' which will be called after all serializable-properties are initialized with the constructor-parameters
 * @param parameter configuration for serialization, allows setting a custom size and littleEndian/bigEndian
 * @constructor class to decorate
 */
export const SerializableClass = (parameter?: { size?: number; littleEndian?: boolean }): Function => {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class T1 extends constructor {
      constructor(...args: any[]) {
        super(...args);
        //initialize underlying object for serializable properties
        for (const key in this) {
          if (!key.startsWith(serializablePropertyPrefix)) continue;
          if (key.endsWith(serializablePropertyConstructFunctionSuffix)) continue;
          this[key] = (this as any)[key + serializablePropertyConstructFunctionSuffix]();
        }
        // call init function to initialize object
        if (typeof (this as any)['init'] === 'function') {
          (this as any)['init'](...args);
        }
      }

      public serialize() {
        const bytestream: AppendableByteStream = {
          view: new DataView(new ArrayBuffer(parameter?.size ?? 0)),
          pos: 0,
          littleEndian: parameter?.littleEndian
        };
        for (const key in this) {
          if (!key.startsWith(serializablePropertyPrefix)) continue;
          appendProperty(this, key, bytestream);
        }
        return new Uint8Array(bytestream.view.buffer, 0, parameter?.size);
      }

      public toJSON(): { [key: string]: any } {
        const obj: { [key: string]: any } = {};
        for (const key in this) {
          if (!key.startsWith(serializablePropertyPrefix)) {
            // bigints cause problems in json serialization, so the string representation is used
            // see: https://github.com/GoogleChromeLabs/jsbi/issues/30
            if (typeof this[key] === 'bigint') obj[key] = String(this[key]);
            else obj[key] = this[key];
          }
        }
        return obj;
      }

      public toString(): string {
        return JSON.stringify(this);
      }

      public deserialize(bytestream: AppendableByteStream): void {
        for (const key in this) {
          if (!key.startsWith(serializablePropertyPrefix)) continue;
          const property = (this as any)[key];
          if (isSerializable(property)) {
            if (isSerializablePrimitive(property)) {
              property.deserialize(bytestream, this);
              continue;
            }
            property.deserialize(bytestream);
          }
        }
      }

      public static deserialize(bytes: Uint8Array): T1 {
        const bytestream = { view: new DataView(bytes.buffer), pos: 0, littleEndian: parameter?.littleEndian };
        const object = new T1();
        object.deserialize(bytestream);
        return object;
      }
    };
  };
};

const appendProperty = <T>(thisArg: T, key: keyof T, bytestream: AppendableByteStream): void => {
  const property = thisArg[key];

  if (isSerializable(property)) {
    if (isSerializablePrimitive(property)) {
      bytestream.view = ensureCapacity(bytestream.view, bytestream.pos + property.size);
      property.append(bytestream);
      return;
    }
    //maybe call serialize of serializable property??
    for (const subkey in property) {
      if (
        subkey.startsWith(serializablePropertyPrefix) &&
        !subkey.endsWith(serializablePropertyConstructFunctionSuffix)
      ) {
        appendProperty(property, subkey as keyof T[keyof T], bytestream);
      }
    }
  }
};
