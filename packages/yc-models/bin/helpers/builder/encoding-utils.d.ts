import { Contract } from "ethers";
import { address, bytes } from "../../index.js";
export declare function encodeFixedYCCommand(arg: boolean | bigint | address, type: string): string;
export declare function encodeRefYCCommand<T = string>(arg: T | bytes, type: string): string;
export declare function abiDecodeYCCommand<T>(arg: bytes, type: string): T;
export declare function abiDecode<T>(arg: bytes, type: string): T;
export declare function interpretYCCommand<T>(arg: bytes, type: string, contract: Contract): Promise<T>;
