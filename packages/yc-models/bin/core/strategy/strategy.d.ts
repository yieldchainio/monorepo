import { address, bytes, EthersContract, EthersTransactionResponse, SignerMethod } from "../../types/index.js";
import { DBStrategy } from "../../types/db.js";
import { BaseClass } from "../base/index.js";
import { YCClassifications } from "../context/context.js";
import { YCNetwork } from "../network/network.js";
import { YCStep } from "../step/step.js";
import { YCToken } from "../token/token.js";
import { YCUser } from "../user/user.js";
import { TransactionRequest } from "ethers";
import { YCStatistic } from "./statistic";
export declare class YCStrategy extends BaseClass {
    #private;
    /**
     * The address of this strategy (e.g 0x00...000)
     */
    readonly address: address;
    /**
     * A ethers.js contract instance of this strategy
     */
    readonly contract: EthersContract;
    /**
     * The ID of this strategy (uuid)
     */
    readonly id: string;
    /**
     * The title of this strategy (I.e "A Strategy For The Wicked")
     */
    readonly title: string;
    /**
     * The deposit token of this strategy
     */
    readonly depositToken: YCToken;
    /**
     * The creating user of this strategy
     */
    readonly creator: YCUser | null;
    /**
     * The root step of this strategy. A tree of all of the strategy's steps
     */
    readonly rootStep: YCStep;
    /**
     * Whether this strategy is verified or not
     */
    readonly verified: boolean;
    /**
     * The network this strategy is on
     */
    readonly network: YCNetwork | null;
    /**
     * The execution interval of this strategy (how often it automates)
     */
    readonly executionInterval: number;
    /**
     * The statistics about this strategy (APY, Gas fees, etc) - used for charting
     */
    readonly statistics: YCStatistic[];
    /**
     * The current APY of this strategy
     */
    readonly apy: number;
    /**
     * Get the Total Value Locked Of The Strattegy
     */
    get tvl(): bigint;
    /**
     * A function to format second-based intervals into units + their corresponding
     * values.
     *
     * e.g 124...44 == 2.2 Months
     */
    get formattedInterval(): {
        interval: number;
        unit: "Days" | "Minutes" | "Seconds" | "Months" | "Weeks" | "Years" | "Day" | "Minute" | "Second" | "Month" | "Week" | "Year" | "Hour" | "Hours";
    };
    static fromDeploymentCalldata(calldata: bytes, jsonStrategy: DBStrategy, signer: SignerMethod): Promise<YCStrategy | null>;
    /**
     * Get the TVL of this vault in USD value - Async (quoting)
     * @param cache - whether to return cached values or not
     * @returns TVL in USD value
     */
    usdTVL: (cache?: boolean) => Promise<number>;
    /**
     * Get the TVL of this vault in USD and raw values - Async (quoting)
     * @param cache - whether to return cached values or not
     * @returns raw TVL + usd TVL
     */
    tvlAndUSDValue: (cache?: boolean) => Promise<{
        tvl: bigint;
        usdTVL: number;
    }>;
    /**
     * Get a user's shares of the vault
     * @param address - the address of the user
     * @param cache - whether to allow cached values to be returned
     * @returns The user's shares (bigint)
     */
    userShares: (address: string, cache?: boolean) => Promise<bigint>;
    /**
     * Get a user's shares in USD value
     * @param address - the address of the user
     * @param rawShares - an amount of raw shares to quote, if you have it already adn want to avoi another JSON RPC call
     * @param cache - Whether to allow cached values
     * @returns the user's shares in USD value
     */
    userUSDShares: (address: string, rawShares?: bigint, cache?: boolean) => Promise<number>;
    /**
     * Get a user's both USD and raw values of their shares
     * @param address - The address of a user
     * @param cache - Whether to allow cached values
     * @returns both USD and raw values of the user's shares
     */
    userUSDAndRawShares: (address: string, cache?: boolean) => Promise<{
        shares: bigint;
        usdValue: number;
    }>;
    /**
     * Get the vault's gas balance
     * @param cache - Whether to allow cached values to be returned
     * @returns The gas balance (bigint)
     */
    gasBalance: (cache?: boolean) => Promise<bigint>;
    /**
     * Get the vault's gas balance in USD value
     * @param rawValue - Optional raw value to go off of to avoid another async op
     * @param cache - Whether to allw cached values to be returned
     * @returns USD value of the vault's gas balance
     */
    gasBalanceUSD: (rawValue?: bigint, cache?: boolean) => Promise<number>;
    /**
     * Get the vault's gas balance in USD value & in raw values
     * @param cache - Whether to allw cached values to be returned
     * @returns USD and raw values of the vault's gas balance
     */
    gasBalanceAndUSD: (cache?: boolean) => Promise<{
        balance: bigint;
        usdValue: number;
    }>;
    /**
     * A function to deposit funds into the vault
     * @param amount - the amount of the depoisit token to deposit, can either be raw or formatted
     * @param signer - The signer method to use (either ethers signer or a callback, see the type)
     * @param approveAll - Whether to approve an infinite amount of tokens, or just the amount requested
     * @returns An ethers transaction response
     */
    fullDeposit: (amount: number | bigint, signer: SignerMethod, approveAll?: boolean) => Promise<EthersTransactionResponse>;
    /**
     * Make a deposit without approvals (for with approvals, see fullDeposit)
     * @param amount - The amount of depisit tokens to deposit. raw or foramtted.
     * @param signer - The signer to use
     * @returns Ethers transactions response
     */
    deposit: (amount: number | bigint, signer: SignerMethod) => Promise<EthersTransactionResponse | null>;
    /**
     * Withdraw shares out of the vault
     * @param amount - The amount to withdraw
     * @param signer - The signer to use
     * @returns Ethers.js transaction reesponse
     */
    withdraw: (amount: bigint, signer: SignerMethod) => Promise<EthersTransactionResponse | null>;
    /**
     * Population for our transactions,
     * some consumers may not be compatible with our versions,
     * we allow to simply populate a transaction object which can be signed with any provider
     */
    /**
     * Populate a deposit transaction
     * @param amount - The amount to use
     * @param args Trasnsaction args
     * @returns TransactionRequest object
     */
    populateDeposit: (amount: number | bigint, args: Partial<TransactionRequest> & {
        from: string;
    }) => Promise<import("ethers").ContractTransaction>;
    /**
     *Popoulate a withdrawal transaction
     * @param amount - the amount to withdraw
     * @param args - trasnaction args
     * @returns - a TrasnactionRequest object
     */
    populateWithdrawal: (amount: number | bigint, args: Partial<TransactionRequest> & {
        from: string;
    }) => Promise<import("ethers").ContractTransaction>;
    constructor(_strategy: DBStrategy, _context: YCClassifications);
    getInstance: (id: string) => YCStrategy | null;
    static instances: Map<string, YCStrategy>;
}
