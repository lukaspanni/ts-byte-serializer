import {
  Uint8,
  Uint16,
  Uint32,
  SerializableNumber,
  Uint64,
  Serializable,
  SerializableClass,
  AppendableByteStream
} from '../../src/index';
import { Float32, Float64 } from '../../src/serializable-primitives/serializable-number';

@SerializableClass({ littleEndian: true })
class ExampleClass implements Serializable {
  @SerializableNumber(Uint8)
  public testByte: number = 0;

  @SerializableNumber(Uint16)
  public testUShort: number = 0;

  @SerializableNumber(Uint32)
  public testUInt: number = 0;

  @SerializableNumber(Uint64)
  public testULong: bigint = BigInt(0);

  @SerializableNumber(Float32)
  public testFloat: number = 0.0;

  @SerializableNumber(Float64)
  public testDouble: number = 0.0;

  constructor(
    byte: number = 0,
    ushort: number = 0,
    uint: number = 0,
    ulong: bigint = BigInt(0),
    float: number = 0.0,
    double: number = 0.0
  ) {
    this.testByte = byte;
    this.testUShort = ushort;
    this.testUInt = uint;
    this.testULong = ulong;
    this.testFloat = float;
    this.testDouble = double;
  }

  public serialize(): Uint8Array {
    throw new Error('Method not implemented.');
  }
  public deserialize(bytes: AppendableByteStream): void {
    throw new Error('Method not implemented.');
  }
}

describe('Serializable class with primitives only', () => {
  it('object should serialize into Uint8Array', () => {
    const obj = new ExampleClass(42, 2048, 131_072, BigInt(4_000_000_000), 13.42, 15.123);
    const expectedBytes = new Uint8Array([
      0x2a, 0x00, 0x08, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0xee, 0x6b, 0x28, 0x00, 0x52, 0xb8, 0x56, 0x41,
      0xe5, 0xd0, 0x22, 0xdb, 0xf9, 0x3e, 0x2e, 0x40
    ]);

    const serialized = obj.serialize();
    expect(serialized).toEqual(expectedBytes);
  });

  it('deserialize should return object', () => {
    const bytes = new Uint8Array([
      0x81, 0x88, 0x27, 0xb3, 0xa7, 0x2f, 0x00, 0x2a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x52, 0xb8, 0x56, 0x41,
      0xe5, 0xd0, 0x22, 0xdb, 0xf9, 0x3e, 0x2e, 0x40
    ]);
    const expectedObj = new ExampleClass(129, 10_120, 3_123_123, BigInt(42), 13.42, 15.123);

    //TODO: allow deserialize with Uint8Array directly
    const obj = new ExampleClass();
    //TODO: add deserialize function that returns an object
    obj.deserialize({ view: new DataView(bytes.buffer), pos: 0, littleEndian: true });
    expect(obj).toEqual(expectedObj);
  });
});
