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
