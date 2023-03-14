import { create } from "zustand";
import {
  DBAddress,
  DBFunction,
  DBToken,
  DBArgument,
  DBFlow,
  DBProtocol,
  DBStrategy,
  DBNetwork,
  DBAction,
  ClassificationContext,
} from "@yc/yc-models";
import {
  YCAddress,
  YCArgument,
  YCAction,
  YCClassifications,
  YCFlow,
  YCFunc,
  YCNetwork,
  YCProtocol,
  YCSocialMedia,
  YCStep,
  YCStrategy,
  YCToken,
  YCUser,
} from "@yc/yc-models";

/**
 * A base interface for each store
 */
export interface YCBaseStore {
  // The refresh function takes in a YC Context class instance, and hydrates the slice's states using the required context methods,
  // (Impl specfic, of course)
  refresh: (_context: ClassificationContext) => void;
}
/**
 * Interfaces for each one of the slice stores
 */
export interface YCNetworkStore extends YCBaseStore {
  networks: YCNetwork[];
}
export interface YCProtocolStore extends YCBaseStore {
  protocols: YCProtocol[];
}
export interface YCTokenStore extends YCBaseStore {
  tokens: YCToken[];
}
export interface YCFlowStore extends YCBaseStore {
  flows: YCFlow[];
}
export interface YCStrategiesStore extends YCBaseStore {
  strategies: YCStrategy[];
}
export interface YCActionsStore extends YCBaseStore {
  actions: YCAction[];
}
export interface YCAddressesStore extends YCBaseStore {
  addresses: YCAddress[];
}
export interface YCFunctionsStore extends YCBaseStore {
  functions: YCFunc[];
}
export interface YCArgumentsStore extends YCBaseStore {
  arguments: YCArgument[];
}
export interface YCUserStore extends YCBaseStore {
  users: YCUser[];
}
export interface YCContextStore extends YCBaseStore {
  context: YCClassifications;
}

/**
 * @notice the @zustand stores
 */

// export const useYCNetworks = create<YCNetworkStore>((set) => ({
//   networks: [],
//   refresh: (_context: ClassificationContext) => {
//     console.log("Setting networks state bro!!!!");
//     set((state) => ({
//       networks: _context.networks(),
//     }));
//   },
// }));

// export const useYCProtocols = create<YCProtocolStore>((set) => ({
//   protocols: [],
//   refresh: (_context: ClassificationContext) =>
//     set((state) => ({
//       protocols: _context.protocols(),
//     })),
// }));

// export const useYCTokens = create<YCTokenStore>((set) => ({
//   tokens: [],
//   refresh: (_context: ClassificationContext) =>
//     set((state) => ({
//       tokens: _context.tokens(),
//     })),
// }));

// export const useYCFlows = create<YCFlowStore>((set) => ({
//   flows: [],
//   refresh: (_context: ClassificationContext) =>
//     set((state) => ({
//       flows: _context.flows(),
//     })),
// }));

// export const useYCActions = create<YCActionsStore>((set) => ({
//   actions: [],
//   refresh: (_context: ClassificationContext) =>
//     set((state) => ({
//       actions: _context.actions(),
//     })),
// }));

// export const useYCAddresses = create<YCAddressesStore>((set) => ({
//   addresses: [],
//   refresh: (_context: ClassificationContext) =>
//     set((state) => ({
//       addresses: _context.addresses(),
//     })),
// }));

// export const useYCFunctions = create<YCFunctionsStore>((set) => ({
//   functions: [],
//   refresh: (_context: ClassificationContext) =>
//     set((state) => ({
//       functions: _context.functions(),
//     })),
// }));

// export const useYCArguments = create<YCArgumentsStore>((set) => ({
//   arguments: [],
//   refresh: (_context: ClassificationContext) =>
//     set((state) => ({
//       arguments: _context.arguments(),
//     })),
// }));

// export const useYCUsers = create<YCUserStore>((set) => ({
//   users: [],
//   refresh: (_context: ClassificationContext) =>
//     set((state) => ({
//       users: _context.users(),
//     })),
// }));

export const useYCStore = create<YCContextStore>((set, get) => ({
  context: YCClassifications.getInstance(),
  refresh: (_context: ClassificationContext) => {
    const state = get();
    state.context.initFromJSON(_context);
  },
}));

export interface YCJsonData {
  addresses: DBAddress[];
  functions: DBFunction[];
  tokens: DBToken[];
  args: DBArgument[];
  flows: DBFlow[];
  protocols: DBProtocol[];
  strategies: DBStrategy[];
  networks: DBNetwork[];
  actions: DBAction[];
}

//   // ==============
//   //    ENDPOINTS
//   // ==============
//   getAddresses:  => YCAddress[] =  => {
//     return this.#addresses.map(
//       (address: DBAddress) => new YCAddress(address, this)
//     );
//   };

//   getNetworks =  => {
//     return this.#networks.map(
//       (network: DBNetwork) => new YCNetwork(network, this)
//     );
//   };

//  getFunctions =  => {
//     return this.#functions.map((func: DBFunction) => new YCFunc(func, this));
//   };

//  getArguments = (_customValue?: CustomArgument) => {
//     return this.#parameters.map(
//       (arg: DBArgument) => new YCArgument(arg, this, _customValue)
//     );
//   };

//   getFlows =  => {
//     return this.#flows.map((flow: DBFlow) => new YCFlow(flow, this));
//   };

//   getStrategies =  => {
//     return this.#strategies.map(
//       (strategy: DBStrategy) => new YCStrategy(strategy, this)
//     );
//   };

//   getProtocols =  => {
//     return this.#protocols.map(
//       (protocol: DBProtocol) => new YCProtocol(protocol, this)
//     );
//   };

//   getTokens = : YCToken[] => {
//     return this.#tokens.map((token: DBToken) => new YCToken(token, this));
//   };
