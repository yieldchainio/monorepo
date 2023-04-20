import { DBAction } from "../../types/db";
import { YCClassifications } from "../context/context";
import { YCFunc } from "../function/function";

export class YCAction {
  // =====================
  //    PRIVATE FIELDS
  // =====================
  readonly name: string;
  readonly id: string;
  readonly popularity: number;
  readonly available: boolean;
  readonly functions: YCFunc[] = [];
  icon: string | { dark: string; light: string } | null = null;

  // =====================
  //     CONSTRUCTOR
  // =====================
  constructor(_action: DBAction, _context: YCClassifications) {
    this.name = _action.name;
    this.id = _action.id;
    this.popularity = _action.popularity;
    this.available = _action.available;

    // Iterate over each function id
    for (const funcid of _action.functions_ids) {
      // Get the full function details from the context
      const fullFunc = _context.getFunction(funcid);

      // If it's nullish, we throw an error (A function ID must be found / existant)
      if (!fullFunc)
        throw new Error(
          "YCAction ERR: Cannot find func ID in provided context - Action ID: " +
            _action.id +
            "  Func ID:  " +
            funcid
        );

      // Push the function into our global array
      this.functions.push(fullFunc);
    }
  }

  // =====================
  //        METHODS
  // =====================
}
