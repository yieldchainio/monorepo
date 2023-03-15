import axios from "axios";
import { PrismaClient } from "@yc/yc-data";
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
  YCClassifications,
} from "@yc/yc-models";

/**
 * @notice
 * A complete context of Yieldchain's current classified Database.
 */

// A class representing Yieldchain's classifications. Constructs itself with DB info and has retreival methods/"Indexes"
export class YCClassificationsInternal {
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

  protected YCaddresses: YCAddress[] = [];
  protected YCfunctions: YCFunc[] = [];
  protected YCtokens: YCToken[] = [];
  protected YCparameters: YCArgument[] = []; // TODO: Change name to arguments
  protected YCflows: YCFlow[] = [];
  protected YCprotocols: YCProtocol[] = [];
  protected YCstrategies: YCStrategy[] = [];
  protected YCnetworks: YCNetwork[] = [];
  protected YCactions: YCAction[] = [];
  protected YCusers: YCUser[] = [];

  // Prisma Client
  protected Client: PrismaClient | null = null;

  // =======================
  //      CONSTRUCTOR
  //      (SINGLETON)
  // =======================
  constructor() {}

  // Cannot initiallize more than once
  public initiallized: boolean = false;

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
    this.Strategies = await (
      await axios.get(YCClassifications.apiURL + "/strategies")
    ).data.strategies;
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
        new YCNetwork(network, YCClassificationsInternal.Instance)
    );
  };

  protected refreshProtocols = async () => {
    this.YCprotocols = this.Protocols.map(
      (protocol: DBProtocol) =>
        new YCProtocol(protocol, YCClassificationsInternal.Instance)
    );
  };

  protected refreshTokens = async () => {
    this.YCtokens = this.Tokens.map(
      (token: DBToken) => new YCToken(token, YCClassificationsInternal.Instance)
    );
  };

  protected refreshAddresses = async () => {
    this.YCaddresses = this.Addresses.map(
      (address: DBAddress) =>
        new YCAddress(address, YCClassificationsInternal.Instance)
    );
  };

  protected refreshFunctions = async () => {
    this.YCfunctions = this.Functions.map(
      (func: DBFunction) => new YCFunc(func, YCClassificationsInternal.Instance)
    );
  };

  protected refreshArguments = async () => {
    this.YCparameters = this.Parameters.map(
      (arg: DBArgument) =>
        new YCArgument(arg, YCClassificationsInternal.Instance)
    );
  };

  protected refreshFlows = async () => {
    this.YCflows = this.Flows.map(
      (flow: DBFlow) => new YCFlow(flow, YCClassificationsInternal.Instance)
    );
  };

  protected refreshUsers = async () => {
    this.YCusers = this.Users.map(
      (user: DBUser) => new YCUser(user, YCClassificationsInternal.Instance)
    );
  };

  protected refreshStrategies = async () => {
    this.YCstrategies = this.Strategies.map(
      (strategy: DBStrategy) =>
        new YCStrategy(strategy, YCClassificationsInternal.Instance)
    );
  };

  protected refreshActions = async () => {
    this.YCactions = this.Actions.map(
      (action: DBAction) =>
        new YCAction(action, YCClassificationsInternal.Instance)
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
