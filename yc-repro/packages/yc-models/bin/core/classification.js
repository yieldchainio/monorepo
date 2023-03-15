import YCFunc from "./function";
import axios from "axios";
import YCArgument from "./argument";
import { getAddress } from "ethers";
import YCFlow from "./flow";
import YCToken from "./token";
import YCProtocol from "./protocol";
import YCNetwork from "./network";
import YCAddress from "./address";
import YCStrategy from "./strategy";
import YCUser from "./user";
import YCAction from "./action";
// A class representing Yieldchain's classifications. Constructs itself with DB info and has retreival methods/"Indexes"
export class YCClassifications {
    // Singleton Instance
    static instance;
    // From JSON (no async shiet)
    static fromJSON = (_jsonContext) => {
        return new YCClassifications(_jsonContext);
    };
    // =======================
    //      VARIABLES
    // =======================
    // "Endpoints"
    #addresses = [];
    #functions = [];
    #tokens = [];
    #parameters = []; // TODO: Change name to arguments
    #flows = [];
    #protocols = [];
    #strategies = [];
    #networks = [];
    #actions = [];
    #users = [];
    // =======================
    //      CONSTRUCTOR
    //      (SINGLETON)
    // =======================
    constructor(_jsonContext) {
        // Return singleton instance
        if (!YCClassifications.instance) {
            YCClassifications.instance = new YCClassifications();
        }
        // If we got JSON context, we set the fields to it
        if (_jsonContext) {
            YCClassifications.instance.#actions = _jsonContext.actions;
            YCClassifications.instance.#addresses = _jsonContext.addresses;
            YCClassifications.instance.#protocols = _jsonContext.protocols;
            YCClassifications.instance.#networks = _jsonContext.networks;
            YCClassifications.instance.#functions = _jsonContext.functions;
            YCClassifications.instance.#parameters = _jsonContext.parameters;
            YCClassifications.instance.#users = _jsonContext.users;
            YCClassifications.instance.#flows = _jsonContext.flows;
            YCClassifications.instance.#tokens = _jsonContext.tokens;
            YCClassifications.instance.#strategies = _jsonContext.strategies;
        }
        // Return the singleton
        return YCClassifications.instance;
    }
    // Cannot initiallize more than once
    initiallized = false;
    // Initiallize the instance - Populate all endpoints.
    initiallize = async (_api_url = "https://api.yieldchain.io") => {
        // Only init once
        if (this.initiallized)
            return new YCClassifications();
        // Set all of the DB info
        this.#addresses = await (await axios.get(_api_url + "/addresses")).data.addresses;
        this.#functions = await (await axios.get(_api_url + "/functions")).data.functions;
        this.#tokens = await (await axios.get(_api_url + "/tokens")).data.tokens;
        this.#parameters = await (await axios.get(_api_url + "/parameters")).data.parameters;
        this.#flows = await (await axios.get(_api_url + "/flows")).data.flows;
        this.#protocols = await (await axios.get(_api_url + "/protocols")).data.protocols;
        this.#strategies = await (await axios.get(_api_url + "/strategies")).data.strategies;
        this.#networks = await (await axios.get(_api_url + "/networks")).data.networks;
        this.#actions = await (await axios.get(_api_url + "/actions")).data.actions;
        this.#users = await (await axios.get(_api_url + "/users")).data.users;
        // initiallized - can't initiallize anymore
        this.initiallized = true;
        // return instance
        return new YCClassifications();
    };
    // =======================
    //        METHODS
    // =======================
    // ==============
    //    ENDPOINTS
    // ==============
    addresses = () => {
        return this.#addresses.map((address) => new YCAddress(address, this));
    };
    networks = () => {
        return this.#networks.map((network) => new YCNetwork(network, this));
    };
    functions = () => {
        return this.#functions.map((func) => new YCFunc(func, this));
    };
    arguments = (_customValue) => {
        return this.#parameters.map((arg) => new YCArgument(arg, this, _customValue));
    };
    flows = () => {
        return this.#flows.map((flow) => new YCFlow(flow, this));
    };
    strategies = () => {
        return this.#strategies.map((strategy) => new YCStrategy(strategy, this));
    };
    protocols = () => {
        return this.#protocols.map((protocol) => new YCProtocol(protocol, this));
    };
    tokens = () => {
        return this.#tokens.map((token) => new YCToken(token, this));
    };
    actions = () => {
        return this.#actions.map((action) => new YCAction(action, this));
    };
    users = () => {
        return this.#users.map((user) => new YCUser(user, this));
    };
    // users = (): YCUser[] => {
    //   return this.#users.map((user: DBUser) => new YCUser(user, this));
    // };
    // ==============
    //    METHODS
    // ==============
    // Get an address instance using an address / it's DB identifier
    getAddressYC = (_address_or_id) => {
        // Find the address
        return (this.#addresses.find((_address) => {
            // If it's an address (string), find an address obj w the same contract address
            if (typeof _address_or_id == "string")
                return _address.contract_address == _address_or_id;
            // Else, it means it is an ID - find the correpsonding address
            else
                return _address.address_identifier == _address_or_id;
        }) || null);
    };
    // Get a function instance using a function ID
    getFunction = (_function_id) => {
        let func = this.#functions.find((_func) => _func.function_identifier == _function_id) || null;
        return func ? new YCFunc(func, this) : null;
    };
    // Get an argument instance using an argument ID
    getArgument = (_argument_id) => {
        let arg = this.#parameters.find((_arg) => _arg.parameter_identifier == _argument_id) || null;
        return arg ? new YCArgument(arg, this) : null;
    };
    // Get a full flow instance with a flow ID
    getFlow = (_flow_id) => {
        let flow = this.#flows.find((_flow) => _flow.flow_identifier == _flow_id);
        if (flow)
            return new YCFlow(flow, this);
        return null;
    };
    // Get the full Token instance with a token ID
    getToken = (_token_id_or_address, _chain_id, _dbToken) => {
        let token = _dbToken
            ? _dbToken
            : this.#tokens.find((_token) => {
                // User inputted an address & a chain ID
                if (_chain_id && typeof _token_id_or_address == "string")
                    try {
                        let address = getAddress(_token_id_or_address);
                        return (getAddress(_token.address) == address &&
                            _token.chain_id == _chain_id);
                    }
                    catch (err) {
                        throw new Error("TOKEN ERROR: Inputted Address & Chain ID, but an error was caught." +
                            "ADDRESS: " +
                            _token_id_or_address +
                            " CHAIN ID: " +
                            _chain_id +
                            "ERR MSG: " +
                            err.message);
                    }
                // If an ID was inputted, return the token with the same ID
                return _token.token_identifier == _token_id_or_address;
            });
        // Safeguard
        if (!token)
            return null;
        // Return YCToken instance
        return new YCToken(token, this);
    };
    // Get a protoocl
    getProtocol = (_protocolID) => {
        // Search for the protocol
        let protocol = this.#protocols.find((protocol) => protocol.protocol_identifier == _protocolID);
        // If protocol was not found
        if (!protocol)
            return null;
        // Return YCProtocol instance
        return new YCProtocol(protocol, this);
    };
    // Get a network
    getNetwork = (_chainID) => {
        // Search for the network
        let network = this.#networks.find((network) => network.chain_id == _chainID);
        // If network was not found
        if (!network)
            return null;
        // Return YCNetwork instance
        return new YCNetwork(network, this);
    };
    getUser = (_userID) => {
        const user = this.#users.find((_user) => _user.id == _userID);
        if (!user)
            return null;
        return new YCUser(user, this);
    };
}
//# sourceMappingURL=classification.js.map