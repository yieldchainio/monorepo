import { YCClassifications } from "../context/context";
import { YCNotFoundError } from "../errors/errors";

/**
 * @notice
 * A class represnting social medias - Of a protocol/user
 */
export class YCSocialMedia {
  // Twitter URL
  #twitter: string | null = null;

  // Telegram URL
  #telegram: string | null = null;

  // Discord Name & #xxxx
  #discord: string | null = null;

  /**
   * @static @method fromProtocol()
   * Takes in a protocol ID, returns an instance of it's social media
   * @param _id - The ID of the protocol
   * @returns YC Social media instance
   */
  static fromProtocol = (_id: string): YCSocialMedia => {
    // Init context (singleton)
    const context = new YCClassifications();

    // Find protocol
    const protocol = context.getProtocol(_id);

    // throw error if protocol is not found
    if (!protocol) throw new YCNotFoundError("Protocol", _id);

    // Return social media of the protocol
    return protocol.socialMedia();
  };

  // From user ID
  static fromUser = (_id: string): YCSocialMedia => {
    // Init context (singleton)
    const context = new YCClassifications();

    // Find protocol
    const user = context.getUser(_id);

    if (!user)
      throw new Error(
        "YC SOCIALMEDIA ERR: User Not found - Cannot find user to fetch SMs of. ID: " +
          _id
      );

    return user.socialMedia;
  };

  // ==================
  //    CONSTRUCTOR
  // ==================
  constructor(
    _twitter?: string | null,
    _telegram?: string | null,
    _discord?: string | null
  ) {
    this.#twitter = _twitter || null;
    this.#telegram = _telegram || null;
    this.#discord = _discord || null;
  }

  // ==================
  //      METHODS
  // ==================
  get twitter() {
    return this.#twitter;
  }
  get discord() {
    return this.#discord;
  }
  get telegram() {
    return this.#telegram;
  }
}
