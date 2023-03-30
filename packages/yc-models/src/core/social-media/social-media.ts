import { BaseClass } from "../base";
import { YCClassifications } from "../context/context";
import { YCNotFoundError } from "../errors/errors";

// Type for a social media - can have a handle and a link
export type SingleSocialMedia = {
  handle?: string | null;
  link?: string | null;
};

/**
 * @notice
 * A class represnting social medias - Of a protocol/user
 */
export class YCSocialMedia extends BaseClass {
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
    return protocol.socialMedia;
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
    super();
    this.#twitter = _twitter || null;
    this.#telegram = _telegram || null;
    this.#discord = _discord || null;
  }

  // ==================
  //      METHODS
  // ==================
  get twitter(): SingleSocialMedia {
    if (this.#twitter?.includes("twitter.")) {
      return {
        link: this.#twitter,
        handle: this.#twitter.split("twitter.com/")[1],
      };
    }
    return {
      link: `https://twitter.com/${this.#twitter}`,
      handle: this.#twitter,
    };
  }
  get discord() {
    if (this.#discord?.includes("discord.")) {
      return {
        link: this.#discord,
        handle: this.#discord.split("twitter.com/")[1],
      };
    }
    return {
      link: `https://discord.com/${this.#discord}`,
      handle: this.#discord,
    };
  }
  get telegram() {
    if (
      this.#telegram?.includes("t.") ||
      this.#telegram?.includes("telegram.")
    ) {
      return {
        link: this.#telegram,
        handle:
          this.#telegram.split("t.me/")[1] ||
          this.#telegram.split("telegram.com/")[1],
      };
    }
    return {
      link: `https://t.me/${this.#telegram}`,
      handle: this.#telegram?.includes("@")
        ? this.#telegram.split("@")[1]
        : this.#telegram,
    };
  }
}
