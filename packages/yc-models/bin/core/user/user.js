import axios from "axios";
import { BaseClass } from "../base/index.js";
import { YCClassifications } from "../context/context.js";
import { YCSocialMedia } from "../social-media/social-media.js";
import { fetchRouter } from "../utils/fetch-router.js";
export * from "./types.js";
/**s
 * @notice
 * YCToken
 * A class representing an on-chain token
 */
class YCUser extends BaseClass {
    // ==========
    //    FIELDS
    // ==========
    /**
     * The username of this user
     */
    username;
    /**
     * The ID representing this user (uuid)
     */
    id;
    /**
     * The onchain address of this user (e.g 0x00..000)
     */
    address;
    /**
     * The profile picture of this user (if any)
     */
    profilePic;
    /**
     * The description this user gave themselves
     */
    description;
    /**
     * Whether or not this is a verified user
     */
    verified;
    /**
     * The social medias of this user
     */
    socialMedia;
    /**
     * The strategies created by the user
     */
    createdVaults = [];
    // =======================
    //    STATIC  METHODS
    // =======================
    static signUp = async ({ address, username = "Anon", profilePicture, twitter, discord, telegram, description = "Wen Moon?", context = YCClassifications.getInstance(), }) => {
        // Init the context if it wasnt already
        if (!context.initiallized) {
            await context.initiallize();
        }
        // Try to find the user if it exists already
        const userExists = context.users.find((user) => user.address.toLowerCase() == address.toLowerCase());
        // If the user exists, we return false to indicate the signup failed
        if (userExists)
            return null;
        // Send the request to the backend
        const res = await fetchRouter({
            backend: {
                fetcher: async () => await context.client?.usersv2?.create({
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
                fetcher: async () => await axios.post(YCClassifications.apiURL + "/signup", {
                    address: address,
                    username: username,
                    profile_picture: profilePicture,
                    twitter: twitter,
                    telegram: telegram,
                    discord: discord,
                    description: description,
                }),
                parser: (value) => (value ? value.data.user : null),
            },
        });
        return res || null;
    };
    static updateDetails = async ({ id, address, username, profilePicture, twitter, discord, telegram, description, context = YCClassifications.getInstance(), }) => {
        // Init the context if it wasnt already
        if (!context.initiallized)
            await context.initiallize();
        // Sufficient check, does user exist?
        const doesUserExist = context.users.find((user) => user.id == id);
        // getting the SM  links
        const twitterToUse = typeof twitter == "string" ? twitter : twitter?.link;
        const telegramToUse = typeof telegram == "string" ? telegram : telegram?.link;
        const discordToUse = typeof discord == "string" ? discord : discord?.link;
        // If they arent, we forwrd them to .signUp()
        if ((id == (undefined || null) || !doesUserExist) && address)
            return YCUser.signUp({
                address,
                username,
                profilePicture,
                twitter: twitterToUse,
                discord: discordToUse,
                telegram: telegramToUse,
                description,
                context,
            });
        // if they are, we just update their details
        const client = context.client;
        // Send the request to the backend
        const res = await fetchRouter({
            backend: {
                fetcher: async () => await client?.usersv2?.update({
                    where: {
                        id: id,
                    },
                    data: {
                        address: address || doesUserExist?.address,
                        username: username || doesUserExist?.username,
                        profile_picture: profilePicture || doesUserExist?.profilePic,
                        twitter: twitterToUse || doesUserExist?.socialMedia.twitter.handle,
                        telegram: telegramToUse || doesUserExist?.socialMedia.telegram.handle,
                        discord: discordToUse || doesUserExist?.socialMedia.discord.handle,
                        description: description || doesUserExist?.description,
                    },
                }),
            },
            frontend: {
                fetcher: async () => await axios.post(YCClassifications.apiURL + "/update-user", {
                    id: id,
                    address: address || doesUserExist?.address,
                    username: username || doesUserExist?.username,
                    profile_picture: profilePicture || doesUserExist?.profilePic,
                    twitter: twitterToUse || doesUserExist?.socialMedia.twitter.handle,
                    telegram: telegramToUse || doesUserExist?.socialMedia.telegram.handle,
                    discord: discordToUse || doesUserExist?.socialMedia.discord.handle,
                    description: description || doesUserExist?.description,
                }),
            },
        });
        return res || null;
    };
    // =======================
    //      CONSTRUCTOR
    // =======================
    constructor(_user, _context) {
        /**
         * Set static vars
         */
        super();
        this.address = _user.address;
        this.id = _user.id;
        this.username = _user.username;
        this.description = _user.description;
        this.profilePic = _user.profile_picture || "";
        this.socialMedia = new YCSocialMedia(_user.twitter, _user.telegram, _user.discord);
        this.verified = _user.verified;
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
        this.createdVaults = vaults;
        const existingUser = this.getInstance(_user.id);
        if (existingUser)
            return existingUser;
        this.createdVaults = _context.strategies.filter((strat) => strat.creator?.id == this.id);
    }
    // =================
    //   SINGLETON REF
    // =================
    getInstance = (id) => {
        // We try to find an existing instance of this user
        const existingUser = YCUser.instances.get(id);
        // If we have an existing user and it has the same fields as this one, we return the singleton of it
        if (existingUser) {
            if (this.compare(existingUser))
                return existingUser;
        }
        YCUser.instances.set(id, this);
        return existingUser || null;
    };
    static instances = new Map();
}
export { YCUser };
//# sourceMappingURL=user.js.map