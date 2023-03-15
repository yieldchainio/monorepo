import YCSocialMedia from "./social-media";
/**
 * @notice
 * YCToken
 * A class representing an on-chain token
 */
export default class YCUser {
    // =======================
    //    PRIVATE VARIABLES
    // =======================
    #username;
    #address;
    #profilePic;
    #description;
    #verified;
    #socialMedia;
    // =======================
    //      CONSTRUCTOR
    // =======================
    constructor(_user, _context) {
        this.#address = _user.address;
        this.#username = _user.username;
        this.#description = _user.description;
        this.#profilePic = _user.profile_picture;
        this.#socialMedia = new YCSocialMedia(_user.twitter, _user.telegram, _user.discord);
        this.#verified = _user.verified;
    }
    // =======================
    //        METHODS
    // =======================
    socialMedia = () => {
        return this.#socialMedia;
    };
}
// Different type of tokens - Native token (e.g ETH), ERC20, ERC721, etc
var TokenType;
(function (TokenType) {
    TokenType[TokenType["NATIVE"] = 0] = "NATIVE";
    TokenType[TokenType["ERC20"] = 1] = "ERC20";
    TokenType[TokenType["ERC721"] = 2] = "ERC721";
})(TokenType || (TokenType = {}));
//# sourceMappingURL=user.js.map