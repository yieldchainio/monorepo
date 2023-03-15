import {
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
} from "../../types/db";
import { YCFunc } from "../function/function";
import { YCArgument, CustomArgument } from "../argument/argument";
import { getAddress } from "ethers";
import { YCFlow } from "../flow/flow";
import { YCToken } from "../token/token";
import { YCProtocol } from "../protocol/protocol";
import { YCNetwork } from "../network/network";
import { YCAddress } from "../address/address";
import { YCStrategy } from "../strategy/strategy";
import { YCUser } from "../user/user";
import { YCAction } from "../action/action";
import { ClassificationContext } from "../../types/yc";
import { PrismaClient } from "@yc/yc-data";
import { YCClassificationsInternal } from "./internals";
import { Endpoints } from "./types";

/**
 * @notice
 * A complete context of Yieldchain's current classified Database.
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

  // Cannot initiallize more than once
  public initiallized: boolean = false;
  // API URL
  static apiURL = "https://api.yieldchain.io";

  // =======================
  //      CORE METHODS
  // =======================

  /**
   * Initiate the context class using a JSON object
   */
  fromJSON = (jsonContext: ClassificationContext) => {
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
    const obj = {};

    // Iterate over each endpoint
    for (const [endpoint, config] of Object.entries(this.ENDPOINT_CONFIGS)) {
      Object.assign(obj, {
        [endpoint]: config.get(),
      });
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
        "Error while refreshing YC Context. Message:",
        err.message,
        "Stack:",
        err.stack,
        "Cause:",
        err.cause
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
    return this.Addresses.map(
      (address: DBAddress) => new YCAddress(address, this)
    );
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
    return this.Functions.map((func: DBFunction) => new YCFunc(func, this));
  }

  get arguments() {
    return this.Parameters.map((arg: DBArgument) => new YCArgument(arg, this));
  }

  getArguments = (_customValue?: CustomArgument) => {
    return this.Parameters.map(
      (arg: DBArgument) => new YCArgument(arg, this, _customValue)
    );
  };

  get flows() {
    return this.Flows.map((flow: DBFlow) => new YCFlow(flow, this));
  }

  get strategies() {
    return this.Strategies.map(
      (strategy: DBStrategy) => new YCStrategy(strategy, this)
    );
  }

  get protocols() {
    return this.Protocols.map(
      (protocol: DBProtocol) => new YCProtocol(protocol, this)
    );
  }

  get tokens(): YCToken[] {
    return this.Tokens.map((token: DBToken) => new YCToken(token, this));
  }

  get actions(): YCAction[] {
    return this.Actions.map((action: DBAction) => new YCAction(action, this));
  }

  get users() {
    return this.Users.map((user: DBUser) => new YCUser(user, this));
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
    let token = _dbToken
      ? _dbToken
      : this.Tokens.find((_token: DBToken) => {
          // User inputted an address & a chain ID
          if (_chain_id && typeof _token_id_or_address == "string")
            try {
              let address = getAddress(_token_id_or_address);
              return (
                getAddress(_token.address) == address &&
                _token.chain_id == _chain_id
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
        });

    // Safeguard
    if (!token) return null;

    // Return YCToken instance
    return new YCToken(token, this);
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
    const user = this.Users.find((_user: DBUser) => _user.id == _userID);
    if (!user) return null;
    return new YCUser(user, this);
  };
}
