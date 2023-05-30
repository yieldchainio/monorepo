import { DBToken } from "../../types/db.js";
import { YCClassifications } from "../context/context.js";
import { Contract, ContractTransaction, TransactionReceipt, TransactionRequest } from "ethers";
import { YCProtocol } from "../protocol/protocol.js";
import { YCNetwork } from "../network/network.js";
import { SignerMethod } from "../../types/index.js";
import { BaseClass } from "../base/index.js";
import { TokenTags } from "@prisma/client";
/**
 * @notice
 * YCToken
 * A class representing an on-chain token
 */
export declare class YCToken extends BaseClass {
    /**
     * The name of this token
     */
    readonly name: string;
    /**
     * The ID of this token (uuid)
     */
    readonly id: string;
    /**
     * The symbol of this token (e.g UNI, GMX, BTC, ETH)
     */
    readonly symbol: string;
    /**
     * The address of this token (e.g 0x00...000)
     */
    readonly address: string;
    /**
     * Decimals this token has, for formatting/parsing (e.g 18)
     */
    readonly decimals: number;
    /**
     * The logo of this token
     */
    readonly logo: string | null;
    /**
     * All of the different "markets" or "protocols" this token is available in
     */
    readonly markets: YCProtocol[];
    /**
     * Whether this is a native token or not (like ETH for ethereum)
     */
    readonly native: boolean;
    /**
     * The network this token is on
     */
    readonly network: YCNetwork | null;
    /**
     * A contract object for this token, optional
     */
    readonly contract: Contract;
    /**
     * Token tags
     */
    readonly tags: TokenTags[];
    constructor(_token: DBToken, _context: YCClassifications, _network?: YCNetwork);
    /**
     * Parse some formatted number into the raw number of tokens using it's decimals
     * @param _number  - the number to parse
     * @returns - the parsed number (bigint)
     */
    parseDecimals: (_number: string | number | bigint) => bigint;
    /**
     * Format a raw number of an amount of this token using its decimals
     * @param _number - The raw number (bigint / string)
     * @returns The formatted number
     */
    formatDecimals: (_number: string | bigint) => number;
    /**
     * Get the parsed value of either an already parsed number, or a formatted number.
     * Used by some functions as a shorthand so that they can accept both formatted and raw numbers
     * @param value - the value to aprse
     * @returns parsed value
     */
    getParsed: (value: number | bigint) => bigint;
    /**
     * Quote some amount of this token against USD
     * @param _amount - The amount to quote (RAW)
     * @returns
     */
    quoteUSD: (_amount: bigint) => Promise<number>;
    /**
     * The price of this token in USD (i.e 1 TOKEN === ? $USD)
     * @returns the price in USD of a single token
     */
    price: () => Promise<number | null>;
    /**
     * Price of this 1 token against another token
     * @param _token - The other token to quote against
     * @returns The price of 1 token against the inputted token
     */
    priceAgainstToken: (_token: YCToken) => Promise<number | null>;
    /**
     * Whether or not this token is present in some markets/protocols/exchanges,
     * @param _protocolID - The protocol ID to search for
     * @returns boolean, whether it exists there or not
     */
    isInMarket: (_protocolID: string) => boolean;
    /**
     * Send an approval transaction
     * @param spender - The address we are allowing to spend our tokens
     * @param amount - The amount to approve
     * @param signer - The signeing method to sign the transaction
     * @returns Ethers transaction response
     */
    approve: (spender: string, amount: bigint, signer: SignerMethod) => Promise<TransactionReceipt>;
    /**
     * Approves only the amount required to reach the desired allownace,
     * taking into account existing allowance between the parties
     * @param spender - The address we are allowing to spend our tokens
     * @param amount - The amount to approve
     * @param signer - The signeing method to sign the transaction
     * @returns Ethers transaction response
     */
    safeApproval: (spender: string, amount: bigint, signer: SignerMethod) => Promise<TransactionReceipt | true>;
    /**
     * Transaction population methods,
     * @return Transaction req object
     */
    /**
     * Populate an approval transaction
     * @param spender - The address we are allowing to spend our tokens
     * @param amount - The amount to approve
     * @param signer - The signeing method to sign the transaction
     * @returns TransactionRequest object
     */
    populateApproval: (amount: bigint | number, spender: string, args: Partial<TransactionRequest> & {
        from: string;
    }) => Promise<ContractTransaction>;
    /**
     * Populate a safe approval (only approve enough to reach desired allownace)
     * @param spender - The address we are allowing to spend our tokens
     * @param amount - The amount to approve
     * @param signer - The signeing method to sign the transaction
     * @returns TransactionRequest object
     */
    populateSafeApproval: (amount: bigint | number, spender: string, args: Partial<TransactionRequest> & {
        from: string;
    }) => Promise<ContractTransaction | true>;
    getInstance: (id: string) => YCToken | null;
    static instances: Map<string, YCToken>;
    toJSON: () => DBToken;
}
