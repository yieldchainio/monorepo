import { DBToken, DBFlow } from "../../types/db";
import { YCClassifications } from "../context/context";

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
  #token: DBToken; // Init in constructor
  #direction: FlowDirections; // Init in constructor
  #native: boolean = false; // Init to false

  // =======================
  //      CONSTRUCTOR
  // =======================
  constructor(_flow: DBFlow, _context: YCClassifications) {
    // Set static variables
    this.#direction =
      _flow.outflow0_or_inflow1 == 0
        ? FlowDirections.outflow
        : FlowDirections.inflow;

    // Get token class
    let token = _context.getToken(_flow.token_id);

    // Determine whether this is a native currency
    if (token && token.isNative()) this.#native = true;

    // @err-handlings
    if (!token) throw new Error("Flow's Token Cannot Be Found!");
    this.#token = {
      id: "",
      name: "",
      address: "",
      symbol: "",
      logo: "",
      decimals: 0,
      chain_id: 0,
    };
  }

  // =======================
  //         METHODS
  // =======================

  // Retreive flow direction
  direction = () => {
    return this.#direction;
  };

  // Retreive YCToken class
  token = () => {
    return this.#token;
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
