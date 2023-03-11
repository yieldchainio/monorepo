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
} from "../types/db";
import { YCFunc } from "./function";
import axios from "axios";
import { YCArgument, CustomArgument } from "./argument";
import { getAddress } from "ethers";
import { YCFlow } from "./flow";
import { YCToken } from "./token";
import { YCProtocol } from "./protocol";
import { YCNetwork } from "./network";
import { YCAddress } from "./address";
import { YCStrategy } from "./strategy";
import { YCUser } from "./user";
import { YCAction } from "./action";
import { ClassificationContext } from "../types/yc";

/**
 * @notice
 * A complete context of Yieldchain's current classified Database.
 */

export interface StaticContext {
  addresses: YCAddress[];
  functions: YCFunc;
  tokens: YCToken[];
  parameters: DBArgument[]; // TODO: Change name to arguments
  flows: YCFlow[];
  protocols: YCProtocol[];
  strategies: YCStrategy[];
}

// A class representing Yieldchain's classifications. Constructs itself with DB info and has retreival methods/"Indexes"
export class YCClassifications {
  // Singleton Instance
  private static instance: YCClassifications;

  // From JSON (no async shiet)
  static getInstance = (
    _jsonContext?: ClassificationContext
  ): YCClassifications => {
    if (!YCClassifications.instance)
      YCClassifications.instance = new YCClassifications();

    // Initiallize the data points with the provided context, if needed
    if (_jsonContext) YCClassifications.instance.initFromJSON(_jsonContext);

    return YCClassifications.instance;
  };
  // =======================
  //      VARIABLES
  // =======================

  // "Endpoints"
  #addresses: DBAddress[] = [];
  #functions: DBFunction[] = [];
  #tokens: DBToken[] = [];
  #parameters: DBArgument[] = []; // TODO: Change name to arguments
  #flows: DBFlow[] = [];
  #protocols: DBProtocol[] = [];
  #strategies: DBStrategy[] = [];
  #networks: DBNetwork[] = [];
  #actions: DBAction[] = [];
  #users: DBUser[] = [];

  // =======================
  //      CONSTRUCTOR
  //      (SINGLETON)
  // =======================
  constructor() {
    console.log("New YCClass!!");
  }

  // Cannot initiallize more than once
  private initiallized: boolean = false;

  // API URL
  static apiURL = "https://api.yieldchain.io";

  initFromJSON = (jsonContext: ClassificationContext) => {
    this.#addresses = jsonContext.addresses;
    this.#actions = jsonContext.actions;
    this.#flows = jsonContext.flows;
    this.#tokens = jsonContext.tokens;
    this.#functions = jsonContext.funcs;
    this.#networks = jsonContext.networks;
    this.#parameters = jsonContext.parameters;
    this.#protocols = jsonContext.protocols;
    this.#strategies = jsonContext.strategies;
    this.#users = jsonContext.users;
  };

  // Initiallize the instance - Populate all endpoints.
  initiallize = async (): Promise<void> => {
    // Only init once
    if (!this.initiallized) this.initiallized = true;

    // Set all of the DB info
    this.#addresses = await (
      await axios.get(YCClassifications.apiURL + "/addresses")
    ).data.addresses;
    this.#functions = await (
      await axios.get(YCClassifications.apiURL + "/functions")
    ).data.functions;
    this.#tokens = await (
      await axios.get(YCClassifications.apiURL + "/tokens")
    ).data.tokens;
    this.#parameters = await (
      await axios.get(YCClassifications.apiURL + "/parameters")
    ).data.parameters;
    this.#flows = await (
      await axios.get(YCClassifications.apiURL + "/flows")
    ).data.flows;
    this.#protocols = await (
      await axios.get(YCClassifications.apiURL + "/protocols")
    ).data.protocols;
    this.#strategies = await (
      await axios.get(YCClassifications.apiURL + "/strategies")
    ).data.strategies;
    this.#networks = await (
      await axios.get(YCClassifications.apiURL + "/networks")
    ).data.networks;
    this.#actions = await (
      await axios.get(YCClassifications.apiURL + "/actions")
    ).data.actions;
    this.#users = await (
      await axios.get(YCClassifications.apiURL + "/users")
    ).data.users;
  };

  // =======================
  //        METHODS
  // =======================

  // ==============
  //    ENDPOINTS
  // ==============
  addresses = () => {
    return this.#addresses.map(
      (address: DBAddress) => new YCAddress(address, this)
    );
  };

  networks = () => {
    console.log("These are class networks", this.#networks);
    return this.#networks.map(
      (network: DBNetwork) => new YCNetwork(network, this)
    );
  };

  functions = () => {
    return this.#functions.map((func: DBFunction) => new YCFunc(func, this));
  };

  arguments = (_customValue?: CustomArgument) => {
    return this.#parameters.map(
      (arg: DBArgument) => new YCArgument(arg, this, _customValue)
    );
  };

  flows = () => {
    return this.#flows.map((flow: DBFlow) => new YCFlow(flow, this));
  };

  strategies = () => {
    return this.#strategies.map(
      (strategy: DBStrategy) => new YCStrategy(strategy, this)
    );
  };

  protocols = () => {
    return this.#protocols.map(
      (protocol: DBProtocol) => new YCProtocol(protocol, this)
    );
  };

  tokens = (): YCToken[] => {
    return this.#tokens.map((token: DBToken) => new YCToken(token, this));
  };

  actions = (): YCAction[] => {
    return this.#actions.map((action: DBAction) => new YCAction(action, this));
  };

  users = () => {
    return this.#users.map((user: DBUser) => new YCUser(user, this));
  };

  // users = (): YCUser[] => {
  //   return this.#users.map((user: DBUser) => new YCUser(user, this));
  // };

  // ==============
  //    METHODS
  // ==============

  // Get an address instance using an address / it's DB identifier
  getAddressYC = (_address_or_id: number | string): DBAddress | null => {
    // Find the address
    return (
      this.#addresses.find((_address: DBAddress) => {
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
      this.#functions.find(
        (_func: DBFunction) => _func.function_identifier == _function_id
      ) || null;

    return func ? new YCFunc(func, this) : null;
  };

  // Get an argument instance using an argument ID
  getArgument = (_argument_id: number): YCArgument | null => {
    let arg =
      this.#parameters.find(
        (_arg: DBArgument) => _arg.parameter_identifier == _argument_id
      ) || null;

    return arg ? new YCArgument(arg, this) : null;
  };

  // Get a full flow instance with a flow ID
  getFlow = (_flow_id: number): YCFlow | null => {
    let flow = this.#flows.find(
      (_flow: DBFlow) => _flow.flow_identifier == _flow_id
    );
    if (flow) return new YCFlow(flow, this);
    return null;
  };

  // Get the full Token instance with a token ID
  getToken = (
    _token_id_or_address: number,
    _chain_id?: number | string,
    _dbToken?: DBToken
  ): YCToken | null => {
    let token = _dbToken
      ? _dbToken
      : this.#tokens.find((_token: DBToken) => {
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
          return _token.token_identifier == _token_id_or_address;
        });

    // Safeguard
    if (!token) return null;

    // Return YCToken instance
    return new YCToken(token, this);
  };

  // Get a protoocl
  getProtocol = (_protocolID: number) => {
    // Search for the protocol
    let protocol = this.#protocols.find(
      (protocol: DBProtocol) => protocol.protocol_identifier == _protocolID
    );

    // If protocol was not found
    if (!protocol) return null;

    // Return YCProtocol instance
    return new YCProtocol(protocol, this);
  };

  // Get a network
  getNetwork = (_chainID: number) => {
    // Search for the network
    let network = this.#networks.find(
      (network: DBNetwork) => network.chain_id == _chainID
    );

    // If network was not found
    if (!network) return null;

    // Return YCNetwork instance
    return new YCNetwork(network, this);
  };

  getUser = (_userID: string): YCUser | null => {
    const user = this.#users.find((_user: DBUser) => _user.id == _userID);
    if (!user) return null;
    return new YCUser(user, this);
  };
}
