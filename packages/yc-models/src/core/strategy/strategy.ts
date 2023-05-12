import {
  address,
  EthersContract,
  EthersExecutor,
  EthersTransactionResponse,
  SignerMethod,
} from "../../types";
import { DBStrategy, JSONStep } from "../../types/db";
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
  //       FIELDS & GETTERS
  // =================================

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
  readonly creator: YCUser | null = null;

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
  readonly statistics: YCStatistic[] = [];

  /**
   * The current APY of this strategy
   */
  readonly apy: number;

  // Public getters/methods

  /**
   * Get the Total Value Locked Of The Strattegy
   */
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

  // ============
  //   METHODS
  // ============
  /**
   * Get the TVL of this vault in USD value - Async (quoting)
   * @param cache - whether to return cached values or not
   * @returns TVL in USD value
   */
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

  /**
   * Get the TVL of this vault in USD and raw values - Async (quoting)
   * @param cache - whether to return cached values or not
   * @returns raw TVL + usd TVL
   */
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

  /**
   * Get a user's shares of the vault
   * @param address - the address of the user
   * @param cache - whether to allow cached values to be returned
   * @returns The user's shares (bigint)
   */
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

  /**
   * Get a user's shares in USD value
   * @param address - the address of the user
   * @param rawShares - an amount of raw shares to quote, if you have it already adn want to avoi another JSON RPC call
   * @param cache - Whether to allow cached values
   * @returns the user's shares in USD value
   */
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

  /**
   * Get a user's both USD and raw values of their shares
   * @param address - The address of a user
   * @param cache - Whether to allow cached values
   * @returns both USD and raw values of the user's shares
   */
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

  /**
   * Get the vault's gas balance
   * @param cache - Whether to allow cached values to be returned
   * @returns The gas balance (bigint)
   */
  gasBalance = async (cache: boolean = true): Promise<bigint> => {
    return cache && this.#gasBalance
      ? this.#gasBalance
      : await this.#setGasBalance();
  };

  /**
   * Get the vault's gas balance in USD value
   * @param rawValue - Optional raw value to go off of to avoid another async op
   * @param cache - Whether to allw cached values to be returned
   * @returns USD value of the vault's gas balance
   */
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

  /**
   * Get the vault's gas balance in USD value & in raw values
   * @param cache - Whether to allw cached values to be returned
   * @returns USD and raw values of the vault's gas balance
   */
  gasBalanceAndUSD = async (
    cache: boolean = true
  ): Promise<{ balance: bigint; usdValue: number }> => {
    const balance = await this.gasBalance(cache);
    const usdValue = await this.gasBalanceUSD(balance, cache);
    return { balance, usdValue };
  };

  // -------
  // Onchain Write / Population Methods
  // -------

  /**
   * A function to deposit funds into the vault
   * @param amount - the amount of the depoisit token to deposit, can either be raw or formatted
   * @param signer - The signer method to use (either ethers signer or a callback, see the type)
   * @param approveAll - Whether to approve an infinite amount of tokens, or just the amount requested
   * @returns An ethers transaction response
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

  /**
   * Make a deposit without approvals (for with approvals, see fullDeposit)
   * @param amount - The amount of depisit tokens to deposit. raw or foramtted.
   * @param signer - The signer to use
   * @returns Ethers transactions response
   */
  deposit = async (
    amount: number | bigint,
    signer: SignerMethod
  ): Promise<EthersTransactionResponse | null> => {
    // Make sure the signer's chain ID matches the strategy's
    await this.network?.assertSignerChainID(signer);

    // Populate a deposit and sign it
    return await this.signTransaction(
      signer,
      await this.populateDeposit(this.depositToken.getParsed(amount), {
        from: this.getSigningAddress(signer),
      })
    );
  };

  /**
   * Withdraw shares out of the vault
   * @param amount - The amount to withdraw
   * @param signer - The signer to use
   * @returns Ethers.js transaction reesponse
   */
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

  /**
   * Populate a deposit transaction
   * @param amount - The amount to use
   * @param args Trasnsaction args
   * @returns TransactionRequest object
   */
  populateDeposit = async (
    amount: number | bigint,
    args: Partial<TransactionRequest> & { from: string }
  ) => {
    this.#assertDepositToken();

    return await this.contract.deposit.populateTransaction(amount, args);
  };

  /**
   *Popoulate a withdrawal transaction
   * @param amount - the amount to withdraw
   * @param args - trasnaction args
   * @returns - a TrasnactionRequest object
   */
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
    /**
     * Set static vars
     */
    super();
    this.id = _strategy.id;
    this.address = _strategy.address;
    this.title = _strategy.title;
    this.depositToken = _context.getToken(
      _strategy.deposit_token_id
    ) as YCToken;
    this.creator = _context.getUser(_strategy.creator_id) || null;
    this.rootStep = new YCStep(
      _strategy.steps as unknown as JSONStep,
      _context
    );
    this.verified = _strategy.verified;
    this.network = _context.getNetwork(_strategy.chain_id);
    this.contract = new Contract(
      getAddress(this.address),
      abi,
      this.network?.provider
    );
    this.executionInterval = _strategy.execution_interval;
    this.statistics = _context
      .getStrategyStats(this.id)
      .sort(
        (a, b) =>
          new Date(a.timestamp).valueOf() - new Date(b.timestamp).valueOf()
      );
    this.apy = this.statistics[this.statistics.length - 1].apy;
    this.#setTVL();
    this.#setGasBalance();

    // Return singleton ref for the strat
    const existingStrategy = this.getInstance(this.id);
    if (existingStrategy) return existingStrategy;
  }

  // ===================================
  //      INTERNAL FIELDS & METHODS
  // ===================================

  // Fetches the TVL From the strategy's contract and sets it
  #setTVL = async (retry: number = 0): Promise<bigint> => {
    if (retry >= 5) return 0n;
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
        this.network?.blockExplorer + `/address/${this.address}`,
        e,
        this.network?.provider._getConnection().url
      );

      if (retry < 5) return await this.#setTVL(retry + 1);

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

  getInstance = (id: string): YCStrategy | null => {
    // We try to find an existing instance of this user
    const existingUser = YCStrategy.instances.get(id);

    // If we have an existing user and it has the same fields as this one, we return the singleton of it
    if (existingUser) {
      if (this.compare(existingUser)) return existingUser;
    }

    YCStrategy.instances.set(id, this);

    return null;
  };

  // =================
  //   SINGLETON REF
  // =================
  static instances: Map<string, YCStrategy> = new Map();
}
