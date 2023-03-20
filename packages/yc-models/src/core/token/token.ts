import { DBToken } from "../../types/db";
import { YCClassifications } from "../context/context";
import { ethers } from "ethers";
import { YCProtocol } from "../protocol/protocol";
import { YCNetwork } from "../network/network";
import { LiFi } from "../../clients/lifi";

/**
 * @notice
 * YCToken
 * A class representing an on-chain token
 */
export class YCToken {
  // =======================
  //    PRIVATE VARIABLES
  // =======================
  #name: string; // Init in constructor
  #id: string;
  #symbol: string;
  #address: string;
  #logoURI: string | null = null; // Init to null (Optional field)
  #decimals: number;
  #markets: YCProtocol[] = [];
  #native: boolean = false; // Init to false
  #type: TokenType;
  #network: YCNetwork | null;

  // =======================
  //      CONSTRUCTOR
  // =======================
  constructor(_token: DBToken, _context: YCClassifications) {
    // Init static fields
    this.#name = _token.name;
    this.#id = _token.id;
    this.#symbol = _token.symbol;
    this.#network = _context.getNetwork(_token.chain_id);
    this.#address = ethers.getAddress(_token.address);
    this.#decimals = _token.decimals;
    this.#logoURI = _token.logo;
    this.#type =
      this.#address == ethers.ZeroAddress ? TokenType.NATIVE : TokenType.ERC20; // TODO: Add Support for more token types? Requires throughout integration i believe (NFTs (ERC721), etc)
    this.#native = this.#address == ethers.ZeroAddress ? true : false;

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

  // The checksummed address
  get address() {
    return ethers.getAddress(this.#address);
  }

  get name() {
    return this.#name;
  }

  get symbol() {
    return this.#symbol;
  }

  get id() {
    return this.#id;
  }

  // Decimals
  get decimals() {
    return this.#decimals;
  }

  get chainId() {
    return this.network?.chainid;
  }

  // Parse a formatted number by the decimals
  parseDecimals = (_number: string | number | bigint) => {
    _number = BigInt(_number);
    return _number * 10n ** BigInt(this.decimals);
  };

  // The network instance it is on
  get network() {
    return this.#network;
  }

  // All markets
  get markets() {
    return this.#markets;
  }

  // Quote against $ USD
  price = async (): Promise<number | null> => {
    return await new LiFi().getUSDPrice(this);
  };

  // Price against another token
  priceAgainstToken = async (_token: YCToken): Promise<number | null> => {
    return await new LiFi().getTokenPrice(this, _token);
  };

  // Indiciating whether th
  get isNative() {
    return this.#native;
  }

  // Check whether this token is liquid in a certain market (By ID)
  isInMarket = (_protocolID: string) => {
    return this.#markets.some((market: YCProtocol) => market.ID());
  };
}

// Different type of tokens - Native token (e.g ETH), ERC20, ERC721, etc
enum TokenType {
  NATIVE = 0,
  ERC20 = 1,
  ERC721 = 2,
}
