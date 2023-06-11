/**
 * Function to attempt getting some underlying contract according
 * to potentially unique contract IDs
 *
 * i.e, yc-diamond refers to the address of the diamond contract we deployed on a given network.
 * lending-adapter refers to the lending adapter address of a given protocol on a given network,
 * etc
 */
import { YCContract } from "../../../core/index.js";
import { JSONStep, address } from "../../../types/index.js";
export declare function tryGetUnderlyingContract(step: JSONStep, contract: YCContract, fallback?: address): address;
