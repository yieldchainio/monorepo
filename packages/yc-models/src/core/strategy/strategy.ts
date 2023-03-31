import {
  address,
  EthersContract,
  EthersExecutor,
  EthersTransactionResponse,
  SignerMethod,
} from "../../types";
import { DBStrategy, DBStep } from "../../types/db";
import { BaseClass, BaseWeb3Class } from "../base";
import { YCClassifications } from "../context/context";
import { YCNetwork } from "../network/network";
import { YCStep } from "../step/step";
import { YCToken } from "../token/token";
import { YCUser } from "../user/user";
import abi from "../../ABIs/strategy.json" assert { type: "json" };
import {
  BrowserProvider,
  Contract,
  getAddress,
  TransactionRequest,
} from "ethers";
import { YCStatistic } from "./statistic";

export class YCStrategy extends BaseClass {
  // =================================
  //      PUBLIC FIELDS & METHODS
  // =================================

  /**
   * Static fields
   */
  readonly address: address;
  readonly contract: EthersContract;
  readonly id: string;
  readonly title: string;
  readonly depositToken: YCToken;
  readonly creator: YCUser | null = null;
  readonly steps: YCStep[];
  readonly rawSteps: any[];
  readonly verified: boolean;
  readonly network: YCNetwork | null;
  readonly executionInterval: number;
  readonly statistics: YCStatistic[] = [];

  /**
   * Public getters/methods
   */

  // Get the TVL (raw)
  get tvl(): bigint {
    return this.#tvl;
  }

  /**
   * A function to format second-based intervals into units + their corresponding
   * values.
   *
   * e.g 124...44 == 2.2 Months
   */

  get formattedInterval(): {
    interval: number;
    unit:
      | "Days"
      | "Minutes"
      | "this.executionInterval"
      | "Months"
      | "Weeks"
      | "Years"
      | "Day"
      | "Minute"
      | "Second"
      | "Month"
      | "Week"
      | "Year"
      | "Hour"
      | "Hours";
  } {
    let minute = 60;
    let hour = 3600;
    let day = 86400;
    let week = 604800;
    let month = day * 30;

    if (this.executionInterval >= month) {
      const interval =
        parseFloat(
          (this.executionInterval / month).toFixed(1).toString().split(".")[1]
        ) > 0
          ? parseFloat((this.executionInterval / month).toFixed(1))
          : this.executionInterval / month;
      return {
        interval,
        unit: interval === 1 ? "Month" : "Months",
      };
    }
    if (this.executionInterval >= week) {
      const interval =
        parseFloat(
          (this.executionInterval / week).toFixed(1).toString().split(".")[1]
        ) > 0
          ? parseFloat((this.executionInterval / week).toFixed(1))
          : this.executionInterval / week;
      return {
        interval,
        unit: interval === 1 ? "Week" : "Weeks",
      };
    }
    if (this.executionInterval >= day) {
      const interval =
        parseFloat(
          (this.executionInterval / day).toFixed(1).toString().split(".")[1]
        ) > 0
          ? parseFloat((this.executionInterval / day).toFixed(1))
          : this.executionInterval / day;
      return {
        interval,
        unit: interval === 1 ? "Day" : "Days",
      };
    }
    if (this.executionInterval >= hour) {
      const interval: number =
        parseFloat(
          (this.executionInterval / hour).toFixed(1).toString().split(".")[1]
        ) > 0
          ? parseFloat((this.executionInterval / hour).toFixed(1))
          : this.executionInterval / hour;
      return {
        interval,
        unit: interval === 1 ? "Hour" : "Hours",
      };
    }
    if (this.executionInterval >= minute) {
      const interval =
        parseFloat(
          (this.executionInterval / minute).toFixed(1).toString().split(".")[1]
        ) > 0
          ? parseFloat((this.executionInterval / minute).toFixed(1))
          : this.executionInterval / minute;
      return {
        interval,
        unit: interval === 1 ? "Minute" : "Minutes",
      };
    } else {
      return {
        interval: this.executionInterval,
        unit: "this.executionInterval",
      };
    }
  }

  // Get the TVL in USD
  usdTVL = async (cache: boolean = true): Promise<number> => {
    const formatted =
      cache && this.#usdTVL
        ? this.#usdTVL
        : await this.depositToken?.quoteUSD(this.tvl);
    if (!formatted)
      throw new Error(
        "YCStrategy ERR: Cannot Get USD TVL - Invalid Value Received from YCToken. The Value: " +
          formatted +
          "Raw TVL: " +
          this.tvl
      );
    return formatted;
  };

  // Get both the TVL and the usd value of it
  tvlAndUSDValue = async (
    cache: boolean = true
  ): Promise<{ tvl: bigint; usdTVL: number }> => {
    // Get the TVL (either cached or cache it, unless specified otherwise)
    const tvl = this.tvl > 0n && cache ? this.tvl : await this.#setTVL();
    // Get the USD value of it
    const usdTVL = await this.usdTVL();
    return {
      tvl,
      usdTVL,
    };
  };

  // Get a user's shares
  userShares = async (
    address: string,
    cache: boolean = true
  ): Promise<bigint> => {
    const cachedShares = this.#usersToShares.get(address);

    const shares: bigint =
      cachedShares && cache
        ? cachedShares
        : await this.contract.userShares(getAddress(address));
    if (shares == undefined)
      throw new Error(
        "YCStrategy ERR: Cannot Retreive User's Shares - ethers.js error."
      );
    return shares;
  };

  // Get a user's shares in Usd
  userUSDShares = async (
    address: string,
    rawShares?: bigint,
    cache: boolean = true
  ): Promise<number> => {
    // Retreive the onchain shares and quote USD against our deposit token
    const usdShares = rawShares
      ? this.depositToken?.quoteUSD(rawShares)
      : this.depositToken?.quoteUSD(await this.userShares(address, cache));

    if (usdShares == undefined)
      throw new Error(
        "YCStrategy ERR: Cannot Retreive User's USD Shares - USD Value is invalid"
      );
    return usdShares;
  };

  // Get both the raw shares and USD shares
  userUSDAndRawShares = async (
    address: string,
    cache: boolean = true
  ): Promise<{ shares: bigint; usdValue: number }> => {
    const rawShares = await this.userShares(address, cache);
    const usdValue = await this.userUSDShares(address, rawShares, cache);
    return {
      shares: rawShares,
      usdValue: usdValue,
    };
  };

  // Get the gas balance
  gasBalance = async (cache: boolean = true): Promise<bigint> => {
    return cache && this.#gasBalance
      ? this.#gasBalance
      : await this.#setGasBalance();
  };

  // Get USD value of gas balance
  gasBalanceUSD = async (
    rawValue?: bigint,
    cache: boolean = true
  ): Promise<number> => {
    const balance = rawValue || (await this.gasBalance(cache));
    const usdValue = this.network?.nativeToken?.quoteUSD(balance);
    if (!usdValue)
      throw new Error(
        "YCStrategy ERR - Cannot get gas USD Value - network (or it's native token) is undefined"
      );
    return usdValue;
  };

  // Get both USD and raw gas values
  gasBalanceAndUSD = async (
    cache: boolean = true
  ): Promise<{ balance: bigint; usdValue: number }> => {
    const balance = await this.gasBalance(cache);
    const usdValue = await this.gasBalanceUSD(balance, cache);
    return { balance, usdValue };
  };

  /**
   * Write/Population Methods @Onchain
   */

  fullDeposit = async (
    amount: number | bigint,
    signer: SignerMethod,
    approveAll: boolean = false
  ): Promise<EthersTransactionResponse> => {
    this.#assertDepositToken();
    await this.network?.assertSignerChainID(signer);
    // Populate an approval for the amount of tokens required for the operation (no more than that)
    const approvalTxn = approveAll
      ? await this.depositToken.populateApproval(amount, this.address, {
          from: this.getSigningAddress(signer),
        })
      : await this.depositToken?.populateSafeApproval(amount, this.address, {
          from: this.getSigningAddress(signer),
        });

    // Populate a deposit
    const depositTxn = await this.populateDeposit(
      this.depositToken.getParsed(amount),
      {
        from: this.getSigningAddress(signer),
      }
    );

    // Call both (or just deposit if allownace is sufficient) and return the receipt
    const txns =
      approvalTxn === true ? [depositTxn] : [approvalTxn, depositTxn];

    return (await this.signTransactions(signer, txns))[1];
  };

  deposit = async (
    amount: number | bigint,
    signer: SignerMethod
  ): Promise<EthersTransactionResponse | null> => {
    // Make sure the signer's chain ID matches the strategy's
    await this.network?.assertSignerChainID(signer);

    // Populate a deposit and sign it
    console.log("Amount gonna send", this.depositToken.getParsed(amount));
    return await this.signTransaction(
      signer,
      await this.populateDeposit(this.depositToken.getParsed(amount), {
        from: this.getSigningAddress(signer),
      })
    );
  };

  withdraw = async (
    amount: bigint,
    signer: SignerMethod
  ): Promise<EthersTransactionResponse | null> => {
    // Make sure the signer's chain ID matches the strategy's
    await this.network?.assertSignerChainID(signer);

    // Sign the transaction from the population
    return await this.signTransaction(
      signer,
      await this.populateWithdrawal(amount, {
        from: this.getSigningAddress(signer),
      })
    );
  };

  /**
   * Population for our transactions,
   * some consumers may not be compatible with our versions,
   * we allow to simply populate a transaction object which can be signed with any provider
   */
  // Populate a plain deposit
  populateDeposit = async (
    amount: number | bigint,
    args: Partial<TransactionRequest> & { from: string }
  ) => {
    this.#assertDepositToken();

    console.log("Amount got", amount, "Args", args);
    return await this.contract.deposit.populateTransaction(amount, args);
  };

  // Populate a plain withdrawl
  populateWithdrawal = async (
    amount: number | bigint,
    args: Partial<TransactionRequest> & { from: string }
  ) => {
    // Make sure the deposit token exists
    this.#assertDepositToken();

    // Assert the user's shares to be sufficient to the inputted amount
    await this.#assertUserShares(
      args.from || "",
      this.depositToken.getParsed(amount)
    );

    // Populate the transaction object & return it
    return await this.contract.deposit.populateTransaction(args);
  };

  // =================
  //   CONSTRUCTOR
  // =================
  constructor(_strategy: DBStrategy, _context: YCClassifications) {
    super();
    this.id = _strategy.id;
    this.address = _strategy.address;
    this.title = _strategy.title;
    this.depositToken = _context.getToken(
      _strategy.deposit_token_id
    ) as YCToken;
    this.creator = _context.getUser(_strategy.creator_id) || null;
    this.steps = _strategy.steps.map(
      (step) => new YCStep(step as unknown as DBStep, _context)
    );
    this.verified = _strategy.verified;
    this.network = _context.getNetwork(_strategy.chain_id);
    this.rawSteps = _strategy.steps;
    this.contract = new Contract(
      getAddress(this.address),
      abi,
      this.network?.provider
    );

    this.executionInterval = _strategy.execution_interval;

    this.statistics = _context
      .getStrategyStats(this.id)
      .sort((a, b) => a.timestamp.valueOf() - b.timestamp.valueOf());
    this.#setTVL();
    this.#setGasBalance();
  }

  // ===================================
  //      INTERNAL FIELDS & METHODS
  // ===================================

  // Fetches the TVL From the strategy's contract and sets it
  #setTVL = async (): Promise<bigint> => {
    try {
      // Get the data from our contract object
      const tvl: bigint = await this.contract.totalVaultShares();

      // Set the global field
      if (tvl) this.#tvl = tvl;

      // Return the TVL
      return tvl;
    } catch (e) {
      console.error(
        "Caught error with ethers TVL. Strategy Link:",
        this.network?.blockExplorer + `/address/${this.address}`
      );

      // We return 0 if an error was caught
      return 0n;
    }
  };

  // Fethces the strategy's gas balance and sets it
  #setGasBalance = async (): Promise<bigint> => {
    const balance: bigint | undefined = await this.network?.provider.getBalance(
      this.address
    );
    if (balance == undefined)
      throw new Error("YCStrategy ERR - Cannot get balance (Got undefined).");
    this.#gasBalance = balance;
    return balance;
  };

  // ====================
  //       CACHE
  // ====================
  // The total value locked of the strategy
  #tvl: bigint = 0n;
  // TVL in USD Value
  #usdTVL: number | undefined;
  // The shares of users
  #usersToShares: Map<string, bigint> = new Map();
  // The gas balance of the strategy // TODO: Make this actual gas balance once implemented
  #gasBalance: bigint = 0n;

  // ============================
  //      ERRORS / ASSERTIONS
  // ============================

  #assertUserShares = async (userAddress: string, amount: bigint) => {
    const userShares = await this.contract.userShares(userAddress);
    this.assert(
      userShares && userShares >= amount,
      "YCStrategy ERR: Insufficient Shares For Inputted Amount. Shares: " +
        userShares +
        ", Inputted Amount: " +
        amount
    );
  };

  #assertDepositToken = (_token?: YCToken): _token is YCToken => {
    if (!this.depositToken)
      throw new Error(
        "YCStrategy ERR: Deposit Token Non Existant! Did you complete deploying the strategy? ID: " +
          this.id
      );

    return _token instanceof YCToken;
  };
}
