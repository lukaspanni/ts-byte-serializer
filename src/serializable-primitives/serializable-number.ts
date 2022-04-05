import { AppendableByteStream, isAppendableByteStream } from '../serializable';
import { SerializablePrimitive } from './serializable-primitive';

/**
 * Build a new class for a serializable number
 * @param size size of the byte-representation
 * @param getFun function to read a number from a bytestream
 * @param setFun function to append a number's byte-representations to a bytestream
 */
const buildSerializableNumberPrimitive = (
  size: number,
  getFun: (view: DataView, pos: number, littleEndian?: boolean) => number,
  setFun: (view: DataView, pos: number, value: number, littleEndian?: boolean) => void
): new (data?: number | AppendableByteStream) => SerializablePrimitive<number> => {
  return class SerializableNumberPrimitive extends SerializablePrimitive<number> {
    public readonly size = size;
    protected _value: number;

    constructor(data?: number | AppendableByteStream) {
      super(data ?? 0);
      if (isAppendableByteStream(data)) this._value = this.readFromByteStream(data);
      else this._value = data as number;
    }

    public append(bytestream: AppendableByteStream): void {
      setFun(bytestream.view, bytestream.pos, this.value ?? 0, bytestream.littleEndian);
      bytestream.pos += this.size;
    }

    protected readFromByteStream(bytestream: AppendableByteStream): number {
      const value = getFun(bytestream.view, bytestream.pos, bytestream.littleEndian);
      bytestream.pos += this.size;
      return value;
    }
  };
};

export const Uint8 = buildSerializableNumberPrimitive(
  1,
  (view, pos) => view.getUint8(pos),
  (view, pos, value) => view.setUint8(pos, value)
);

export const Uint16 = buildSerializableNumberPrimitive(
  2,
  (view, pos, littleEndian) => view.getUint16(pos, littleEndian),
  (view, pos, value, littleEndian) => view.setUint16(pos, value, littleEndian)
);

export const Uint32 = buildSerializableNumberPrimitive(
  4,
  (view, pos, littleEndian) => view.getUint32(pos, littleEndian),
  (view, pos, value, littleEndian) => view.setUint32(pos, value, littleEndian)
);

export const Int8 = buildSerializableNumberPrimitive(
  1,
  (view, pos) => view.getInt8(pos),
  (view, pos, value) => view.setInt8(pos, value)
);

export const Int16 = buildSerializableNumberPrimitive(
  2,
  (view, pos, littleEndian) => view.getInt16(pos, littleEndian),
  (view, pos, value, littleEndian) => view.setInt16(pos, value, littleEndian)
);

export const Int32 = buildSerializableNumberPrimitive(
  4,
  (view, pos, littleEndian) => view.getInt32(pos, littleEndian),
  (view, pos, value, littleEndian) => view.setInt32(pos, value, littleEndian)
);

export const Float32 = buildSerializableNumberPrimitive(
  4,
  (view, pos, littleEndian) => view.getFloat32(pos, littleEndian),
  (view, pos, value, littleEndian) => view.setFloat32(pos, value, littleEndian)
);

export const Float64 = buildSerializableNumberPrimitive(
  8,
  (view, pos, littleEndian) => view.getFloat64(pos, littleEndian),
  (view, pos, value, littleEndian) => view.setFloat64(pos, value, littleEndian)
);
