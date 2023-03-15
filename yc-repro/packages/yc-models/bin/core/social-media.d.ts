/**
 * @notice
 * A class represnting social medias - Of a protocol/user
 */
export default class YCSocialMedia {
    #private;
    /**
     * @static @method fromProtocol()
     * Takes in a protocol ID, returns an instance of it's social media
     * @param _id - The ID of the protocol
     * @returns YC Social media instance
     */
    static fromProtocol: (_id: number) => YCSocialMedia;
    static fromUser: (_id: string) => YCSocialMedia;
    constructor(_twitter?: string, _telegram?: string, _discord?: string);
}
