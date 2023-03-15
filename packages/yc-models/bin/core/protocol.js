import YCSocialMedia from "./social-media";
/**
 * @notice
 * YCProtocol
 * A class representing a Yieldchain protocol
 */
export default class YCProtocol {
    // =======================
    //     GENERIC FIELDS
    // ======================
    #identifier;
    #name;
    #website;
    #logo;
    #socialMedia;
    // =======================
    //     UNIQUE FIELDS
    // ======================
    #tokens;
    #networks;
    #addresses;
    // #actions: YCAction[]; // TODO: Integrate this when u can, not urgent
    // =======================
    //     CONSTRUCTOR
    // ======================
    constructor(_protocol, _context) {
        // Set static
        this.#socialMedia = new YCSocialMedia(_protocol.twitter, _protocol.telegram, _protocol.discord);
        this.#name = _protocol.name;
        this.#website = _protocol.website;
        this.#logo = _protocol.logo;
        this.#identifier = _protocol.protocol_identifier;
        // Find all tokens that are included in this protocol's markets
        let tokens = _context
            .tokens()
            // Filter to include tokens that have the ID in their markets field
            .filter((token) => token.isInMarket(this.ID()));
        // Set tokens field
        this.#tokens = tokens;
        // Find all networks this protocol is on
        this.#networks = _context
            .networks()
            .filter((network) => network.protocols.find((_protocol) => _protocol.ID() == this.ID()));
        // Find all addresses where the parent protocol is this protocol
        this.#addresses = _context
            .addresses()
            .filter((address) => address.protocol()?.ID() == this.ID());
    }
    // =======================
    //        METHODS
    // ======================
    // Returns the identifier of the protocol
    ID = () => {
        return this.#identifier;
    };
    // Returns the name of the protocol
    name = () => {
        return this.#name;
    };
    // Returns the website of the protocol
    website = () => {
        return this.#website;
    };
    // Returns a YCSocialMedia instance with the protocol's social medias
    socialMedia = () => {
        return this.#socialMedia;
    };
    // Returns the logo of the protocol
    logo = () => {
        return this.#logo;
    };
    // Returns the networks this protocol is available on
    networks = () => {
        return this.#networks;
    };
    // Returns the tokens that are available on this protocol as a market (i.e tokens that r liquid on this protocol)
    tokens = () => {
        return this.#tokens;
    };
}
//# sourceMappingURL=protocol.js.map