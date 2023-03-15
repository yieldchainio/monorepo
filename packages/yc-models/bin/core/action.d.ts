import { DBAction } from "../types/db";
import { YCClassifications } from "./classification";
export default class YCAction {
    #private;
    constructor(_action: DBAction, _context: YCClassifications);
}
