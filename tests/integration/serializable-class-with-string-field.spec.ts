import {
  AppendableByteStream,
  ByteArray,
  deserialize,
  Serializable,
  SerializableByteArray,
  SerializableClass,
  SerializableNumber,
  SerializableString,
  Uint16,
  Uint8
} from '../../src/index';

@SerializableClass({ littleEndian: true })
class ExampleClass implements Serializable {
  @SerializableString(4) // fixed-length 4
  public testString: string = '';

  constructor(string: string = '') {}

  public init(string: string = '') {
    this.testString = string;
  }

  public serialize(): Uint8Array {
    throw new Error('Method not implemented.');
  }

  public deserialize(bytes: AppendableByteStream | Uint8Array): void {
    throw new Error('Method not implemented.');
  }
}

describe('Serializable class with string-field', () => {
  it('object should serialize into Uint8Array', () => {
    const obj = new ExampleClass('TEST');
    const expectedBytes = new Uint8Array([0x54, 0x45, 0x53, 0x54]);

    const serialized = obj.serialize();
    expect(serialized).toEqual(expectedBytes);
  });

  it('deserialize should return object', () => {
    const bytes = new Uint8Array([0x54, 0x45, 0x53, 0x54]);
    const expectedObj = new ExampleClass('TEST');

    const obj = deserialize(bytes, ExampleClass);

    expect(obj).toEqual(expectedObj);
  });

  it('deserialize should respect length parameter return object', () => {
    const bytes = new Uint8Array([0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47]);
    const expectedObj = new ExampleClass('ABCD');

    const obj = deserialize(bytes, ExampleClass);
    expect(obj).toEqual(expectedObj);
  });
});
