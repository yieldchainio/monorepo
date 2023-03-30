import { DBToken } from "../../types/db";
import { YCClassifications } from "../context/context";
import {
  BrowserProvider,
  Contract,
  ContractTransaction,
  ethers,
  Provider,
  TransactionRequest,
} from "ethers";
import { YCProtocol } from "../protocol/protocol";
import { YCNetwork } from "../network/network";
import { LiFi } from "../../clients/lifi";
import {
  EthersContract,
  EthersExecutor,
  EthersTransactionResponse,
  SignerMethod,
} from "../../types";
import erc20ABI from "../../ABIs/erc20.json" assert { type: "json" };
import { BaseWeb3Class } from "../base";

/**
 * @notice
 * YCToken
 * A class representing an on-chain token
 */
export class YCToken extends BaseWeb3Class {
  // =========================
  //       FIELDS/GETTERS
  // =========================
  #name: string;
  #id: string;
  #symbol: string;
  #address: string;
  #logo: string | null = null; // Init to null (Optional field)
  #decimals: number;
  #markets: YCProtocol[] = [];
  #native: boolean = false; // Init to false
  #network: YCNetwork | null;
  #contract: Contract;
  get name(): string {
    return this.#name;
  }
  get id(): string {
    return this.#id;
  }
  get symbol(): string {
    return this.#symbol;
  }
  get address(): string {
    return this.#address;
  }
  get logo(): string | null {
    return this.#logo;
  } // Init to null (Optional field)
  get decimals(): number {
    return this.#decimals;
  }
  get markets(): YCProtocol[] {
    return this.#markets;
  }
  get native(): boolean {
    return this.#native;
  } // Init to false
  get network(): YCNetwork | null {
    return this.#network;
  }

  // =======================
  //      CONSTRUCTOR
  // =======================
  constructor(
    _token: DBToken,
    _context: YCClassifications,
    _network?: YCNetwork
  ) {
    super();
    // Init static fields
    this.#name = _token.name;
    this.#id = _token.id;
    this.#symbol = _token.symbol;
    this.#network =
      _network && _network.chainid == _token.chain_id
        ? _network
        : _context.getNetwork(_token.chain_id);
    this.#address = ethers.getAddress(_token.address);
    this.#decimals = _token.decimals;
    this.#logo = _token.logo;
    this.#native = this.address == ethers.ZeroAddress ? true : false;
    this.#contract = new Contract(
      this.address,
      erc20ABI,
      this.network?.provider
    );

    // Getting the token's available "markets" (i.e protocols where the token is liquid)
    // let markets: Array<YCProtocol | null> = _token.markets.map(
    //   (protocolID: number) => _context.getProtocol(protocolID)
    // );

    // for (const marketOrNull of markets) {
    //   if (marketOrNull) this.#markets.push(marketOrNull);
    // }

    //
  }
  // =======================
  //        METHODS
  // =======================

  // Parse a formatted number by the decimals
  parseDecimals = (_number: string | number | bigint): bigint => {
    return ethers.parseUnits(_number.toString(), this.decimals);
  };

  // Format a number by the decimals
  formatDecimals = (_number: string | bigint): number => {
    return parseFloat(ethers.formatUnits(_number, this.decimals));
  };

  // Get a big number (either parse or return plain depending on type)
  getParsed = (value: number | bigint): bigint => {
    console.log("Value Got In get parsed", value, "typeof", typeof value);
    if (typeof value == "number") {
      console.log("Value returning", this.parseDecimals(value));
      return this.parseDecimals(value);
    }
    return value;
  };

  // Get a quote of an amount against USD
  quoteUSD = async (_amount: bigint): Promise<number> => {
    const singleQuote = await LiFi.getInstance().getUSDPrice(this);
    if (!singleQuote)
      throw new Error(
        "YCToken ERR: Cannot Get USD Price (Quote Failed!). Token ID: " +
          this.id
      );
    return singleQuote * this.formatDecimals(_amount);
  };

  // Quote 1 token against $ USD
  price = async (): Promise<number | null> => {
    return await LiFi.getInstance().getUSDPrice(this);
  };

  // Price against another token
  priceAgainstToken = async (_token: YCToken): Promise<number | null> => {
    return await LiFi.getInstance().getTokenPrice(this, _token);
  };

  // Check whether this token is liquid in a certain market (By ID)
  isInMarket = (_protocolID: string) => {
    return this.markets.some((market: YCProtocol) => market.id);
  };

  // ====================
  //   ONCHAIN METHODS
  // ====================

  // Approve some tokens
  approve = async (
    spender: string,
    amount: bigint,
    signer: SignerMethod
  ): Promise<EthersTransactionResponse> => {
    // Assert the chain ID to match ours
    if (signer instanceof EthersExecutor)
      this.network?.assertSameChainID(
        (await signer.provider?.getNetwork())?.chainId
      );

    // Populate an approval
    const approvaltxn = await this.populateApproval(amount, spender, {
      from: signer instanceof EthersExecutor ? signer.address : signer.from,
    });

    // Sign it
    return await this.signTransaction(signer, approvaltxn);
  };

  // Approve if allownace is insufficient
  safeApproval = async (
    spender: string,
    amount: bigint,
    signer: SignerMethod
  ): Promise<EthersTransactionResponse | true> => {
    // Only approve just enough for it to be sufficient ontop of existing allownace
    const amountToApprove =
      amount -
      (await this.#contract.allowance(
        signer instanceof EthersExecutor ? signer.address : signer.from,
        spender
      ));

    // Populate an approval
    const approvaltxn = await this.populateApproval(amountToApprove, spender, {
      from: signer instanceof EthersExecutor ? signer.address : signer.from,
    });

    if (amountToApprove > 0)
      return await this.signTransaction(signer, approvaltxn);

    return true;
  };

  /**
   * Transaction population methods,
   * @return Transaction req object
   */
  populateApproval = async (
    amount: bigint | number,
    spender: string,
    args: Partial<TransactionRequest> & { from: string }
  ): Promise<ContractTransaction> => {
    return await this.#contract.approve.populateTransaction(
      spender,
      this.getParsed(amount),
      args
    );
  };

  populateSafeApproval = async (
    amount: bigint | number,
    spender: string,
    args: Partial<TransactionRequest> & { from: string }
  ): Promise<ContractTransaction | true> => {
    // Only approve just enough for it to be sufficient ontop of existing allownace
    const amountToApprove =
      this.getParsed(amount) -
      (await this.#contract.allowance(args.from, spender, args));

    if (amountToApprove <= 0n) return true;
    return await this.populateApproval(amountToApprove, spender, args);
  };

  // ========================
  //    INTERNAL FUNCTIONS
  // ========================
}
