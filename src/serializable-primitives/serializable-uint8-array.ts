import { SerializablePrimitive } from './serializable-primitive';
import { AppendableByteStream } from '../serializable';

/**
 * serializable array of bytes (based upon uint8array)
 */
export class ByteArray extends SerializablePrimitive<Uint8Array> {
  constructor(data?: Uint8Array | AppendableByteStream, private lengthParameter?: number | string) {
    super(data ?? new Uint8Array());
  }

  public get size(): number {
    return this.value.length;
  }

  public append(bytestream: AppendableByteStream): void {
    new Uint8Array(bytestream.view.buffer, bytestream.pos).set(this.value, 0);
    bytestream.pos += this.size;
  }

  protected readFromByteStream(bytestream: AppendableByteStream, thisArg: any): Uint8Array {
    //defaults to reading to end
    let length: number | undefined;
    if (typeof this.lengthParameter === 'number') length = this.lengthParameter;
    else if (typeof this.lengthParameter === 'string') length = thisArg[this.lengthParameter];

    const data = new Uint8Array(bytestream.view.buffer, bytestream.pos, length);
    bytestream.pos = bytestream.pos + data.length;
    return data;
  }
}
