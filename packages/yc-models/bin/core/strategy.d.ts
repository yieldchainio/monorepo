import { DBStrategy } from "../types/db";
import { YCClassifications } from "./classification";
export default class YCStrategy {
    constructor(_strategy: DBStrategy, _context: YCClassifications);
}
