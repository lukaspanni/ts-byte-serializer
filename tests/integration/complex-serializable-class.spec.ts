import {
  Uint8,
  Uint16,
  Uint32,
  SerializableNumber,
  SerializableObjectProperty,
  SerializableByteArray,
  SerializableClass,
  Serializable,
  AppendableByteStream
} from '../../src/index';

@SerializableClass({ littleEndian: true })
class ExampleHeader implements Serializable {
  @SerializableNumber(Uint8)
  public type: number;

  @SerializableNumber(Uint16)
  public sequenceNumber: number;

  constructor(type: number = 0, sequenceNumber: number = 0) {
    this.type = type;
    this.sequenceNumber = sequenceNumber;
  }

  serialize(): Uint8Array {
    throw new Error('Method not implemented.');
  }
  deserialize(bytes: AppendableByteStream): void {
    throw new Error('Method not implemented.');
  }
}

@SerializableClass({ littleEndian: true })
class ExampleFrame implements Serializable {
  @SerializableObjectProperty(ExampleHeader)
  public header: ExampleHeader;

  @SerializableNumber(Uint32)
  public payloadLength: number;

  @SerializableByteArray('payloadLength')
  public payload: Uint8Array;

  constructor(
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
  deserialize(bytes: AppendableByteStream): void {
    throw new Error('Method not implemented.');
  }
}

describe('Complex serializable class with serializable object property', () => {
  it('object should serialize into Uint8Array', () => {
    const obj = new ExampleFrame(
      new ExampleHeader(10, 43),
      8,
      new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07])
    );
    const expectedBytes = new Uint8Array([
      0x0a, 0x2b, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07
    ]);

    const serialized = obj.serialize();
    expect(serialized).toEqual(expectedBytes);
  });

  it('deserialize should return object', () => {
    const bytes = new Uint8Array([0x8a, 0x2c, 0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x02, 0x01]);
    const expectedObj = new ExampleFrame(new ExampleHeader(138, 44), 3, new Uint8Array([0x03, 0x02, 0x01]));

    const obj = new ExampleFrame();
    obj.deserialize({ view: new DataView(bytes.buffer), pos: 0, littleEndian: true });
    expect(obj).toEqual(expectedObj);
  });

  it('multiple instances should be able to have different values', () => {
    const obj1 = new ExampleFrame(new ExampleHeader(138, 44), 3, new Uint8Array([0x03, 0x02, 0x01]));
    const obj2 = new ExampleFrame(new ExampleHeader(12, 13), 0);
    expect(obj1).not.toEqual(obj2);
  });
});
