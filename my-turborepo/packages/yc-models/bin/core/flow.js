/**
 * @notice
 * YCFlow
 * Constructs a class representing a "Flow" - i.e a token/funds movement.
 *
 */
export default class YCFlow {
    // =======================
    //    PRIVATE VARIABLES
    // =======================
    #token; // Init in constructor
    #direction; // Init in constructor
    #native = false; // Init to false
    // =======================
    //      CONSTRUCTOR
    // =======================
    constructor(_flow, _context) {
        // Set static variables
        this.#direction =
            _flow.outflow0_or_inflow1 == 0
                ? FlowDirections.outflow
                : FlowDirections.inflow;
        // Get token class
        let token = _context.getToken(_flow.token_identifier);
        // Determine whether this is a native currency
        if (token && token.isNative())
            this.#native = true;
        // @err-handlings
        if (!token)
            throw new Error("Flow's Token Cannot Be Found!");
        this.#token = {
            token_identifier: -1,
            name: "",
            address: "",
            symbol: "",
            logo: "",
            decimals: 0,
            coinkey: "",
            priceusd: 0,
            chain_id: 0,
            markets: [],
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
var FlowDirections;
(function (FlowDirections) {
    FlowDirections[FlowDirections["outflow"] = 0] = "outflow";
    FlowDirections[FlowDirections["inflow"] = 1] = "inflow";
})(FlowDirections || (FlowDirections = {}));
//# sourceMappingURL=flow.js.map