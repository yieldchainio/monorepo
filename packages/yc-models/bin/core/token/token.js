import { YCClassifications } from "../context/context.js";
import { Contract, ethers, } from "ethers";
import { LiFi } from "../../clients/lifi/index.js";
import { EthersExecutor, } from "../../types/index.js";
import erc20ABI from "../../ABIs/erc20.json" assert { type: "json" };
import { BaseClass } from "../base/index.js";
/**
 * @notice
 * YCToken
 * A class representing an on-chain token
 */
class YCToken extends BaseClass {
    // ============
    //    FIELDS
    // ============
    /**
     * The name of this token
     */
    name;
    /**
     * The ID of this token (uuid)
     */
    id;
    /**
     * The symbol of this token (e.g UNI, GMX, BTC, ETH)
     */
    symbol;
    /**
     * The address of this token (e.g 0x00...000)
     */
    address;
    /**
     * Decimals this token has, for formatting/parsing (e.g 18)
     */
    decimals;
    /**
     * The logo of this token
     */
    logo = null; // Init to null (Optional field)
    /**
     * All of the different "markets" or "protocols" this token is available in
     */
    markets = [];
    /**
     * Whether this is a native token or not (like ETH for ethereum)
     */
    native = false; // Init to false
    /**
     * The network this token is on
     */
    network;
    /**
     * A contract object for this token, optional
     */
    contract;
    /**
     * Token tags
     */
    tags;
    /**
     * The parent protocol
     */
    #parentProtocolId;
    get parentProtocol() {
        return (YCClassifications.getInstance().protocols.find((protocol) => protocol.id == this.#parentProtocolId) || null);
    }
    // =======================
    //      CONSTRUCTOR
    // =======================
    constructor(_token, _context, _network) {
        /**
         * Init static vars
         */
        super();
        this.name = _token.name;
        this.id = _token.id;
        this.symbol = _token.symbol;
        this.network =
            _network && _network.id == _token.chain_id
                ? _network
                : _context.getNetwork(_token.chain_id);
        this.address = ethers.getAddress(_token.address);
        this.decimals = _token.decimals;
        this.logo = _token.logo;
        this.native = this.address == ethers.ZeroAddress ? true : false;
        this.contract = new Contract(this.address, erc20ABI, this.network?.provider);
        this.tags = _token.tags;
        this.#parentProtocolId = _token.parent_protocol;
        // Return existing singleton if exists
        const existingToken = this.getInstance(_token.id);
        if (existingToken)
            return existingToken;
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
    /**
     * Parse some formatted number into the raw number of tokens using it's decimals
     * @param _number  - the number to parse
     * @returns - the parsed number (bigint)
     */
    parseDecimals = (_number) => {
        return ethers.parseUnits(_number.toString(), this.decimals);
    };
    /**
     * Format a raw number of an amount of this token using its decimals
     * @param _number - The raw number (bigint / string)
     * @returns The formatted number
     */
    formatDecimals = (_number) => {
        return parseFloat(ethers.formatUnits(_number, this.decimals));
    };
    /**
     * Get the parsed value of either an already parsed number, or a formatted number.
     * Used by some functions as a shorthand so that they can accept both formatted and raw numbers
     * @param value - the value to aprse
     * @returns parsed value
     */
    getParsed = (value) => {
        console.log("Value Got In get parsed", value, "typeof", typeof value);
        if (typeof value == "number") {
            console.log("Value returning", this.parseDecimals(value));
            return this.parseDecimals(value);
        }
        return value;
    };
    /**
     * Quote some amount of this token against USD
     * @param _amount - The amount to quote (RAW)
     * @returns
     */
    quoteUSD = async (_amount) => {
        const singleQuote = await LiFi.getInstance().getUSDPrice(this);
        if (!singleQuote)
            throw new Error("YCToken ERR: Cannot Get USD Price (Quote Failed!). Token ID: " +
                this.id +
                "Quote: " +
                singleQuote);
        return singleQuote * this.formatDecimals(_amount);
    };
    /**
     * The price of this token in USD (i.e 1 TOKEN === ? $USD)
     * @returns the price in USD of a single token
     */
    price = async () => {
        return await LiFi.getInstance().getUSDPrice(this);
    };
    /**
     * Price of this 1 token against another token
     * @param _token - The other token to quote against
     * @returns The price of 1 token against the inputted token
     */
    priceAgainstToken = async (_token) => {
        return await LiFi.getInstance().getTokenPrice(this, _token);
    };
    /**
     * Whether or not this token is present in some markets/protocols/exchanges,
     * @param _protocolID - The protocol ID to search for
     * @returns boolean, whether it exists there or not
     */
    isInMarket = (_protocolID) => {
        return this.markets.some((market) => market.id);
    };
    // ====================
    //   ONCHAIN METHODS
    // ====================
    /**
     * Send an approval transaction
     * @param spender - The address we are allowing to spend our tokens
     * @param amount - The amount to approve
     * @param signer - The signeing method to sign the transaction
     * @returns Ethers transaction response
     */
    approve = async (spender, amount, signer) => {
        // Assert the chain ID to match ours
        if (signer instanceof EthersExecutor)
            this.network?.assertSameChainId((await signer.provider?.getNetwork())?.chainId);
        // Populate an approval
        const approvaltxn = await this.populateApproval(amount, spender, {
            from: signer instanceof EthersExecutor ? signer.address : signer.from,
        });
        // Sign it
        return await this.signTransaction(signer, approvaltxn);
    };
    /**
     * Approves only the amount required to reach the desired allownace,
     * taking into account existing allowance between the parties
     * @param spender - The address we are allowing to spend our tokens
     * @param amount - The amount to approve
     * @param signer - The signeing method to sign the transaction
     * @returns Ethers transaction response
     */
    safeApproval = async (spender, amount, signer) => {
        // Only approve just enough for it to be sufficient ontop of existing allownace
        const amountToApprove = amount -
            (await this.contract.allowance(signer instanceof EthersExecutor ? signer.address : signer.from, spender));
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
    /**
     * Populate an approval transaction
     * @param spender - The address we are allowing to spend our tokens
     * @param amount - The amount to approve
     * @param signer - The signeing method to sign the transaction
     * @returns TransactionRequest object
     */
    populateApproval = async (amount, spender, args) => {
        return await this.contract.approve.populateTransaction(spender, this.getParsed(amount), args);
    };
    /**
     * Populate a safe approval (only approve enough to reach desired allownace)
     * @param spender - The address we are allowing to spend our tokens
     * @param amount - The amount to approve
     * @param signer - The signeing method to sign the transaction
     * @returns TransactionRequest object
     */
    populateSafeApproval = async (amount, spender, args) => {
        // Only approve just enough for it to be sufficient ontop of existing allownace
        const amountToApprove = this.getParsed(amount) -
            (await this.contract.allowance(args.from, spender, args));
        if (amountToApprove <= 0n)
            return true;
        return await this.populateApproval(amountToApprove, spender, args);
    };
    // ========================
    //    INTERNAL FUNCTIONS
    // ========================
    // =================
    //   SINGLETON REF
    // =================
    getInstance = (id) => {
        // We try to find an existing instance of this user
        const existingToken = YCToken.instances.get(id);
        // If we have an existing user and it has the same fields as this one, we return the singleton of it
        if (existingToken) {
            if (this.compare(existingToken))
                return existingToken;
        }
        YCToken.instances.set(id, this);
        return null;
    };
    static instances = new Map();
    // =====================
    //    UTILITY METHODS
    // =====================
    toJSON = () => {
        return {
            id: this.id,
            symbol: this.symbol,
            chain_id: this?.network?.id,
            address: this.address,
            logo: this.logo,
            decimals: this.decimals,
            name: this.name,
            tags: this.tags,
            parent_protocol: this.#parentProtocolId,
        };
    };
}
export { YCToken };
//# sourceMappingURL=token.js.map