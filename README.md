# ts-byte-serializer

<a href="https://www.npmjs.com/package/ts-byte-serializer"><img src="https://badgen.net/npm/v/ts-byte-serializer" alt="Version"></a>
<a href="https://www.npmjs.com/package/ts-byte-serializer"><img src="https://badgen.net/npm/dt/ts-byte-serializer" alt="Downloads"></a>
<a href="https://www.npmjs.com/package/ts-byte-serializer"><img src="https://badgen.net/npm/license/ts-byte-serializer" alt="License"></a>

Easy-to-use binary (de)serializer for TypeScript.

Possible use-cases: implementation of low-level network protocols, storing/transmitting binary data

Currently supported types for (de)serialization:

- 8/16/32/64 Bit integer (signed and unsigned)
- 32 and 64 Bit float
- arrays of bytes (= TypeScript Uint8Arrays)
- any user-defined type implementing the Serializable-Interface

## Usage

The following example shows how to use ts-byte-serializer to implement a simple serializable class.

```typescript
// The SerializableClass-Decorator makes this class serializable; endianness defaults to big, but can be set to little with this parameter
// The Decorator auto-generates a serialize and a deserialize method, the interface and its methods are only used to let the type-system know that this methods exist
@SerializableClass({ littleEndian: true })
class ExampleClass implements Serializable {
  // Decorator SerializableNumber ensures this property is included in the serialized output
  // As JavaScript/TypeScript does not support specific number types, a number type from ts-binary-serializer has to be specified (here: Uint8)
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

  // This methods do not have to be implemented.
  // The SerializableClass-Decorator will provide a suitable implementation
  public serialize(): Uint8Array {
    throw new Error('Method not implemented.');
  }
  public deserialize(bytes: AppendableByteStream | Uint8Array): void {
    throw new Error('Method not implemented.');
  }
}
```

This class can be serialized like this:

```typescript
const obj = new ExampleClass(42, 2048, 131_072, BigInt(4_000_000_000));
const serialized = obj.serialize();
```

The deserialization uses the helper method `deserialize` which takes the raw bytes and the target type:

```typescript
const bytes = new Uint8Array([
  0x81, 0x88, 0x27, 0xb3, 0xa7, 0x2f, 0x00, 0x2a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
]);

const obj = deserialize(bytes, ExampleClass);
```

**Note**: Deserialization currently works using a empty object and filling it with data.
This is probably not the greatest solution, but the best one I could find so far.
If you can think of any other way of dealing with this please let me know.

Examples for more complex applications can also be found in the integration tests `/tests/integration/`
