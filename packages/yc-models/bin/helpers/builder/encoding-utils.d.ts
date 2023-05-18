import { address, bytes } from "../../index.js";
export declare function encodeFixedYCCommand(arg: boolean | bigint | address, type: string): string;
export declare function encodeRefYCCommand<T = string>(arg: T | bytes, type: string): string;
