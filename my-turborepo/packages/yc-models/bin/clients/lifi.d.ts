import YCToken from "../core/token";
export default class LiFi {
    #private;
    static instance: LiFi;
    constructor();
    tokenInfo: (_token: YCToken) => Promise<TokenInfo | null>;
    getUSDPrice: (_token: YCToken) => Promise<number | null>;
    getFullQuote: (_fromToken: YCToken, _toToken: YCToken, _amount?: string, _sender?: string, _toChain?: number, _receiver?: string) => Promise<FullQuoteResponse | null>;
    getTokenPrice: (_fromToken: YCToken, _toToken: YCToken) => Promise<number | null>;
}
interface FullQuoteResponse {
    id: string;
    type: QuoteResType;
    tool: string;
    action: Action;
    estimate: Estimate;
    integrator?: string;
    referrer: string;
    execution: string;
    transactionRequest: string;
}
interface TokenInfo {
    address: string;
    symbol: string;
    decimals: number;
    chainId: number;
    name: string;
    coinKey?: string;
    priceUSD?: string;
    logoURI?: string;
}
declare enum QuoteResType {
    SWAP = "swap",
    CROSS = "cross",
    LIFI = "lifi"
}
declare enum GasFeeTypes {
    SUM = "SUM",
    APPROVE = "APPROVE",
    SEND = "SEND"
}
interface Action {
    fromChainId: number;
    toChainId: number;
    fromToken: TokenInfo;
    toToken: TokenInfo;
    slippage?: number;
}
interface Estimate {
    fromAmount: string;
    toAmount: string;
    toAmountMin: string;
    approvalAddress: string;
    feeCosts: FeeCosts;
    gasCosts: GasCosts;
    data: Record<any, any>;
}
interface FeeCosts {
    name: string;
    description?: string;
    percentage: string;
    token: TokenInfo;
    amount?: string;
    amountUSD: string;
}
interface GasCosts {
    type: GasFeeTypes;
    price?: string;
    estimate?: string;
    limit?: string;
    amount: string;
    amountUSD?: string;
    token: TokenInfo;
}
export {};
