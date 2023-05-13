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
    id;
    token; // Init in constructor
    direction; // Init in constructor
    native = false; // Init to false
    // =======================
    //      CONSTRUCTOR
    // =======================
    constructor(_flow, _context) {
        // Set static variables
        this.direction = _flow.direction;
        // Get token class
        let token = _context.getToken(_flow.token_id);
        // Determine whether this is a native currency
        if (token && token.native)
            this.native = true;
        // @err-handlings
        if (!token)
            throw new Error("Flow's Token Cannot Be Found!");
        this.token = token;
        this.id = _flow.id;
    }
    // ==============
    //    METHODS
    // ==============
    toJSON = () => {
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
var FlowDirections;
(function (FlowDirections) {
    FlowDirections[FlowDirections["outflow"] = 0] = "outflow";
    FlowDirections[FlowDirections["inflow"] = 1] = "inflow";
})(FlowDirections || (FlowDirections = {}));
//# sourceMappingURL=flow.js.map