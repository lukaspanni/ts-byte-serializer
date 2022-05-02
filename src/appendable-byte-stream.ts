/**
 * Represents a bytestream which allows appending more bytes using a DataView
 */
export class AppendableByteStream {
  constructor(public view: DataView, public pos: number = 0, public littleEndian: boolean = true) {}

  //TODO: add append functions
}
