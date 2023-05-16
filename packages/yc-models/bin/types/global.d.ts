import { ContractTransaction, TransactionRequest } from "ethers";
import { EthersExecutor } from "./ethers";
export type uint256 = number;
export type uint = number;
export type bytes = string;
export type bytes32 = string;
export type bytes4 = string;
export type bytes5 = string;
export type bytes6 = string;
export type ABI = JSON;
export type address = `0x${string}`;
export type data = string;
export declare enum ChainID {
    Ethereum = 1,
    BinanceSmartChain = 56,
    Polygon = 137,
    Fantom = 250,
    Avalanche = 43114,
    Arbitrum = 42161
}
export type SignerMethod = EthersExecutor | (Partial<TransactionRequest> & {
    from: string;
    executionCallback: (req: ContractTransaction) => Promise<{
        hash: string;
    }>;
    chainID: number;
});
