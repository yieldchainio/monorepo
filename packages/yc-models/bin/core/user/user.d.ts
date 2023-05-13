import { DBUser } from "../../types/db.js";
import { BaseClass } from "../base/index.js";
import { YCClassifications } from "../context/context.js";
import { YCSocialMedia } from "../social-media/social-media.js";
import { YCStrategy } from "../strategy/strategy.js";
import { UserUpdateArguments, SignupArguments } from "./types.js";
export * from "./types.js";
/**s
 * @notice
 * YCToken
 * A class representing an on-chain token
 */
export declare class YCUser extends BaseClass {
    /**
     * The username of this user
     */
    readonly username: string;
    /**
     * The ID representing this user (uuid)
     */
    readonly id: string;
    /**
     * The onchain address of this user (e.g 0x00..000)
     */
    readonly address: string;
    /**
     * The profile picture of this user (if any)
     */
    readonly profilePic: string;
    /**
     * The description this user gave themselves
     */
    readonly description: string;
    /**
     * Whether or not this is a verified user
     */
    readonly verified: boolean;
    /**
     * The social medias of this user
     */
    readonly socialMedia: YCSocialMedia;
    /**
     * The strategies created by the user
     */
    readonly createdVaults: YCStrategy[];
    static signUp: ({ address, username, profilePicture, twitter, discord, telegram, description, context, }: SignupArguments) => Promise<null | DBUser>;
    static updateDetails: ({ id, address, username, profilePicture, twitter, discord, telegram, description, context, }: UserUpdateArguments) => Promise<DBUser | null>;
    constructor(_user: DBUser, _context: YCClassifications);
    getInstance: (id: string) => YCUser | null;
    static instances: Map<string, YCUser>;
}
