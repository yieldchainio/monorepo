import { getAddress } from "ethers";
import axios from "axios";
import { PrismaClient, prismaToJson } from "@yc/yc-data";
import {
  Endpoints,
  ClassificationContext,
  YCUser,
  YCAction,
  YCStrategy,
  YCContract,
  YCNetwork,
  YCProtocol,
  YCToken,
  YCFlow,
  YCArgument,
  YCFunc,
  DBContract,
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
  DBStatistic,
} from "@yc/yc-models";
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
  protected Addresses: DBContract[] = [];
  protected Functions: DBFunction[] = [];
  protected Tokens: DBToken[] = [];
  protected Parameters: DBArgument[] = []; // TODO: Change name to arguments
  protected Protocols: DBProtocol[] = [];
  protected Strategies: DBStrategy[] = [];
  protected Networks: DBNetwork[] = [];
  protected Actions: DBAction[] = [];
  protected Statistics: DBStatistic[] = [];
  protected Users: DBUser[] = [];

  YCContractes: YCContract[] = [];
  YCfunctions: YCFunc[] = [];
  YCtokens: YCToken[] = [];
  YCparameters: YCArgument[] = []; // TODO: Change name to arguments
  YCprotocols: YCProtocol[] = [];
  YCstrategies: YCStrategy[] = [];
  YCnetworks: YCNetwork[] = [];
  YCactions: YCAction[] = [];
  YCusers: YCUser[] = [];
  YCStatistics: YCStatistic[] = [];

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
              await axios.get(YCClassifications.apiURL + "/v2/networks")
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
              await axios.get(YCClassifications.apiURL + "/v2/protocols")
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
              await axios.get(YCClassifications.apiURL + "/v2/tokens")
            ).data.tokens,
          setter: (value: DBToken[]) => (this.Tokens = value),
        },
      })) || [];
  };

  protected fetchAddresses = async () => {
    this.Addresses = await (
      await axios.get(YCClassifications.apiURL + "/v2/addresses")
    ).data.addresses;
  };

  protected fetchFunctions = async () => {
    this.Functions = await (
      await axios.get(YCClassifications.apiURL + "/v2/functions")
    ).data.functions;
  };

  protected fetchArguments = async () => {
    this.Parameters = await (
      await axios.get(YCClassifications.apiURL + "/v2/parameters")
    ).data.parameters;
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
              await axios.get(YCClassifications.apiURL + "/v2/users")
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
            await axios.get(YCClassifications.apiURL + "/v2/strategies")
          ).data.strategies,
        setter: (value: DBStrategy[]) => (this.Strategies = value),
      },
    })) || [];
  };

  protected fetchActions = async () => {
    this.Actions = await (
      await axios.get(YCClassifications.apiURL + "/v2/actions")
    ).data.actions;
  };

  protected fetchStatistics = async () => {
    this.Statistics =
      (await fetchRouter<DBStatistic[]>({
        backend: {
          fetcher: async () =>
            <DBStatistic[]>((await this?.Client?.statistics.findMany()) || []),
        },
        frontend: {
          fetcher: async () =>
            await (
              await axios.get(YCClassifications.apiURL + "/v2/statistics")
            ).data.statistics,

          setter: (value: DBStatistic[]) => (this.Statistics = value),
        },
      })) || [];
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
    this.YCContractes = this.Addresses.map(
      (address: DBContract) =>
        new YCContract(address, YCClassificationsInternal.getInstance())
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

  protected refreshStatistics = async () => {
    this.YCStatistics = this.Statistics.map(
      (statistic: DBStatistic) => new YCStatistic(statistic)
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
  protected validateClient = (
    _client: PrismaClient | null = this.Client
  ): _client is PrismaClient => {
    if (typeof window !== "undefined") return false;
    if (!this.Client) this.Client = new PrismaClient();
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
  fromJSON = (jsonContext: ClassificationContext) => {
    if (!this.initiallized) this.initiallized = true;

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
        if (!config) continue;

        // Fetch, refresh the endpoint
        await config.fetch();
        await config.refresh();
      }

      return true;
    } catch (e: any) {
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
    if (!this.YCContractes.length)
      this.YCContractes = this.Addresses.map(
        (address: DBContract) => new YCContract(address, this)
      );

    return this.YCContractes;
  }

  get rawAddresses() {
    return this.Addresses;
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

  get rawFunctions() {
    return this.Functions;
  }

  get arguments() {
    if (!this.YCparameters.length)
      this.YCparameters = this.Parameters.map(
        (arg: DBArgument) => new YCArgument(arg, this)
      );

    return this.YCparameters;
  }

  get rawArguments() {
    return this.Parameters;
  }

  get strategies() {
    if (!this.YCstrategies.length) {
      this.YCstrategies = this.Strategies.map(
        (strategy: DBStrategy) => new YCStrategy(strategy, this)
      );
    }
    return this.YCstrategies;
  }

  get rawStrategies() {
    return this.Strategies;
  }

  get protocols() {
    if (!this.YCprotocols.length)
      this.YCprotocols = this.Protocols.map(
        (protocol: DBProtocol) => new YCProtocol(protocol, this)
      );

    return this.YCprotocols;
  }

  get tokens(): YCToken[] {
    if (!this.YCtokens.length) {
      this.YCtokens = this.Tokens.map(
        (token: DBToken) => new YCToken(token, this)
      );
    }
    return this.YCtokens;
  }

  get rawTokens(): DBToken[] {
    return this.Tokens;
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
  getAddress = (_address_id: string): YCContract | null => {
    // Find the address
    return (
      this.addresses.find(
        (_address: YCContract) => _address.id === _address_id
      ) || null
    );
  };

  // Get an action instance using an ID
  getAction = (actionId: string): YCAction | null => {
    return (
      this.actions.find((action: YCAction) => action.id === actionId) || null
    );
  };

  // Get a function instance using a function ID
  getFunction = (_function_id: string): YCFunc | null => {
    return (
      this.functions.find((_func: YCFunc) => _func.id == _function_id) || null
    );
  };

  // Get an argument instance using an argument ID
  getArgument = (_argument_id: string): YCArgument | null => {
    return (
      this.arguments.find((_arg: YCArgument) => _arg.id == _argument_id) || null
    );
  };

  // Get the full Token instance with a token ID
  getToken = (
    _token_id_or_address: string,
    _chain_id?: number | YCNetwork,
    _dbToken?: DBToken
  ): YCToken | null => {
    return (
      this.tokens.find((_token: YCToken) => {
        // User inputted an address & a chain ID
        if (_chain_id)
          try {
            let address = getAddress(_token_id_or_address);
            return (
              getAddress(_token.address) == address &&
              (typeof _chain_id == "number"
                ? _token.network?.id == _chain_id
                : _token.network?.id == _chain_id.id)
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
  getNetwork = (_id: number) => {
    return (
      this.networks.find((network: YCNetwork) => network.id == _id) || null
    );
  };

  getUser = (_userID: string): YCUser | null => {
    return this.users.find((_user: YCUser) => _user.id == _userID) || null;
  };

  getStrategyStats = (_strategyID: string): YCStatistic[] => {
    return this.statistics.filter((stat) => stat.strategyId == _strategyID);
  };
}
