import { AppendableByteStream } from './appendable-byte-stream';
import { Serializable } from './serializable';

//TODO: restructure exports
export { Serializable } from './serializable';
export { AppendableByteStream } from './appendable-byte-stream';
export * from './serializable-primitives/index';
export * from './decorators/index';

export const deserialize = <T extends Serializable>(bytes: Uint8Array, type: { new (...args: any[]): T }): T => {
  const object = new type();
  object.deserialize(bytes);
  return object;
};
