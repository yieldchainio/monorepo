/**
 * Remove the 0x prefix on bytes
 */

import { bytes } from "../../types";

export function remove0xPrefix(arg: bytes) {
  return arg.slice(2, arg.length);
}
