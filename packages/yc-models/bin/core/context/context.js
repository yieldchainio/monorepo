import { getAddress } from "ethers";
import axios from "axios";
import { PrismaClient, prismaToJson } from "@yc/yc-data";
import { Endpoints, YCUser, YCAction, YCStrategy, YCContract, YCNetwork, YCProtocol, YCToken, YCArgument, YCFunc, fetchRouter, } from "@yc/yc-models";
import { YCStatistic } from "../strategy/statistic.js";
/**
 * @notice
 * A complete context of Yieldchain's current classified Database.
 */
/**
 * @notice
 * A complete context of Yieldchain's current classified Database.
 */
// A class representing Yieldchain's classifications. Constructs itself with DB info and has retreival methods/"Indexes"
class YCClassificationsInternal {
    // Singleton Instance
    static Instance;
    // From JSON (no async shiet)
    static getInstance = (_jsonContext) => {
        if (!YCClassifications.Instance)
            YCClassifications.Instance = new YCClassifications();
        // Initiallize the data points with the provided context, if needed
        if (_jsonContext)
            YCClassifications.Instance.fromJSON(_jsonContext);
        return YCClassifications.Instance;
    };
    // =======================
    //      VARIABLES
    // =======================
    // "Endpoints"
    Addresses = [];
    Functions = [];
    Tokens = [];
    Parameters = []; // TODO: Change name to arguments
    Protocols = [];
    Strategies = [];
    Networks = [];
    Actions = [];
    Statistics = [];
    Users = [];
    YCContractes = [];
    YCfunctions = [];
    YCtokens = [];
    YCparameters = []; // TODO: Change name to arguments
    YCprotocols = [];
    YCstrategies = [];
    YCnetworks = [];
    YCactions = [];
    YCusers = [];
    YCStatistics = [];
    // Prisma Client
    Client = null;
    /**
     * @notice
     * Loading array indiciating whether
     */
    // =======================
    //      CONSTRUCTOR
    //      (SINGLETON)
    // =======================
    constructor() { }
    // Cannot initiallize more than once
    initiallized = false;
    // API URL
    static apiURL = "https://api.yieldchain.io";
    // =======================
    //        METHODS
    // =======================
    // ====================
    //   INTERNAL METHODS
    // ====================
    // All of the fetching functions
    fetchNetworks = async () => {
        this.Networks =
            (await fetchRouter({
                backend: {
                    fetcher: async () => (await this?.Client?.networksv2.findMany()) || [],
                    setter: (value) => (this.Networks = value),
                },
                frontend: {
                    fetcher: async () => await (await axios.get(YCClassifications.apiURL + "/v2/networks")).data.networks,
                    setter: (value) => (this.Networks = value),
                },
            })) || [];
    };
    fetchProtocols = async () => {
        this.Protocols =
            (await fetchRouter({
                backend: {
                    fetcher: async () => (await this?.Client?.protocolsv2.findMany()) || [],
                    setter: (value) => (this.Protocols = value),
                },
                frontend: {
                    fetcher: async () => await (await axios.get(YCClassifications.apiURL + "/v2/protocols")).data.protocols,
                    setter: (value) => (this.Protocols = value),
                },
            })) || [];
    };
    fetchTokens = async () => {
        this.Tokens =
            (await fetchRouter({
                backend: {
                    fetcher: async () => (await this?.Client?.tokensv2.findMany()) || [],
                    setter: (value) => (this.Tokens = value),
                },
                frontend: {
                    fetcher: async () => await (await axios.get(YCClassifications.apiURL + "/v2/tokens")).data.tokens,
                    setter: (value) => (this.Tokens = value),
                },
            })) || [];
    };
    fetchAddresses = async () => {
        this.Addresses = await (await axios.get(YCClassifications.apiURL + "/v2/addresses")).data.addresses;
    };
    fetchFunctions = async () => {
        this.Functions = await (await axios.get(YCClassifications.apiURL + "/v2/functions")).data.functions;
    };
    fetchArguments = async () => {
        this.Parameters = await (await axios.get(YCClassifications.apiURL + "/v2/parameters")).data.parameters;
    };
    fetchUsers = async () => {
        this.Users =
            (await fetchRouter({
                backend: {
                    fetcher: async () => (await this?.Client?.usersv2.findMany()) || [],
                    setter: (value) => (this.Users = value),
                },
                frontend: {
                    fetcher: async () => await (await axios.get(YCClassifications.apiURL + "/v2/users")).data.users,
                    setter: (value) => (this.Users = value),
                },
            })) || [];
    };
    fetchStrategies = async () => {
        (await fetchRouter({
            backend: {
                fetcher: async () => prismaToJson((await this?.Client?.strategiesv2.findMany()) || []),
                setter: (value) => (this.Strategies = value),
            },
            frontend: {
                fetcher: async () => await (await axios.get(YCClassifications.apiURL + "/v2/strategies")).data.strategies,
                setter: (value) => (this.Strategies = value),
            },
        })) || [];
    };
    fetchActions = async () => {
        this.Actions = await (await axios.get(YCClassifications.apiURL + "/v2/actions")).data.actions;
    };
    fetchStatistics = async () => {
        this.Statistics =
            (await fetchRouter({
                backend: {
                    fetcher: async () => ((await this?.Client?.statistics.findMany()) || []),
                },
                frontend: {
                    fetcher: async () => await (await axios.get(YCClassifications.apiURL + "/v2/statistics")).data.statistics,
                    setter: (value) => (this.Statistics = value),
                },
            })) || [];
    };
    // All of the fetching functions
    refreshNetworks = async () => {
        this.YCnetworks = this.Networks.map((network) => new YCNetwork(network, YCClassificationsInternal.getInstance()));
    };
    refreshProtocols = async () => {
        this.YCprotocols = this.Protocols.map((protocol) => new YCProtocol(protocol, YCClassificationsInternal.getInstance()));
    };
    refreshTokens = async () => {
        this.YCtokens = this.Tokens.map((token) => new YCToken(token, YCClassificationsInternal.getInstance()));
    };
    refreshAddresses = async () => {
        this.YCContractes = this.Addresses.map((address) => new YCContract(address, YCClassificationsInternal.getInstance()));
    };
    refreshFunctions = async () => {
        this.YCfunctions = this.Functions.map((func) => new YCFunc(func, YCClassificationsInternal.getInstance()));
    };
    refreshArguments = async () => {
        this.YCparameters = this.Parameters.map((arg) => new YCArgument(arg, YCClassificationsInternal.getInstance()));
    };
    refreshUsers = async () => {
        this.YCusers = this.Users.map((user) => new YCUser(user, YCClassificationsInternal.getInstance()));
    };
    refreshStrategies = async () => {
        this.YCstrategies = this.Strategies.map((strategy) => new YCStrategy(strategy, YCClassificationsInternal.getInstance()));
    };
    refreshActions = async () => {
        this.YCactions = this.Actions.map((action) => new YCAction(action, YCClassificationsInternal.getInstance()));
    };
    refreshStatistics = async () => {
        this.YCStatistics = this.Statistics.map((statistic) => new YCStatistic(statistic));
    };
    /**
     * Fetch all endpoints
     */
    fetchAll = async () => {
        for (const [endpointKey, config] of Object.entries(this.ENDPOINT_CONFIGS)) {
            // Skip the "ALL" endpoint (we dont want an infinite limbo ser)
            if (endpointKey == Endpoints.ALL)
                continue;
            // Refresh it
            await config.fetch();
        }
    };
    /**
     * Refresh all class endpoints
     */
    refreshAll = async () => {
        for (const [endpointKey, config] of Object.entries(this.ENDPOINT_CONFIGS)) {
            // Skip the "ALL" endpoint (we dont want an infinite limbo ser)
            if (endpointKey == Endpoints.ALL)
                continue;
            // Refresh it
            await config.refresh();
        }
    };
    /**
     * All of the configs for each endpoint
     */
    ENDPOINT_CONFIGS = {
        [Endpoints.ALL]: {
            fetch: this.fetchAll,
            refresh: this.refreshAll,
            get: () => "",
        },
        [Endpoints.NETWORKS]: {
            fetch: this.fetchNetworks,
            refresh: this.refreshNetworks,
            get: () => YCClassificationsInternal.Instance.Networks,
        },
        [Endpoints.ADDRESSES]: {
            fetch: this.fetchAddresses,
            refresh: this.refreshAddresses,
            get: () => YCClassificationsInternal.Instance.Addresses,
        },
        [Endpoints.PROTOCOLS]: {
            fetch: this.fetchProtocols,
            refresh: this.refreshProtocols,
            get: () => YCClassificationsInternal.Instance.Protocols,
        },
        [Endpoints.TOKENS]: {
            fetch: this.fetchTokens,
            refresh: this.refreshTokens,
            get: () => YCClassificationsInternal.Instance.Tokens,
        },
        [Endpoints.STRATEGIES]: {
            fetch: this.fetchStrategies,
            refresh: this.refreshStrategies,
            get: () => YCClassificationsInternal.Instance.Networks,
        },
        [Endpoints.ACTIONS]: {
            fetch: this.fetchActions,
            refresh: this.refreshActions,
            get: () => YCClassificationsInternal.Instance.Actions,
        },
        [Endpoints.USERS]: {
            fetch: this.fetchUsers,
            refresh: this.refreshUsers,
            get: () => YCClassificationsInternal.Instance.Users,
        },
        [Endpoints.ARGUMENTS]: {
            fetch: this.fetchArguments,
            refresh: this.refreshArguments,
            get: () => YCClassificationsInternal.Instance.Parameters,
        },
        [Endpoints.FUNCTIONS]: {
            fetch: this.fetchFunctions,
            refresh: this.refreshFunctions,
            get: () => YCClassificationsInternal.Instance.Functions,
        },
        [Endpoints.STATISTICS]: {
            fetch: this.fetchStatistics,
            refresh: this.refreshStatistics,
            get: () => YCClassificationsInternal.Instance.Statistics,
        },
    };
    /**
     * Validates we are not on a browser, and creates a client as needed
     * @param - Client, just for proper compile-time type checking
     */
    validateClient = (_client = this.Client) => {
        if (typeof window !== "undefined")
            return false;
        if (!this.Client)
            this.Client = new PrismaClient();
        return true;
    };
}
// A class representing Yieldchain's classifications. Constructs itself with DB info and has retreival methods/"Indexes"
export class YCClassifications extends YCClassificationsInternal {
    // =======================
    //      CONSTRUCTOR
    //      (SINGLETON)
    // =======================
    constructor() {
        super();
    }
    // API URL
    static apiURL = "https://api.yieldchain.io";
    // =======================
    //      CORE METHODS
    // =======================
    /**
     * Initiate the context class using a JSON object
     */
    fromJSON = (jsonContext) => {
        if (!this.initiallized)
            this.initiallized = true;
        this.Addresses = jsonContext.addresses;
        this.Actions = jsonContext.actions;
        this.Tokens = jsonContext.tokens;
        this.Functions = jsonContext.funcs;
        this.Networks = jsonContext.networks;
        this.Parameters = jsonContext.parameters;
        this.Protocols = jsonContext.protocols;
        this.Strategies = jsonContext.strategies;
        this.Users = jsonContext.users;
        this.Statistics = jsonContext.statistics;
    };
    /**
     * Convert the class endpoints to JSON
     */
    toJSON = () => {
        // Initiate an object that will hold the endpoints
        const obj = {};
        // Iterate over each endpoint
        for (const [endpoint, config] of Object.entries(this.ENDPOINT_CONFIGS)) {
            obj[endpoint] = config.get();
        }
        // Return the object
        return obj;
    };
    // Initiallize the instance - Populate all endpoints.
    initiallize = async (jsonContext, forceFrontend = false) => {
        // Only init once
        if (!this.initiallized)
            this.initiallized = true;
        // Set a prisma client if we are not on a frontend
        if (!forceFrontend)
            this.validateClient();
        /**
         * Initiallize all of the data
         */
        // Initiallize from JSON context if provided
        if (jsonContext)
            return this.fromJSON(jsonContext);
        // Else initiallize using fetched data
        await this.fetchAll();
    };
    /**
     * Refresh an endpoint(s)' data
     */
    refresh = async (_endpoints) => {
        // Shove em into an array
        const endpoints = Array.isArray(_endpoints) ? _endpoints : [_endpoints];
        try {
            // If they requested all, we just refresh all and return
            if (endpoints.some((endpoint) => endpoint == Endpoints.ALL)) {
                await this.fetchAll();
                await this.refreshAll();
                return true;
            }
            // Iterate over each endpoint
            for (const endpoint of endpoints) {
                // get the config
                const config = this.ENDPOINT_CONFIGS[endpoint];
                // Continue if invalid config (sufficient check)
                if (!config)
                    continue;
                // Fetch, refresh the endpoint
                await config.fetch();
                await config.refresh();
            }
            return true;
        }
        catch (e) {
            console.error("Error while refreshing YC Context. Endpoint:", endpoints, "Err:", e);
            return false;
        }
    };
    // =======================
    //        METHODS
    // =======================
    get client() {
        return this.Client || null;
    }
    // ==============
    //    ENDPOINTS
    // ==============
    get addresses() {
        if (!this.YCContractes.length)
            this.YCContractes = this.Addresses.map((address) => new YCContract(address, this));
        return this.YCContractes;
    }
    get rawAddresses() {
        return this.Addresses;
    }
    get networks() {
        if (!this.YCnetworks.length) {
            const networks = this.Networks.map((network) => new YCNetwork(network, this));
            this.YCnetworks = networks;
        }
        return this.YCnetworks;
    }
    get functions() {
        if (!this.YCfunctions.length)
            this.YCfunctions = this.Functions.map((func) => new YCFunc(func, this));
        return this.YCfunctions;
    }
    get rawFunctions() {
        return this.Functions;
    }
    get arguments() {
        if (!this.YCparameters.length)
            this.YCparameters = this.Parameters.map((arg) => new YCArgument(arg, this));
        return this.YCparameters;
    }
    get rawArguments() {
        return this.Parameters;
    }
    get strategies() {
        if (!this.YCstrategies.length) {
            this.YCstrategies = this.Strategies.map((strategy) => new YCStrategy(strategy, this));
        }
        return this.YCstrategies;
    }
    get rawStrategies() {
        return this.Strategies;
    }
    get protocols() {
        if (!this.YCprotocols.length)
            this.YCprotocols = this.Protocols.map((protocol) => new YCProtocol(protocol, this));
        return this.YCprotocols;
    }
    get tokens() {
        if (!this.YCtokens.length) {
            this.YCtokens = this.Tokens.map((token) => new YCToken(token, this));
        }
        return this.YCtokens;
    }
    get rawTokens() {
        return this.Tokens;
    }
    get actions() {
        if (!this.YCactions.length)
            this.YCactions = this.Actions.map((action) => new YCAction(action, this));
        return this.YCactions;
    }
    get users() {
        if (!this.YCusers.length) {
            const users = this.Users.map((user) => new YCUser(user, this));
            this.YCusers = users;
        }
        return this.YCusers;
    }
    get statistics() {
        if (!this.YCStatistics.length) {
            this.YCStatistics = this.Statistics.map((stat) => new YCStatistic(stat));
        }
        return this.YCStatistics;
    }
    // ==============
    //    METHODS
    // ==============
    // Get an address instance using an address / it's DB identifier
    getAddress = (_address_id) => {
        // Find the address
        return (this.addresses.find((_address) => _address.id === _address_id) || null);
    };
    // Get an action instance using an ID
    getAction = (actionId) => {
        return (this.actions.find((action) => action.id === actionId) || null);
    };
    // Get a function instance using a function ID
    getFunction = (_function_id) => {
        return (this.functions.find((_func) => _func.id == _function_id) || null);
    };
    // Get an argument instance using an argument ID
    getArgument = (_argument_id) => {
        return (this.arguments.find((_arg) => _arg.id == _argument_id) || null);
    };
    // Get the full Token instance with a token ID
    getToken = (_token_id_or_address, _chain_id, _dbToken) => {
        return (this.tokens.find((_token) => {
            // User inputted an address & a chain ID
            if (_chain_id)
                try {
                    let address = getAddress(_token_id_or_address);
                    return (getAddress(_token.address) == address &&
                        (typeof _chain_id == "number"
                            ? _token.network?.id == _chain_id
                            : _token.network?.id == _chain_id.id));
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
            return _token.id == _token_id_or_address;
        }) || null);
    };
    // Get a protoocl
    getProtocol = (_protocolID) => {
        // Search for the protocol
        let protocol = this.Protocols.find((protocol) => protocol.id == _protocolID);
        // If protocol was not found
        if (!protocol)
            return null;
        // Return YCProtocol instance
        return new YCProtocol(protocol, this);
    };
    // Get a network
    getNetwork = (_id) => {
        return (this.networks.find((network) => network.id == _id) || null);
    };
    getUser = (_userID) => {
        return this.users.find((_user) => _user.id == _userID) || null;
    };
    getStrategyStats = (_strategyID) => {
        return this.statistics.filter((stat) => stat.strategyId == _strategyID);
    };
}
//# sourceMappingURL=context.js.map