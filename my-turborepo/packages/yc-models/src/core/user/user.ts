import { PrismaClient } from "@yc/yc-data";
import { address } from "../../types";
import { DBUser } from "../../types/db";
import { YCClassifications } from "../context/context";
import { YCSocialMedia } from "../social-media/social-media";
import { YCStrategy } from "../strategy/strategy";

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
  #id: string;
  #address: string;
  #profilePic: string;
  #description: string;
  #verified: boolean;
  #socialMedia: YCSocialMedia;
  #context: YCClassifications;
  #createdVaults: YCStrategy[] = [];

  // =======================
  //    STATIC  METHODS
  // =======================
  static signUp = async ({
    address,
    username = "Anon",
    profilePicture,
    twitter,
    discord,
    telegram,
    description = "Wen Moon?",
    context = YCClassifications.getInstance(),
  }: SignupArguments): Promise<null | DBUser> => {
    // Init the context if it wasnt already
    if (!context.initiallized) await context.initiallize();

    // Try to find the user if it exists already
    const userExists = context.users.find(
      (user: YCUser) => user.address == address
    );

    console.log("User exists in signup:", userExists);
    console.log("All users in signuo:", context.users);

    // If the user exists, we return false to indicate the signup failed
    if (userExists) return null;

    // Sign them up
    if (typeof window)
    const client: PrismaClient | null = context.client;
    if (client) {
      console.log("Signing up using client...");
      const res = await client.usersv2.create({
        data: {
          address: address,
          username: username,
          profile_picture: profilePicture,
          twitter: twitter,
          telegram: telegram,
          discord: discord,
          description: description,
        },
      });

      return res || false;
    }

    return null;
  };

  static updateDetails = async ({
    id,
    address,
    username,
    profilePicture,
    twitter,
    discord,
    telegram,
    description,
    context = YCClassifications.getInstance(),
  }: UserUpdateArguments): Promise<DBUser | null> => {
    // Init the context if it wasnt already
    if (!context.initiallized) await context.initiallize();

    // Sufficient check, does user exist?
    const doesUserExist = context.users.find((user: YCUser) => user.id == id);

    // If they arent, we forwrd them to .signUp()
    if ((id == (undefined || null) || !doesUserExist) && address)
      return YCUser.signUp({
        address,
        username,
        profilePicture,
        twitter,
        discord,
        telegram,
        description,
        context,
      });

    // if they are, we just update their details
    const client: PrismaClient | null = context.client;

    // Update their details
    if (client && id) {
      return await client.usersv2.update({
        where: {
          id: id,
        },
        data: {
          address: address || doesUserExist?.address,
          username: username || doesUserExist?.username,
          profile_picture: profilePicture || doesUserExist?.profilePic,
          twitter: twitter || doesUserExist?.socialMedia.twitter,
          telegram: telegram || doesUserExist?.socialMedia.telegram,
          discord: discord || doesUserExist?.socialMedia.discord,
          description: description || doesUserExist?.description,
        },
      });
    } else return null;
  };

  // =======================
  //      CONSTRUCTOR
  // =======================
  constructor(_user: DBUser, _context: YCClassifications) {
    this.#address = _user.address;
    this.#id = _user.id;
    this.#username = _user.username;
    this.#description = _user.description;
    this.#profilePic = _user.profile_picture || "";
    this.#socialMedia = new YCSocialMedia(
      _user.twitter,
      _user.telegram,
      _user.discord
    );
    this.#verified = _user.verified;

    this.#context = _context;

    // We only set the following propreties if the context has been initiallized
    if (_context.initiallized)
      this.#createdVaults = _context.strategies.filter(
        (strategy) => strategy.creator?.id === this.#id
      );
  }
  // =======================
  //        METHODS
  // =======================
  get socialMedia() {
    return this.#socialMedia;
  }

  get id() {
    return this.#id;
  }

  get address() {
    return this.#address;
  }

  get username() {
    return this.#username;
  }

  get profilePic() {
    return this.#profilePic;
  }

  get description() {
    return this.#description;
  }

  get isVerified() {
    return this.#verified;
  }
}

// Different type of tokens - Native token (e.g ETH), ERC20, ERC721, etc
enum TokenType {
  NATIVE = 0,
  ERC20 = 1,
  ERC721 = 2,
}

interface SignupArguments {
  address: string;
  username?: string;
  context?: YCClassifications;
  description?: string;
  profilePicture?: string;
  twitter?: string;
  discord?: string;
  telegram?: string;
}

export type UserUpdateArguments =
  | {
      id: undefined | null;
      address: string;
      username?: string;
      context: YCClassifications;
      description?: string;
      profilePicture?: string;
      twitter?: string;
      discord?: string;
      telegram?: string;
    }
  | {
      id: string;
      address?: string;
      username?: string;
      context?: YCClassifications;
      description?: string;
      profilePicture?: string;
      twitter?: string;
      discord?: string;
      telegram?: string;
    };
