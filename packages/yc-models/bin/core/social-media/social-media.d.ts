import { BaseClass } from "../base/index.js";
export type SingleSocialMedia = {
    handle?: string | null;
    link?: string | null;
};
/**
 * @notice
 * A class represnting social medias - Of a protocol/user
 */
export declare class YCSocialMedia extends BaseClass {
    #private;
    /**
     * @static @method fromProtocol()
     * Takes in a protocol ID, returns an instance of it's social media
     * @param _id - The ID of the protocol
     * @returns YC Social media instance
     */
    static fromProtocol: (_id: string) => YCSocialMedia;
    static fromUser: (_id: string) => YCSocialMedia;
    constructor(_twitter?: string | null, _telegram?: string | null, _discord?: string | null);
    get twitter(): SingleSocialMedia;
    get discord(): {
        link: string;
        handle: string | null;
    };
    get telegram(): {
        link: string;
        handle: string | null;
    };
}
