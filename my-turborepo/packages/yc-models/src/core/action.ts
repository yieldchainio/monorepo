import { DBAction } from "../types/db";
import { YCClassifications } from "./classification";

export class YCAction {
  // =====================
  //    PRIVATE FIELDS
  // =====================
  #name: string;
  #identifier: number;
  #popularity: number;
  #hidden: boolean;

  // =====================
  //     CONSTRUCTOR
  // =====================
  constructor(_action: DBAction, _context: YCClassifications) {
    this.#name = _action.name;
    this.#identifier = _action.action_identifier;
    this.#popularity = _action.popularity;
    this.#hidden = _action.hidden;
  }
}
