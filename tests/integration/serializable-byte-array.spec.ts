import {
  AppendableByteStream,
  ByteArray,
  Serializable,
  SerializableByteArray,
  SerializableClass,
  SerializableNumber,
  Uint16,
  Uint8
} from '../../src/index';

@SerializableClass({ littleEndian: true })
class ExampleClass implements Serializable {
  @SerializableByteArray()
  public testArray: Uint8Array = new Uint8Array();

  constructor(bytes: Uint8Array = new Uint8Array()) {
    this.testArray = bytes;
  }

  public serialize(): Uint8Array {
    throw new Error('Method not implemented.');
  }
  public deserialize(bytes: AppendableByteStream): void {
    throw new Error('Method not implemented.');
  }
}

@SerializableClass({ littleEndian: true })
class ExampleClass1 implements Serializable {
  @SerializableNumber(Uint16)
  public testUShort: number = 0;

  @SerializableByteArray()
  public testArray: Uint8Array = new Uint8Array();

  constructor(ushort: number = 0, bytes: Uint8Array = new Uint8Array()) {
    this.testUShort = ushort;
    this.testArray = bytes;
  }

  public serialize(): Uint8Array {
    throw new Error('Method not implemented.');
  }
  public deserialize(bytes: AppendableByteStream): void {
    throw new Error('Method not implemented.');
  }
}

describe('Serializable class with byteArray only', () => {
  it('object should serialize into Uint8Array', () => {
    const obj = new ExampleClass(new Uint8Array([0x00, 0x01, 0x02]));
    const expectedBytes = new Uint8Array([0x00, 0x01, 0x02]);

    const serialized = obj.serialize();
    expect(serialized).toEqual(expectedBytes);
  });

  it('deserialize should return object', () => {
    const bytes = new Uint8Array([0x00, 0x01, 0x02]);
    const expectedObj = new ExampleClass(new Uint8Array([0x00, 0x01, 0x02]));

    const obj = new ExampleClass();
    obj.deserialize({ view: new DataView(bytes.buffer), pos: 0, littleEndian: true });
    expect(obj).toEqual(expectedObj);
  });
});

describe('Serializable class with primitive and byteArray', () => {
  it('object should serialize into Uint8Array', () => {
    const obj = new ExampleClass1(42, new Uint8Array([0x00, 0x01, 0x02]));
    const expectedBytes = new Uint8Array([0x2a, 0x00, 0x00, 0x01, 0x02]);

    const serialized = obj.serialize();
    expect(serialized).toEqual(expectedBytes);
  });

  it('deserialize should return object', () => {
    const bytes = new Uint8Array([0x2a, 0x00, 0x00, 0x01, 0x02]);
    const expectedObj = new ExampleClass1(42, new Uint8Array([0x00, 0x01, 0x02]));

    const obj = new ExampleClass1();
    obj.deserialize({ view: new DataView(bytes.buffer), pos: 0, littleEndian: true });
    expect(obj).toEqual(expectedObj);
  });
});
