/**
 * Convert ArrayBuffer to string ("utf-8").
 *
 * Code taken from <https://developers.google.com/web/updates/2014/08/Easier-ArrayBuffer-String-conversion-with-the-Encoding-API>.
 */
export function arrayBufferToString (buffer: ArrayBuffer) {
  // The decode() method takes a DataView as a parameter,
  // which is a wrapper on top of the ArrayBuffer.
  const dataView = new DataView(buffer);
  const decoder = new TextDecoder("utf-8");
  const decodedString = decoder.decode(dataView);

  return decodedString;
}

