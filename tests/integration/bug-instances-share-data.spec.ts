import {
  Uint8,
  Uint16,
  SerializableNumber,
  Serializable,
  SerializableClass,
  AppendableByteStream
} from '../../src/index';

@SerializableClass({ littleEndian: true })
class ExampleClass implements Serializable {
  @SerializableNumber(Uint8)
  public testByte: number = 0;

  @SerializableNumber(Uint16)
  public testUShort: number = 0;

  @SerializableNumber(Uint8)
  public secondTestByte: number = 0;

  constructor(byte: number = 0, ushort: number = 0, secondByte: number = 0) {}

  public init(byte: number = 0, ushort: number = 0, secondByte: number = 0) {
    this.testByte = byte;
    this.testUShort = ushort;
    this.secondTestByte = secondByte;
  }

  public serialize(): Uint8Array {
    throw new Error('Method not implemented.');
  }

  public deserialize(bytes: AppendableByteStream | Uint8Array): void {
    throw new Error('Method not implemented.');
  }
}

describe('Bug: Multiple instances should not share underlying data', () => {
  it('instances created with different values should not be equal', () => {
    const obj1 = new ExampleClass(42, 2048, 5);
    const obj2 = new ExampleClass(5, 1, 10);
    expect(obj1).not.toEqual(obj2);
  });
});
