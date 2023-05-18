import { SupportedYCNetwork } from "@yc/yc-models";
/**
 * Checks if an address is a YC strategy contract
 * @param address - The address to check
 * @param network - The network to check on
 * @returns Whether it is a YC strategy or not
 */
export declare const isRegisteredStrategy: (address: `0x${string}`, network: SupportedYCNetwork) => Promise<boolean>;
