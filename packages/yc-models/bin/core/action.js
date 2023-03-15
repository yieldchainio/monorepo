export default class YCAction {
    // =====================
    //    PRIVATE FIELDS
    // =====================
    #name;
    #identifier;
    #popularity;
    #hidden;
    // =====================
    //     CONSTRUCTOR
    // =====================
    constructor(_action, _context) {
        this.#name = _action.name;
        this.#identifier = _action.action_identifier;
        this.#popularity = _action.popularity;
        this.#hidden = _action.hidden;
    }
}
//# sourceMappingURL=action.js.map