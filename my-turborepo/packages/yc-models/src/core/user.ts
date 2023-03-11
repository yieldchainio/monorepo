import { DBUser } from "../types/db";
import { YCClassifications } from "./classification";
import { YCSocialMedia } from "./social-media";

/**
 * @notice
 * YCToken
 * A class representing an on-chain token
 */
export class YCUser {
  // =======================
  //    PRIVATE VARIABLES
  // =======================
  #username: string;
  #address: string;
  #profilePic: string;
  #description: string;
  #verified: boolean;
  #socialMedia: YCSocialMedia;

  // =======================
  //      CONSTRUCTOR
  // =======================
  constructor(_user: DBUser, _context: YCClassifications) {
    this.#address = _user.address;
    this.#username = _user.username;
    this.#description = _user.description;
    this.#profilePic = _user.profile_picture;
    this.#socialMedia = new YCSocialMedia(
      _user.twitter,
      _user.telegram,
      _user.discord
    );
    this.#verified = _user.verified;
  }
  // =======================
  //        METHODS
  // =======================

  socialMedia = () => {
    return this.#socialMedia;
  };
}

// Different type of tokens - Native token (e.g ETH), ERC20, ERC721, etc
enum TokenType {
  NATIVE = 0,
  ERC20 = 1,
  ERC721 = 2,
}
