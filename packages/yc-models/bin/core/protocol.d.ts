import { DBProtocol } from "../types/db";
import { YCClassifications } from "./classification";
import YCNetwork from "./network";
import YCSocialMedia from "./social-media";
import YCToken from "./token";
/**
 * @notice
 * YCProtocol
 * A class representing a Yieldchain protocol
 */
export default class YCProtocol {
    #private;
    constructor(_protocol: DBProtocol, _context: YCClassifications);
    ID: () => number;
    name: () => string;
    website: () => String;
    socialMedia: () => YCSocialMedia;
    logo: () => string;
    networks: () => YCNetwork[];
    tokens: () => YCToken[];
}
