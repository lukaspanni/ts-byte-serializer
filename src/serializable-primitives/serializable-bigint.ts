import { SerializablePrimitive } from './serializable-primitive';
import { isAppendableByteStream } from '../serializable';
import { AppendableByteStream } from '../appendable-byte-stream';

/**
 * Build a new class for a serializable bigint
 * @param size size of the byte-representation
 * @param getFun function to read a bigint from a bytestream
 * @param setFun function to append a bigint's byte-representations to a bytestream
 */
const buildSerializableBigintPrimitive = (
  size: number,
  getFun: (bytestream: AppendableByteStream) => bigint,
  setFun: (bytestream: AppendableByteStream, value: bigint) => void
): new (data?: bigint | AppendableByteStream) => SerializablePrimitive<bigint> => {
  return class SerializableBigIntPrimitive extends SerializablePrimitive<bigint> {
    public readonly size = size;
    protected _value: bigint;

    constructor(data?: bigint | AppendableByteStream) {
      super(data ?? BigInt(0));
      if (isAppendableByteStream(data)) this._value = this.readFromByteStream(data);
      else this._value = data as bigint;
    }

    public append(bytestream: AppendableByteStream): void {
      setFun(bytestream, this.value ?? 0);
      bytestream.pos += this.size;
    }

    protected readFromByteStream(bytestream: AppendableByteStream): bigint {
      const value = getFun(bytestream);
      bytestream.pos += this.size;
      return value;
    }
  };
};

export const Uint64 = buildSerializableBigintPrimitive(
  8,
  (bytestream) => bytestream.view.getBigUint64(bytestream.pos),
  (bytestream, value) => bytestream.view.setBigUint64(bytestream.pos, value)
);

export const Int64 = buildSerializableBigintPrimitive(
  8,
  (bytestream) => bytestream.view.getBigInt64(bytestream.pos),
  (bytestream, value) => bytestream.view.setBigInt64(bytestream.pos, value)
);
