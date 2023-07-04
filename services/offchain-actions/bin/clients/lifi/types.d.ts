/**
 * Types for lifi client
 */
import { address, bytes } from "@yc/yc-models";
import { TransactionRequest } from "ethers";
export interface ToolConfiguration {
    allowBridges?: string[];
    denyBridges?: string[];
    preferBridges?: string[];
    allowExchanges?: string[];
    denyExchanges?: string[];
    preferExchanges?: string[];
}
export interface LifiQuoteRequest extends ToolConfiguration {
    fromChain: number | string;
    fromToken: string;
    fromAddress: string;
    fromAmount: string;
    toChain: number | string;
    toToken: string;
    toAddress?: string;
    order?: any;
    slippage?: number | string;
    integrator?: string;
    referrer?: string;
    fee?: number | string;
}
export type lifiQuoteRequestURL = `https://li.quest/v1/quote?fromChain=${number}&toChain=${number}&fromToken=${address}&toToken=${address}&fromAmount=${number}&fromAddress=${address}&integrator=${"yieldchain.io"}&denyExchanges=${string}`;
export interface FeeCost {
    name: string;
    description: string;
    percentage: string;
    amount: string;
    amountUSD?: string;
    included: boolean;
}
export type SwapDataStruct = {
    callTo: string;
    approveTo: string;
    sendingAssetId: string;
    receivingAssetId: string;
    fromAmount: bigint;
    callData: bytes;
    requiresDeposit: boolean;
};
export declare const SWAP_DATA_TUPLE = "tuple(address callTo, address approveTo, address sendingAssetId, address receivingAssetId, uint256 fromAmount, bytes callData, bool requiresDeposit)";
export interface GasCost {
    type: "SUM" | "APPROVE" | "SEND" | "FEE";
    price: string;
    estimate: string;
    limit: string;
    amount: string;
    amountUSD: string;
}
export interface Action {
    fromChainId: number;
    fromAmount: string;
    fromAddress?: string;
    toChainId: number;
    toAddress?: string;
    slippage: number;
}
export interface Estimate {
    tool: string;
    fromAmount: string;
    fromAmountUSD?: string;
    toAmount: string;
    toAmountMin: string;
    toAmountUSD?: string;
    approvalAddress: string;
    feeCosts?: FeeCost[];
    gasCosts?: GasCost[];
    executionDuration: number;
}
export declare const _StepType: readonly ["lifi", "swap", "cross", "protocol", "custom"];
export type StepType = (typeof _StepType)[number];
export type StepTool = string;
export interface StepBase {
    id: string;
    type: StepType;
    tool: StepTool;
    integrator?: string;
    referrer?: string;
    action: Action;
    estimate?: Estimate;
    transactionRequest?: TransactionRequest;
}
export interface DestinationCallInfo {
    toContractAddress: string;
    toContractCallData: string;
    toFallbackAddress: string;
    callDataGasLimit: string;
}
export type CallAction = Action & DestinationCallInfo;
export interface SwapStep extends StepBase {
    type: "swap";
    action: Action;
    estimate: Estimate;
}
export interface CrossStep extends StepBase {
    type: "cross";
    action: Action;
    estimate: Estimate;
}
export interface ProtocolStep extends StepBase {
    type: "protocol";
    action: Action;
    estimate: Estimate;
}
export interface CustomStep extends StepBase {
    type: "custom";
    action: CallAction;
    estimate: Estimate;
}
export type Step = SwapStep | CrossStep | CustomStep | ProtocolStep;
export interface LifiQuote extends Omit<Step, "type"> {
    type: "lifi";
    includedSteps: Step[];
}
