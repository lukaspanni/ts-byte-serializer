import {
  AppendableByteStream,
  ByteArray,
  deserialize,
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

  constructor(bytes: Uint8Array = new Uint8Array()) {}

  public init(bytes: Uint8Array = new Uint8Array()) {
    this.testArray = bytes;
  }

  public serialize(): Uint8Array {
    throw new Error('Method not implemented.');
  }

  public deserialize(bytes: AppendableByteStream | Uint8Array): void {
    throw new Error('Method not implemented.');
  }
}

@SerializableClass({ littleEndian: true })
class ExampleClass1 implements Serializable {
  @SerializableNumber(Uint16)
  public testUShort: number = 0;

  @SerializableByteArray()
  public testArray: Uint8Array = new Uint8Array();

  constructor(ushort: number = 0, bytes: Uint8Array = new Uint8Array()) {}

  public init(ushort: number = 0, bytes: Uint8Array = new Uint8Array()) {
    this.testUShort = ushort;
    this.testArray = bytes;
  }

  public serialize(): Uint8Array {
    throw new Error('Method not implemented.');
  }

  public deserialize(bytes: AppendableByteStream | Uint8Array): void {
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

    const obj = deserialize(bytes, ExampleClass);
    expect(obj).toEqual(expectedObj);
  });

  it('instances created with different values should not be equal', () => {
    const obj1 = new ExampleClass(new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06]));
    const obj2 = new ExampleClass(new Uint8Array([0x00, 0x01, 0x02]));
    expect(obj1).not.toEqual(obj2);
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

    const obj = deserialize(bytes, ExampleClass1);
    expect(obj).toEqual(expectedObj);
  });

  it('instances created with different values should not be equal', () => {
    const obj1 = new ExampleClass1(10, new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06]));
    const obj2 = new ExampleClass1(15, new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06]));
    expect(obj1).not.toEqual(obj2);
  });
});
