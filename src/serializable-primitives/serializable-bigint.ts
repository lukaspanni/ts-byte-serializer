import { SerializablePrimitive } from './serializable-primitive';
import { AppendableByteStream, isAppendableByteStream } from '../serializable';

const buildSerializableBigintPrimitive = (
  size: number,
  getFun: (view: DataView, pos: number, littleEndian?: boolean) => bigint,
  setFun: (view: DataView, pos: number, value: bigint, littleEndian?: boolean) => void
): new (data: bigint | AppendableByteStream) => SerializablePrimitive<bigint> => {
  return class SerializableBigIntPrimitive extends SerializablePrimitive<bigint> {
    public readonly size = size;
    protected _value: bigint;

    constructor(data: bigint | AppendableByteStream) {
      super(data);
      if (isAppendableByteStream(data)) this._value = this.readFromByteStream(data);
      else this._value = data as bigint;
    }

    public append(bytestream: AppendableByteStream): void {
      setFun(bytestream.view, bytestream.pos, this.value ?? 0, bytestream.littleEndian);
      bytestream.pos += this.size;
    }

    protected readFromByteStream(bytestream: AppendableByteStream): bigint {
      const value = getFun(bytestream.view, bytestream.pos, bytestream.littleEndian);
      bytestream.pos += this.size;
      return value;
    }
  };
};

export const Uint64 = buildSerializableBigintPrimitive(
  8,
  (view, pos) => view.getBigUint64(pos),
  (view, pos, value) => view.setBigUint64(pos, value)
);

export const Int64 = buildSerializableBigintPrimitive(
  8,
  (view, pos) => view.getBigInt64(pos),
  (view, pos, value) => view.setBigInt64(pos, value)
);
