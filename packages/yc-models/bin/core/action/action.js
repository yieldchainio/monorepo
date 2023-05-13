export class YCAction {
    // =====================
    //       FIELDS
    // =====================
    /**
     * Name of the action (e.g Stake, Add Liquidity, Harvest, Swap, Long)
     */
    name;
    /**
     * Id of the action (uuid)
     */
    id;
    /**
     * Popularity (index in popularity, e.g 0 === highest popularity)
     */
    popularity;
    /**
     * Whether it is available or not (some are not yet fully integrated)
     */
    available;
    /**
     * All of the functions that relate to this action (e.g a function called "depositTokens()" may be related to the stake function, depending on it's classification)
     */
    functions = [];
    /**
     * Icon of the action,
     * optional, used & assigned by the frontend.
     */
    icon = null;
    // =====================
    //     CONSTRUCTOR
    // =====================
    constructor(_action, _context) {
        /**
         * Assign all static vars
         */
        this.name = _action.name;
        this.id = _action.id;
        this.popularity = _action.popularity;
        this.available = _action.available;
        /**
         * Iterate over each function ID from the action in the database,
         * push it into our functions
         */
        for (const funcid of _action.functions_ids) {
            // Get the full function details from the context
            const fullFunc = _context.getFunction(funcid);
            // If it's nullish, we throw an error (A function ID must be found / existant)
            if (!fullFunc)
                throw new Error("YCAction ERR: Cannot find func ID in provided context - Action ID: " +
                    _action.id +
                    "  Func ID:  " +
                    funcid);
            // Push the function into our global array
            this.functions.push(fullFunc);
        }
    }
}
//# sourceMappingURL=action.js.map