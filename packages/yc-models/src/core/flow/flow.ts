import { DBToken, DBFlow } from "../../types/db";
import { YCClassifications } from "../context/context";
import { FlowDirection } from "@prisma/client";
import { YCToken } from "../token/token";

/**
 * @notice
 * YCFlow
 * Constructs a class representing a "Flow" - i.e a token/funds movement.
 *
 */
export class YCFlow {
  // =======================
  //    PRIVATE VARIABLES
  // =======================
  readonly id: string;
  readonly token: YCToken; // Init in constructor
  readonly direction: FlowDirection; // Init in constructor
  readonly native: boolean = false; // Init to false

  // =======================
  //      CONSTRUCTOR
  // =======================
  constructor(_flow: DBFlow, _context: YCClassifications) {
    // Set static variables
    this.direction = _flow.direction;

    // Get token class
    let token = _context.getToken(_flow.token_id);

    // Determine whether this is a native currency
    if (token && token.native) this.native = true;

    // @err-handlings
    if (!token) throw new Error("Flow's Token Cannot Be Found!");

    this.token = token;

    this.id = _flow.id;
  }

  // ==============
  //    METHODS
  // ==============
  toJSON = (): DBFlow => {
    return {
      id: this.id,
      direction: this.direction,
      token_id: this.token.id,
      
    };
  };
}

// Flow Directions, either
// -----------------
// Inflow: User++ <= ExternalContract--
// ------ OR -------
// Outflow: User-- => ExternalContract++
// -----------------
enum FlowDirections {
  outflow = 0,
  inflow = 1,
}
