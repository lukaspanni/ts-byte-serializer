import {
  Uint8,
  Uint16,
  Uint32,
  SerializableNumber,
  SerializableObjectProperty,
  SerializableByteArray,
  SerializableClass,
  Serializable,
  AppendableByteStream,
  deserialize
} from '../../src/index';

@SerializableClass({ littleEndian: true })
class ExampleHeader implements Serializable {
  @SerializableNumber(Uint8)
  public type!: number;

  @SerializableNumber(Uint16)
  public sequenceNumber!: number;

  constructor(type: number = 0, sequenceNumber: number = 0) {}

  public init(type: number = 0, sequenceNumber: number = 0) {
    this.type = type;
    this.sequenceNumber = sequenceNumber;
  }

  serialize(): Uint8Array {
    throw new Error('Method not implemented.');
  }

  deserialize(bytes: AppendableByteStream | Uint8Array): void {
    throw new Error('Method not implemented.');
  }
}

@SerializableClass({ littleEndian: true })
class ExampleFrame implements Serializable {
  @SerializableObjectProperty(ExampleHeader)
  public header!: ExampleHeader;

  @SerializableNumber(Uint32)
  public payloadLength!: number;

  @SerializableByteArray('payloadLength')
  public payload!: Uint8Array;

  constructor(
    header: ExampleHeader = new ExampleHeader(),
    payloadLength: number = 0,
    payload: Uint8Array = new Uint8Array()
  ) {}

  public init(
    header: ExampleHeader = new ExampleHeader(),
    payloadLength: number = 0,
    payload: Uint8Array = new Uint8Array()
  ) {
    this.header = header;
    this.payloadLength = payloadLength;
    this.payload = payload;
  }

  serialize(): Uint8Array {
    throw new Error('Method not implemented.');
  }

  deserialize(bytes: AppendableByteStream | Uint8Array): void {
    throw new Error('Method not implemented.');
  }
}

describe('Complex serializable class with serializable object property', () => {
  it('object should serialize into Uint8Array', () => {
    const header = new ExampleHeader(10, 43);
    const obj = new ExampleFrame(header, 8, new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]));
    const expectedBytes = new Uint8Array([
      0x0a, 0x2b, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07
    ]);

    const serialized = obj.serialize();
    expect(serialized).toEqual(expectedBytes);
  });

  it('deserialize should return object', () => {
    const bytes = new Uint8Array([0x8a, 0x2c, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x02, 0x01]);
    const expectedObj = new ExampleFrame(new ExampleHeader(138, 44), 3, new Uint8Array([0x03, 0x02, 0x01]));

    const obj = deserialize(bytes, ExampleFrame);
    expect(obj).toEqual(expectedObj);
  });

  it('instances created with different values should not be equal', () => {
    const obj1 = new ExampleFrame(new ExampleHeader(138, 44), 3, new Uint8Array([0x03, 0x02, 0x01]));
    const obj2 = new ExampleFrame(new ExampleHeader(12, 44), 3, new Uint8Array([0x03, 0x02, 0x01]));
    expect(obj1).not.toEqual(obj2);
  });
});
