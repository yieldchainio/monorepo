/**
 * Types for lifi client
 */

import { address, bytes } from "@yc/yc-models";
import { TransactionRequest } from "ethers";

// ==============================
//      YC / Action Related
// ==============================

// =======================
//      EXTERNAL API
// ======================

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

export type lifiQuoteRequestURL =
  `https://li.quest/v1/quote?fromChain=${number}&toChain=${number}&fromToken=${address}&toToken=${address}&fromAmount=${number}&integrator=${"yieldchain.io"}`;

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

export const SWAP_DATA_TUPLE =
  "tuple(address callTo, address approveTo, address sendingAssetId, address receivingAssetId, uint256 fromAmount, bytes callData, bool requiresDeposit)";

export interface GasCost {
  type: "SUM" | "APPROVE" | "SEND" | "FEE";
  price: string; // suggested current standard price for chain
  estimate: string; // estimate how much gas will be needed
  limit: string; // suggested gas limit (estimate +25%)
  amount: string; // estimate * price = amount of tokens that will be needed
  amountUSD: string; // usd value of token amount
}

// ACTION
export interface Action {
  fromChainId: number;
  fromAmount: string;
  fromAddress?: string;

  toChainId: number;
  toAddress?: string;

  slippage: number;
}

// ESTIMATE
export interface Estimate {
  tool: string;
  fromAmount: string;
  fromAmountUSD?: string;
  toAmount: string;
  toAmountMin: string;
  toAmountUSD?: string;
  approvalAddress: string;

  feeCosts?: FeeCost[];
  gasCosts?: GasCost[]; // This is a list to account for approval gas costs and transaction gas costs. However, approval gas costs are not used at the moment

  executionDuration: number; // estimated duration in seconds
}

export const _StepType = [
  "lifi",
  "swap",
  "cross",
  "protocol",
  "custom",
] as const;
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
