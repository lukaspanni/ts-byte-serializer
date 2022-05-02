import { AppendableByteStream } from './appendable-byte-stream';

/**
 * A type that can be serialized to and deserialized from a bytestream
 */
export interface Serializable {
  serialize(): Uint8Array;

  deserialize(bytes: AppendableByteStream | Uint8Array): void;
}

export const isSerializable = (checkObject: any): checkObject is Serializable =>
  typeof checkObject === 'object' && 'serialize' in checkObject;

export const isAppendableByteStream = (checkObject: any): checkObject is AppendableByteStream =>
  typeof checkObject === 'object' && 'view' in checkObject && 'pos' in checkObject;

export const ensureCapacity = (view: DataView, capacity: number): DataView => {
  if (view.buffer.byteLength >= capacity) return view;
  const temporaryArray = new Uint8Array(capacity);
  temporaryArray.set(new Uint8Array(view.buffer), 0);
  return new DataView(temporaryArray.buffer);
};
