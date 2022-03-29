import { Serializable as ISerializable, AppendableByteStream } from '../../src/serializable';
import { Serializable } from '../../src/decorators/serializable';
import { Uint8, Uint16, Uint32, SerializableNumber, Uint64 } from '../../src/index';

@Serializable({ littleEndian: true })
class ExampleClass implements ISerializable {
  @SerializableNumber(Uint8)
  public testByte: number = 0;

  @SerializableNumber(Uint16)
  public testUShort: number = 0;

  @SerializableNumber(Uint32)
  public testUInt: number = 0;

  @SerializableNumber(Uint64)
  public testULong: bigint = BigInt(0);

  constructor(byte: number = 0, ushort: number = 0, uint: number = 0, ulong: bigint = BigInt(0)) {
    this.testByte = byte;
    this.testUShort = ushort;
    this.testUInt = uint;
    this.testULong = ulong;
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
    const obj = new ExampleClass(42, 2048, 131_072, BigInt(4_000_000_000));
    const expectedBytes = new Uint8Array([
      0x2a, 0x00, 0x08, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0xee, 0x6b, 0x28, 0x00
    ]);

    const serialized = obj.serialize();
    expect(serialized).toEqual(expectedBytes);
  });

  it('deserialize should return object', () => {
    const bytes = new Uint8Array([
      0x81, 0x88, 0x27, 0xb3, 0xa7, 0x2f, 0x00, 0x2a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ]);
    const expectedObj = new ExampleClass(129, 10_120, 3_123_123, BigInt(42));

    //TODO: allow deserialize with Uint8Array directly
    const obj = new ExampleClass();
    //TODO: add deserialize function that returns an object
    obj.deserialize({ view: new DataView(bytes.buffer), pos: 0, littleEndian: true });
    expect(obj).toEqual(expectedObj);
  });
});
