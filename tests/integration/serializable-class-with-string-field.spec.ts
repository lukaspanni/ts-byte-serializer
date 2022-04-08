import {
  AppendableByteStream,
  ByteArray,
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

  constructor(string: string = '') {
    this.testString = string;
  }

  public serialize(): Uint8Array {
    throw new Error('Method not implemented.');
  }
  public deserialize(bytes: AppendableByteStream): void {
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

    const obj = new ExampleClass();
    obj.deserialize({ view: new DataView(bytes.buffer), pos: 0, littleEndian: true });
    expect(obj).toEqual(expectedObj);
  });

  it('deserialize should respect length parameter return object', () => {
    const bytes = new Uint8Array([0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47]);
    const expectedObj = new ExampleClass('ABCD');

    const obj = new ExampleClass();
    obj.deserialize({ view: new DataView(bytes.buffer), pos: 0, littleEndian: true });
    expect(obj).toEqual(expectedObj);
  });
});
