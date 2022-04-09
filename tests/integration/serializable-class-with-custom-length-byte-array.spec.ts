import {
  AppendableByteStream,
  Serializable,
  SerializableByteArray,
  SerializableClass,
  SerializableNumber,
  Uint8
} from '../../src';

@SerializableClass({ littleEndian: true })
class ExampleClass implements Serializable {
  @SerializableByteArray(5)
  public testArray: Uint8Array = new Uint8Array();

  constructor(bytes: Uint8Array = new Uint8Array()) {}

  public init(bytes: Uint8Array = new Uint8Array()) {
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
  @SerializableNumber(Uint8)
  public arrayLength: number = 0;

  @SerializableByteArray('arrayLength')
  public testArray: Uint8Array = new Uint8Array();

  constructor(arrayLength: number = 0, bytes: Uint8Array = new Uint8Array()) {}

  public init(arrayLength: number = 0, bytes: Uint8Array = new Uint8Array()) {
    this.arrayLength = arrayLength;
    this.testArray = bytes;
  }

  public serialize(): Uint8Array {
    throw new Error('Method not implemented.');
  }

  public deserialize(bytes: AppendableByteStream): void {
    throw new Error('Method not implemented.');
  }
}

describe('Serializable class with fixed-length byteArray ', () => {
  it('object should serialize into Uint8Array', () => {
    const obj = new ExampleClass(new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04]));
    const expectedBytes = new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04]);

    const serialized = obj.serialize();
    expect(serialized).toEqual(expectedBytes);
  });

  it('deserialize should return object', () => {
    const bytes = new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04]);
    const expectedObj = new ExampleClass(new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04]));

    const obj = new ExampleClass();
    obj.deserialize({ view: new DataView(bytes.buffer), pos: 0, littleEndian: true });
    expect(obj).toEqual(expectedObj);
    expect(obj.testArray.length).toBe(5);
  });

  it('deserialize more bytes should return object with fixed length array', () => {
    const bytes = new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x0a]);
    const expectedObj = new ExampleClass(new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04]));

    const obj = new ExampleClass();
    obj.deserialize({ view: new DataView(bytes.buffer), pos: 0, littleEndian: true });
    expect(obj).toEqual(expectedObj);
    expect(obj.testArray.length).toBe(5);
  });

  it('instances created with different values should not be equal', () => {
    const obj1 = new ExampleClass(new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04]));
    const obj2 = new ExampleClass(new Uint8Array([0x04, 0x03, 0x02, 0x01, 0x00]));
    expect(obj1).not.toEqual(obj2);
  });
});

describe('Serializable class with dynamic-length byteArray ', () => {
  it('object should serialize into Uint8Array', () => {
    const obj = new ExampleClass1(3, new Uint8Array([0x00, 0x01, 0x02]));
    const expectedBytes = new Uint8Array([0x03, 0x00, 0x01, 0x02]);

    const serialized = obj.serialize();
    expect(serialized).toEqual(expectedBytes);
  });

  it('deserialize should return object', () => {
    const bytes = new Uint8Array([0x03, 0x00, 0x01, 0x02]);
    const expectedObj = new ExampleClass1(3, new Uint8Array([0x00, 0x01, 0x02]));

    const obj = new ExampleClass1();
    obj.deserialize({ view: new DataView(bytes.buffer), pos: 0, littleEndian: true });
    expect(obj).toEqual(expectedObj);
  });

  it('deserialize should respect dynamically specified array length', () => {
    const bytes = new Uint8Array([0x05, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x0a]);
    const expectedObj = new ExampleClass1(5, new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04]));

    const obj = new ExampleClass1();
    obj.deserialize({ view: new DataView(bytes.buffer), pos: 0, littleEndian: true });
    expect(obj).toEqual(expectedObj);
  });

  it('instances created with different values should not be equal', () => {
    const obj1 = new ExampleClass1(5, new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04]));
    const obj2 = new ExampleClass1(2, new Uint8Array([0x00, 0x01]));
    expect(obj1).not.toEqual(obj2);
  });
});
