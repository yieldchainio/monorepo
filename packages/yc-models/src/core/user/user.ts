import { PrismaClient } from "@yc/yc-data";
import axios from "axios";
import { DBStrategy, DBUser } from "../../types/db";
import { BaseClass } from "../base";
import { YCClassifications } from "../context/context";
import { YCSocialMedia } from "../social-media/social-media";
import { YCStrategy } from "../strategy/strategy";
import { fetchRouter } from "../utils/fetch-router";

/**
 * @notice
 * YCToken
 * A class representing an on-chain token
 */
export class YCUser extends BaseClass {
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
    if (!context.initiallized) {
      console.log("Initiallizing Context Inside Signup...");
      await context.initiallize();
    }

    // Try to find the user if it exists already
    const userExists = context.users.find(
      (user: YCUser) => user.address.toLowerCase() == address.toLowerCase()
    );

    // If the user exists, we return false to indicate the signup failed
    if (userExists) return null;

    // Send the request to the backend
    const res = await fetchRouter<DBUser | undefined>({
      backend: {
        fetcher: async () =>
          await context.client?.usersv2?.create({
            data: {
              address: address,
              username: username,
              profile_picture: profilePicture,
              twitter: twitter,
              telegram: telegram,
              discord: discord,
              description: description,
            },
          }),
      },
      frontend: {
        fetcher: async () =>
          await axios.post(YCClassifications.apiURL + "/signup", {
            address: address,
            username: username,
            profile_picture: profilePicture,
            twitter: twitter,
            telegram: telegram,
            discord: discord,
            description: description,
          }),
        parser: (value: any | undefined) => (value ? value.data.user : null),
      },
    });

    return res || null;
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

    // Send the request to the backend
    const res = await fetchRouter<DBUser | undefined>({
      backend: {
        fetcher: async () =>
          await client?.usersv2?.update({
            where: {
              id: id as string,
            },
            data: {
              address: address || doesUserExist?.address,
              username: username || doesUserExist?.username,
              profile_picture: profilePicture || doesUserExist?.profilePic,
              twitter: twitter || doesUserExist?.socialMedia.twitter.handle,
              telegram: telegram || doesUserExist?.socialMedia.telegram.handle,
              discord: discord || doesUserExist?.socialMedia.discord.handle,
              description: description || doesUserExist?.description,
            },
          }),
      },
      frontend: {
        fetcher: async () =>
          await axios.post(YCClassifications.apiURL + "/update-user", {
            id: id,
            address: address || doesUserExist?.address,
            username: username || doesUserExist?.username,
            profile_picture: profilePicture || doesUserExist?.profilePic,
            twitter: twitter || doesUserExist?.socialMedia.twitter,
            telegram: telegram || doesUserExist?.socialMedia.telegram,
            discord: discord || doesUserExist?.socialMedia.discord,
            description: description || doesUserExist?.description,
          }),
      },
    });

    return res || null;
  };

  // =======================
  //      CONSTRUCTOR
  // =======================
  constructor(_user: DBUser, _context: YCClassifications) {
    super();
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

    const vaults = _context.rawStrategies
      .filter((strategy) => strategy.creator_id == this.id)
      .map((vault) => vault.id);

    /**
     * @notice
     * We set an array of strings (the IDs) initially to the global object,
     * this is done to prevent an infinite circular check with the strategies that refernece to this user,
     * when comparing (Since, the stringifier of the comparison function would have converted the strategies
     * into IDs anyway to avoid a massive memory leak)
     */
    this.#createdVaults = vaults as unknown as YCStrategy[];

    const existingUser = this.getInstance(_user.id);
    if (existingUser) return existingUser;

    this.#createdVaults = _context.strategies.filter(
      (strat) => strat.creator?.id == this.id
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

  get createdVaults() {
    return this.#createdVaults;
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

  // =================
  //   SINGLETON REF
  // =================
  getInstance = (id: string): YCUser | null => {
    // We try to find an existing instance of this user
    const existingUser = YCUser.instances.get(id);

    // If we have an existing user and it has the same fields as this one, we return the singleton of it
    if (existingUser) {
      if (this.compare(existingUser)) return existingUser;
    }

    YCUser.instances.set(id, this);

    return existingUser || null;
  };

  static instances: Map<string, YCUser> = new Map();
}

// Different type of tokens - Native token (e.g ETH), ERC20, ERC721, etc
enum TokenType {
  NATIVE = 0,
  ERC20 = 1,
  ERC721 = 2,
}

export interface SignupArguments {
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
