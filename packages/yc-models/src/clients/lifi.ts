import { YCToken } from "../core/token/token";
import axios from "axios";
import { ethers } from "ethers";

export class LiFi {
  // ====================
  //    PRIVATE FIELDS
  // ====================
  #apiURL: string;

  // ====================
  //     SINGLETON
  // ====================
  static instance: LiFi;

  static getInstance = () => {
    if (!this.instance) this.instance = new LiFi();
    return this.instance;
  };

  // ====================
  //     CONSTRUCTOR
  // ====================
  constructor() {
    this.#apiURL = "https://li.quest/v1";
  }

  // ====================
  //     READ METHODS
  // ====================

  // Get full token info
  tokenInfo = async (_token: YCToken): Promise<TokenInfo | null> => {
    let chainid = _token.network?.id;
    if (!chainid) return null;
    return await (
      await axios.get(
        this.#apiURL + `/token?chain=${chainid}&token=${_token.address}`
      )
    ).data;
  };

  // Get a USD Price of a token
  getUSDPrice = async (_token: YCToken): Promise<number | null> => {
    let info = await this.tokenInfo(_token);
    if (!info || !info.priceUSD) return null;
    return parseFloat(info.priceUSD);
  };

  // Get a quote
  getFullQuote = async (
    _fromToken: YCToken,
    _toToken: YCToken,
    _amount?: string,
    _sender?: string,
    _toChain?: number,
    _receiver?: string,
    _currentTry: number = 0
  ): Promise<FullQuoteResponse | null> => {
    let fromChainId = _fromToken.network?.id;
    let toChainId = _toToken.network?.id;
    if (!fromChainId || !toChainId) return null;

    let quote: FullQuoteResponse | null = null;

    // Sometimes the amount is too low and we gotta retry a couple of times
    try {
      quote = await (
        await axios.get(
          this.#apiURL +
            `/quote?fromChain=${fromChainId}&toChain=${toChainId}&fromToken=${
              _fromToken.address
            }&toToken=${_toToken.address}&fromAddress=${
              _sender || ethers.ZeroAddress
            }&toAddress=${
              _receiver || _sender || ethers.ZeroAddress
            }&fromAmount=${_amount || _fromToken.parseDecimals(1)}`
        )
      ).data;
    } catch (e: any) {
      if (_currentTry < 5)
        return this.getFullQuote(
          _fromToken,
          _toToken,
          _amount,
          _sender,
          _toChain,
          _receiver,
          _currentTry + 1
        );
    }

    return quote;
  };

  // Get price against another token
  getTokenPrice = async (
    _fromToken: YCToken,
    _toToken: YCToken
  ): Promise<number | null> => {
    // Quote of 1 fromToken => toToken
    let fullQuote: FullQuoteResponse | null = await this.getFullQuote(
      _fromToken,
      _toToken
    );
    if (fullQuote == null) return null;

    return parseFloat(fullQuote.estimate.toAmount);
  };
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

enum QuoteResType {
  SWAP = "swap",
  CROSS = "cross",
  LIFI = "lifi",
}
enum GasFeeTypes {
  SUM = "SUM",
  APPROVE = "APPROVE",
  SEND = "SEND",
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
  data: Record<any, any>; // TODO: Make a type for this?
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
