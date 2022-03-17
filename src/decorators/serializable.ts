import { AppendableByteStream, ensureCapacity, isSerializable } from '../serializable';
import { isSerializablePrimitive } from '../serializable-primitives/serializable-primitive';

export const serializablePropertyPrefix = '_serializableProperty_';

export const Serializable = (parameter?: { size?: number; littleEndian?: boolean }) => {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class T1 extends constructor {
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
        let obj: { [key: string]: any } = {};
        for (const key in this) {
          if (!key.startsWith(serializablePropertyPrefix)) {
            obj[key] = this[key];
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
              property.deserialize(bytestream);
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

const appendProperty = <T>(thisArg: T, key: keyof T, bytestream: AppendableByteStream) => {
  const property = thisArg[key];
  if (isSerializable(property)) {
    if (isSerializablePrimitive(property)) {
      bytestream.view = ensureCapacity(bytestream.view, bytestream.pos + property.size);
      property.append(bytestream);
      return;
    }
    for (const subkey in property) {
      if (subkey.startsWith(serializablePropertyPrefix))
        appendProperty(property, subkey as keyof T[keyof T], bytestream);
    }
  }
};
