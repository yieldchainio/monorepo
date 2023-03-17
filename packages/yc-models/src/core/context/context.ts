import { getAddress } from "ethers";
import axios from "axios";
import { PrismaClient, prismaToJson } from "@yc/yc-data";
import {
  Endpoints,
  ClassificationContext,
  YCUser,
  YCAction,
  YCStrategy,
  YCAddress,
  YCNetwork,
  YCProtocol,
  YCToken,
  YCFlow,
  YCArgument,
  CustomArgument,
  YCFunc,
  DBAddress,
  DBFlow,
  DBFunction,
  DBToken,
  DBArgument,
  DBStrategy,
  DBProtocol,
  DBNetwork,
  DBAction,
  DBUser,
  fetchRouter,
} from "@yc/yc-models";

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
  protected static Instance: YCClassifications;

  // From JSON (no async shiet)
  static getInstance = (
    _jsonContext?: ClassificationContext
  ): YCClassifications => {
    if (!YCClassifications.Instance)
      YCClassifications.Instance = new YCClassifications();

    // Initiallize the data points with the provided context, if needed
    if (_jsonContext) YCClassifications.Instance.fromJSON(_jsonContext);

    return YCClassifications.Instance;
  };
  // =======================
  //      VARIABLES
  // =======================

  // "Endpoints"
  protected Addresses: DBAddress[] = [];
  protected Functions: DBFunction[] = [];
  protected Tokens: DBToken[] = [];
  protected Parameters: DBArgument[] = []; // TODO: Change name to arguments
  protected Flows: DBFlow[] = [];
  protected Protocols: DBProtocol[] = [];
  protected Strategies: DBStrategy[] = [];
  protected Networks: DBNetwork[] = [];
  protected Actions: DBAction[] = [];
  protected Users: DBUser[] = [];

  YCaddresses: YCAddress[] = [];
  YCfunctions: YCFunc[] = [];
  YCtokens: YCToken[] = [];
  YCparameters: YCArgument[] = []; // TODO: Change name to arguments
  YCflows: YCFlow[] = [];
  YCprotocols: YCProtocol[] = [];
  YCstrategies: YCStrategy[] = [];
  YCnetworks: YCNetwork[] = [];
  YCactions: YCAction[] = [];
  YCusers: YCUser[] = [];

  // Prisma Client
  protected Client: PrismaClient | null = null;

  /**
   * @notice
   * Loading array indiciating whether
   */

  // =======================
  //      CONSTRUCTOR
  //      (SINGLETON)
  // =======================
  constructor() {}

  // Cannot initiallize more than once
  initiallized: boolean = false;

  // API URL
  static apiURL = "https://api.yieldchain.io";

  // =======================
  //        METHODS
  // =======================

  // ====================
  //   INTERNAL METHODS
  // ====================

  // All of the fetching functions
  protected fetchNetworks = async () => {
    this.Networks =
      (await fetchRouter<DBNetwork[]>({
        backend: {
          fetcher: async () =>
            (await this?.Client?.networksv2.findMany()) || [],
          setter: (value: DBNetwork[]) => (this.Networks = value),
        },
        frontend: {
          fetcher: async () =>
            await (
              await axios.get(YCClassifications.apiURL + "/networks")
            ).data.networks,
          setter: (value: DBNetwork[]) => (this.Networks = value),
        },
      })) || [];
  };

  protected fetchProtocols = async () => {
    this.Protocols =
      (await fetchRouter<DBProtocol[]>({
        backend: {
          fetcher: async () =>
            (await this?.Client?.protocolsv2.findMany()) || [],
          setter: (value: DBProtocol[]) => (this.Protocols = value),
        },
        frontend: {
          fetcher: async () =>
            await (
              await axios.get(YCClassifications.apiURL + "/protocols")
            ).data.protocols,
          setter: (value: DBProtocol[]) => (this.Protocols = value),
        },
      })) || [];
  };

  protected fetchTokens = async () => {
    this.Tokens =
      (await fetchRouter<DBToken[]>({
        backend: {
          fetcher: async () => (await this?.Client?.tokensv2.findMany()) || [],
          setter: (value: DBToken[]) => (this.Tokens = value),
        },
        frontend: {
          fetcher: async () =>
            await (
              await axios.get(YCClassifications.apiURL + "/tokens")
            ).data.tokens,
          setter: (value: DBToken[]) => (this.Tokens = value),
        },
      })) || [];
  };

  protected fetchAddresses = async () => {
    this.Addresses = await (
      await axios.get(YCClassifications.apiURL + "/addresses")
    ).data.addresses;
  };

  protected fetchFunctions = async () => {
    this.Functions = await (
      await axios.get(YCClassifications.apiURL + "/functions")
    ).data.functions;
  };

  protected fetchArguments = async () => {
    this.Parameters = await (
      await axios.get(YCClassifications.apiURL + "/parameters")
    ).data.parameters;
  };

  protected fetchFlows = async () => {
    this.Flows = await (
      await axios.get(YCClassifications.apiURL + "/flows")
    ).data.flows;
  };

  protected fetchUsers = async () => {
    this.Users =
      (await fetchRouter<DBUser[]>({
        backend: {
          fetcher: async () => (await this?.Client?.usersv2.findMany()) || [],
          setter: (value: DBUser[]) => (this.Users = value),
        },
        frontend: {
          fetcher: async () =>
            await (
              await axios.get(YCClassifications.apiURL + "/users")
            ).data.users,
          setter: (value: DBUser[]) => (this.Users = value),
        },
      })) || [];
  };

  protected fetchStrategies = async () => {
    (await fetchRouter<DBStrategy[]>({
      backend: {
        fetcher: async () =>
          prismaToJson<DBStrategy[]>(
            (await this?.Client?.strategiesv2.findMany()) || []
          ),
        setter: (value: DBStrategy[]) => (this.Strategies = value),
      },
      frontend: {
        fetcher: async () =>
          await (
            await axios.get(YCClassifications.apiURL + "/strategies")
          ).data.strategies,
        setter: (value: DBStrategy[]) => (this.Strategies = value),
      },
    })) || [];
  };

  protected fetchActions = async () => {
    this.Actions = await (
      await axios.get(YCClassifications.apiURL + "/actions")
    ).data.actions;
  };

  // All of the fetching functions
  protected refreshNetworks = async () => {
    this.YCnetworks = this.Networks.map(
      (network: DBNetwork) =>
        new YCNetwork(network, YCClassificationsInternal.getInstance())
    );
  };

  protected refreshProtocols = async () => {
    this.YCprotocols = this.Protocols.map(
      (protocol: DBProtocol) =>
        new YCProtocol(protocol, YCClassificationsInternal.getInstance())
    );
  };

  protected refreshTokens = async () => {
    this.YCtokens = this.Tokens.map(
      (token: DBToken) =>
        new YCToken(token, YCClassificationsInternal.getInstance())
    );
  };

  protected refreshAddresses = async () => {
    this.YCaddresses = this.Addresses.map(
      (address: DBAddress) =>
        new YCAddress(address, YCClassificationsInternal.getInstance())
    );
  };

  protected refreshFunctions = async () => {
    this.YCfunctions = this.Functions.map(
      (func: DBFunction) =>
        new YCFunc(func, YCClassificationsInternal.getInstance())
    );
  };

  protected refreshArguments = async () => {
    this.YCparameters = this.Parameters.map(
      (arg: DBArgument) =>
        new YCArgument(arg, YCClassificationsInternal.getInstance())
    );
  };

  protected refreshFlows = async () => {
    this.YCflows = this.Flows.map(
      (flow: DBFlow) =>
        new YCFlow(flow, YCClassificationsInternal.getInstance())
    );
  };

  protected refreshUsers = async () => {
    this.YCusers = this.Users.map(
      (user: DBUser) =>
        new YCUser(user, YCClassificationsInternal.getInstance())
    );
  };

  protected refreshStrategies = async () => {
    this.YCstrategies = this.Strategies.map(
      (strategy: DBStrategy) =>
        new YCStrategy(strategy, YCClassificationsInternal.getInstance())
    );
  };

  protected refreshActions = async () => {
    this.YCactions = this.Actions.map(
      (action: DBAction) =>
        new YCAction(action, YCClassificationsInternal.getInstance())
    );
  };

  /**
   * Fetch all endpoints
   */
  protected fetchAll = async () => {
    for (const [endpointKey, config] of Object.entries(this.ENDPOINT_CONFIGS)) {
      // Skip the "ALL" endpoint (we dont want an infinite limbo ser)
      if (endpointKey == Endpoints.ALL) continue;

      // Refresh it
      await config.fetch();
    }
  };
  /**
   * Refresh all class endpoints
   */

  protected refreshAll = async () => {
    for (const [endpointKey, config] of Object.entries(this.ENDPOINT_CONFIGS)) {
      // Skip the "ALL" endpoint (we dont want an infinite limbo ser)
      if (endpointKey == Endpoints.ALL) continue;

      // Refresh it
      await config.refresh();
    }
  };

  /**
   * All of the configs for each endpoint
   */
  protected ENDPOINT_CONFIGS: {
    [key in Endpoints]: {
      fetch: () => any;
      refresh: () => any;
      get: () => any;
    };
  } = {
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

    [Endpoints.FLOWS]: {
      fetch: this.fetchFlows,
      refresh: this.refreshFlows,
      get: () => YCClassificationsInternal.Instance.Flows,
    },

    [Endpoints.ARGUMENTS]: {
      fetch: this.fetchArguments,
      refresh: this.refreshArguments,
      get: () => YCClassificationsInternal.Instance.Parameters,
    },

    [Endpoints.ADDRESSES]: {
      fetch: this.fetchAddresses,
      refresh: this.refreshAddresses,
      get: () => YCClassificationsInternal.Instance.Addresses,
    },

    [Endpoints.FUNCTIONS]: {
      fetch: this.fetchFunctions,
      refresh: this.refreshFunctions,
      get: () => YCClassificationsInternal.Instance.Functions,
    },
  };

  /**
   * Validates we are not on a browser, and creates a client as needed
   * @param - Client, just for proper compile-time type checking
   */
  protected validateClient = (
    _client: PrismaClient | null = this.Client
  ): _client is PrismaClient => {
    if (typeof window !== "undefined") return false;
    if (!this.Client) this.Client = new PrismaClient();
    return true;
  };
}

/**
 * Configs for them
 */

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
  fromJSON = (jsonContext: ClassificationContext) => {
    if (!this.initiallized) this.initiallized = true;

    this.Addresses = jsonContext.addresses;
    this.Actions = jsonContext.actions;
    this.Flows = jsonContext.flows;
    this.Tokens = jsonContext.tokens;
    this.Functions = jsonContext.funcs;
    this.Networks = jsonContext.networks;
    this.Parameters = jsonContext.parameters;
    this.Protocols = jsonContext.protocols;
    this.Strategies = jsonContext.strategies;
    this.Users = jsonContext.users;
  };

  /**
   * Convert the class endpoints to JSON
   */
  toJSON = (): ClassificationContext => {
    // Initiate an object that will hold the endpoints
    const obj: {
      [key in Endpoints]?: any;
    } = {};

    // Iterate over each endpoint
    for (const [endpoint, config] of Object.entries(this.ENDPOINT_CONFIGS)) {
      obj[endpoint as Endpoints] = config.get();
    }

    // Return the object
    return obj as ClassificationContext;
  };

  // Initiallize the instance - Populate all endpoints.
  public initiallize = async (
    jsonContext?: ClassificationContext
  ): Promise<void> => {
    // Only init once
    if (!this.initiallized) this.initiallized = true;

    // Set a prisma client if we are not on a frontend
    this.validateClient();

    /**
     * Initiallize all of the data
     */

    // Initiallize from JSON context if provided
    if (jsonContext) return this.fromJSON(jsonContext);

    // Else initiallize using fetched data
    await this.fetchAll();
  };

  /**
   * Refresh an endpoint(s)' data
   */

  public refresh = async (
    _endpoints: Endpoints[] | Endpoints
  ): Promise<boolean> => {
    console.log("Refresh is called!");
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
        console.log("Refreshing this endpoint:", endpoint);
        // get the config
        const config = this.ENDPOINT_CONFIGS[endpoint];

        // Continue if invalid config (sufficient check)
        if (!config) continue;

        // Fetch, refresh the endpoint
        await config.fetch();
        await config.refresh();
      }

      return true;
    } catch (e: any) {
      const err = e as Error;
      console.error(
        "Error while refreshing YC Context. Endpoint:",
        endpoints,
        "Err:",
        e
      );

      return false;
    }
  };

  // =======================
  //        METHODS
  // =======================

  get client(): PrismaClient | null {
    return this.Client || null;
  }

  // ==============
  //    ENDPOINTS
  // ==============
  get addresses() {
    if (!this.YCaddresses.length)
      this.YCaddresses = this.Addresses.map(
        (address: DBAddress) => new YCAddress(address, this)
      );

    return this.YCaddresses;
  }

  get networks() {
    if (!this.YCnetworks.length) {
      const networks = this.Networks.map(
        (network: DBNetwork) => new YCNetwork(network, this)
      );
      this.YCnetworks = networks;
    }
    return this.YCnetworks;
  }

  get functions() {
    if (!this.YCfunctions.length)
      this.YCfunctions = this.Functions.map(
        (func: DBFunction) => new YCFunc(func, this)
      );
    return this.YCfunctions;
  }

  get arguments() {
    if (!this.YCparameters.length)
      this.YCparameters = this.Parameters.map(
        (arg: DBArgument) => new YCArgument(arg, this)
      );

    return this.YCparameters;
  }

  getArguments = (_customValue?: CustomArgument) => {
    return this.Parameters.map(
      (arg: DBArgument) => new YCArgument(arg, this, _customValue)
    );
  };

  get flows() {
    if (!this.YCflows.length)
      this.YCflows = this.Flows.map((flow: DBFlow) => new YCFlow(flow, this));
    return this.YCflows;
  }

  get strategies() {
    console.log("YC strategies ser:", this.YCstrategies);
    if (!this.YCstrategies.length) {
      console.log("Not YC strategies length!!!");
      this.YCstrategies = this.Strategies.map(
        (strategy: DBStrategy) => new YCStrategy(strategy, this)
      );
    }
    return this.YCstrategies;
  }

  get protocols() {
    if (!this.YCprotocols.length)
      this.YCprotocols = this.Protocols.map(
        (protocol: DBProtocol) => new YCProtocol(protocol, this)
      );

    return this.YCprotocols;
  }

  get tokens(): YCToken[] {
    if (!this.YCtokens.length)
      this.YCtokens = this.Tokens.map(
        (token: DBToken) => new YCToken(token, this)
      );
    return this.YCtokens;
  }

  get actions(): YCAction[] {
    if (!this.YCactions.length)
      this.YCactions = this.Actions.map(
        (action: DBAction) => new YCAction(action, this)
      );

    return this.YCactions;
  }

  get users() {
    if (!this.YCusers.length) {
      const users = this.Users.map((user: DBUser) => new YCUser(user, this));
      this.YCusers = users;
    }
    return this.YCusers;
  }

  // ==============
  //    METHODS
  // ==============

  // Get an address instance using an address / it's DB identifier
  getAddressYC = (_address_or_id: number | string): DBAddress | null => {
    // Find the address
    return (
      this.Addresses.find((_address: DBAddress) => {
        // If it's an address (string), find an address obj w the same contract address
        if (typeof _address_or_id == "string")
          return _address.contract_address == _address_or_id;
        // Else, it means it is an ID - find the correpsonding address
        else return _address.address_identifier == _address_or_id;
      }) || null
    );
  };

  // Get a function instance using a function ID
  getFunction = (_function_id: number): YCFunc | null => {
    let func =
      this.Functions.find(
        (_func: DBFunction) => _func.function_identifier == _function_id
      ) || null;

    return func ? new YCFunc(func, this) : null;
  };

  // Get an argument instance using an argument ID
  getArgument = (_argument_id: number): YCArgument | null => {
    let arg =
      this.Parameters.find(
        (_arg: DBArgument) => _arg.parameter_identifier == _argument_id
      ) || null;

    return arg ? new YCArgument(arg, this) : null;
  };

  // Get a full flow instance with a flow ID
  getFlow = (_flow_id: number): YCFlow | null => {
    let flow = this.Flows.find((_flow: DBFlow) => _flow.id == _flow_id);
    if (flow) return new YCFlow(flow, this);
    return null;
  };

  // Get the full Token instance with a token ID
  getToken = (
    _token_id_or_address: string,
    _chain_id?: number | string,
    _dbToken?: DBToken
  ): YCToken | null => {
    return (
      this.tokens.find((_token: YCToken) => {
        // User inputted an address & a chain ID
        if (_chain_id && typeof _token_id_or_address == "string")
          try {
            let address = getAddress(_token_id_or_address);
            return (
              getAddress(_token.address) == address &&
              _token.chainId == _chain_id
            );
          } catch (err: any) {
            throw new Error(
              "TOKEN ERROR: Inputted Address & Chain ID, but an error was caught." +
                "ADDRESS: " +
                _token_id_or_address +
                " CHAIN ID: " +
                _chain_id +
                "ERR MSG: " +
                err.message
            );
          }

        // If an ID was inputted, return the token with the same ID
        return _token.id == _token_id_or_address;
      }) || null
    );
  };

  // Get a protoocl
  getProtocol = (_protocolID: string) => {
    // Search for the protocol
    let protocol = this.Protocols.find(
      (protocol: DBProtocol) => protocol.id == _protocolID
    );

    // If protocol was not found
    if (!protocol) return null;

    // Return YCProtocol instance
    return new YCProtocol(protocol, this);
  };

  // Get a network
  getNetwork = (_chainID: number) => {
    // Search for the network
    let network = this.Networks.find(
      (network: DBNetwork) => network.id == _chainID
    );

    // If network was not found
    if (!network) return null;

    // Return YCNetwork instance
    return new YCNetwork(network, this);
  };

  getUser = (_userID: string): YCUser | null => {
    return this.users.find((_user: YCUser) => _user.id == _userID) || null;
  };
}
