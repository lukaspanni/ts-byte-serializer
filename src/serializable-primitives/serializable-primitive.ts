import { AppendableByteStream, isAppendableByteStream, isSerializable, Serializable } from '../serializable';

/**
 * Generic base class for serializable primitives to serve as building blocks for complex serializable types
 */
export abstract class SerializablePrimitive<T> implements Serializable {
  protected constructor(data: T | AppendableByteStream, ...additionalReadArgs: any[]) {
    if (isAppendableByteStream(data)) this._value = this.readFromByteStream(data, ...additionalReadArgs);
    else this._value = data;
  }

  public abstract readonly size: number;
  protected _value: T;

  public get value(): T {
    return this._value;
  }

  public set value(newValue: T) {
    this._value = newValue;
  }

  public deserialize(bytestream: AppendableByteStream, thisArg?: any): void {
    this.value = this.readFromByteStream(bytestream, thisArg);
  }

  public abstract append(bytestream: AppendableByteStream): void;

  protected abstract readFromByteStream(bytestream: AppendableByteStream, thisArg?: any): T;

  public toJSON(): T | undefined {
    return this.value;
  }

  public serialize(): Uint8Array {
    const array = new Uint8Array(this.size);
    this.append({ view: new DataView(array.buffer), pos: 0 });
    return array;
  }
}

export const isSerializablePrimitive = (checkObject: any): checkObject is SerializablePrimitive<any> =>
  isSerializable(checkObject) && 'append' in checkObject;
