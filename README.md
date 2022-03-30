# ts-byte-serializer

Easy-to-use binary (de)serializer for TypeScript.

Possible use-cases: implementation of low-level network protocols, storing/transmitting binary data

Currently supported types for (de)serialization:

- 8/16/32/64 Bit integer (signed and unsigned)
- arrays of bytes (= TypeScript Uint8Arrays) - any user-defined type implementing the Serializable-Interface

**Note:** This is an early version and the API is far from being stable.
Especially the names of Interfaces and Decorators may change in the future.
