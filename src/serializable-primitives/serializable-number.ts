import { isAppendableByteStream } from '../serializable';
import { AppendableByteStream } from '../appendable-byte-stream';
import { SerializablePrimitive } from './serializable-primitive';

/**
 * Build a new class for a serializable number
 * @param size size of the byte-representation
 * @param getFun function to read a number from a bytestream
 * @param setFun function to append a number's byte-representations to a bytestream
 */
const buildSerializableNumberPrimitive = (
  size: number,
  getFun: (bytestream: AppendableByteStream) => number,
  setFun: (bytestream: AppendableByteStream, value: number) => void
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
      setFun(bytestream, this.value ?? 0);
      bytestream.pos += this.size;
    }

    protected readFromByteStream(bytestream: AppendableByteStream): number {
      const value = getFun(bytestream);
      bytestream.pos += this.size;
      return value;
    }
  };
};

export const Uint8 = buildSerializableNumberPrimitive(
  1,
  (bytestream) => bytestream.view.getUint8(bytestream.pos),
  (bytestream, value) => bytestream.view.setUint8(bytestream.pos, value)
);

export const Uint16 = buildSerializableNumberPrimitive(
  2,
  (bytestream) => bytestream.view.getUint16(bytestream.pos, bytestream.littleEndian),
  (bytestream, value) => bytestream.view.setUint16(bytestream.pos, value, bytestream.littleEndian)
);

export const Uint32 = buildSerializableNumberPrimitive(
  4,
  (bytestream) => bytestream.view.getUint32(bytestream.pos, bytestream.littleEndian),
  (bytestream, value) => bytestream.view.setUint32(bytestream.pos, value, bytestream.littleEndian)
);

export const Int8 = buildSerializableNumberPrimitive(
  1,
  (bytestream) => bytestream.view.getInt8(bytestream.pos),
  (bytestream, value) => bytestream.view.setInt8(bytestream.pos, value)
);

export const Int16 = buildSerializableNumberPrimitive(
  2,
  (bytestream) => bytestream.view.getInt16(bytestream.pos, bytestream.littleEndian),
  (bytestream, value) => bytestream.view.setInt16(bytestream.pos, value, bytestream.littleEndian)
);

export const Int32 = buildSerializableNumberPrimitive(
  4,
  (bytestream) => bytestream.view.getInt32(bytestream.pos, bytestream.littleEndian),
  (bytestream, value) => bytestream.view.setInt32(bytestream.pos, value, bytestream.littleEndian)
);

export const Float32 = buildSerializableNumberPrimitive(
  4,
  (bytestream) => bytestream.view.getFloat32(bytestream.pos, bytestream.littleEndian),
  (bytestream, value) => bytestream.view.setFloat32(bytestream.pos, value, bytestream.littleEndian)
);

export const Float64 = buildSerializableNumberPrimitive(
  8,
  (bytestream) => bytestream.view.getFloat64(bytestream.pos, bytestream.littleEndian),
  (bytestream, value) => bytestream.view.setFloat64(bytestream.pos, value, bytestream.littleEndian)
);
