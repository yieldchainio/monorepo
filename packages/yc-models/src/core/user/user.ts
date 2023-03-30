import { PrismaClient } from "@yc/yc-data";
import axios from "axios";
import { DBUser } from "../../types/db";
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
  // =================
  //   SINGLETON REF
  // =================
  static instances: YCUser[] = [];

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

    // We try to find an existing instance of this user
    const existingUser = YCUser.instances.find((user) => user.id === _user.id);

    // If we have an existing user and it has the same fields as this one, we return the singleton of it
    if (existingUser && this.compare(existingUser)) {
      return existingUser;

      // Else, if we do have an existing users and the fields are different, we replace it with the current instance
    } else if (existingUser) {
      // The index of the old singleton
      const oldUserIndex = YCUser.instances.findIndex(
        (usr) => usr.id === existingUser.id
      );

      // Sufficient check, we replace it with this instance using .splice
      if (oldUserIndex !== undefined)
        YCUser.instances.splice(oldUserIndex, 1, this);

      // Else, if there's no existing singleton at all, we push this one into the array
    } else {
      // Else we push this instance into the array
      YCUser.instances.push(this);
    }

    // We only set the following propreties if the context has been initiallized
    if (_context.initiallized)
      this.#createdVaults = _context.strategies.filter(
        (strategy) => strategy.creator?.id == this.id
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
