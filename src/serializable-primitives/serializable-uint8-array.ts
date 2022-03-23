import { SerializablePrimitive } from './serializable-primitive';
import { AppendableByteStream } from '../serializable';

/**
 * serializable array of bytes (based upon uint8array)
 */
export class ByteArray extends SerializablePrimitive<Uint8Array> {
  constructor(data?: Uint8Array | AppendableByteStream, length?: number) {
    super(data ?? new Uint8Array(), length);
  }

  public get size(): number {
    return this.value.length;
  }

  public append(bytestream: AppendableByteStream): void {
    new Uint8Array(bytestream.view.buffer, bytestream.pos).set(this.value, 0);
    bytestream.pos += this.size;
  }

  protected readFromByteStream(bytestream: AppendableByteStream, length?: number): Uint8Array {
    //defaults to reading to end
    const data = new Uint8Array(bytestream.view.buffer, bytestream.pos, length);
    bytestream.pos = bytestream.pos + data.length;
    return data;
  }
}
