import { DBUser } from "../types/db";
import { YCClassifications } from "./classification";
import YCSocialMedia from "./social-media";
/**
 * @notice
 * YCToken
 * A class representing an on-chain token
 */
export default class YCUser {
    #private;
    constructor(_user: DBUser, _context: YCClassifications);
    socialMedia: () => YCSocialMedia;
}
