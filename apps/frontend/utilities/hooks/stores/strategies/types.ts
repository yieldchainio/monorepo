/**
 * Types fo the strategy store
 */

import { DBNetwork, DBToken, YCNetwork, YCToken } from "@yc/yc-models";
import { ImageSrc } from "components/wrappers/types";
import { Step } from "utilities/classes/step";
import { JSONFrontendStep } from "utilities/classes/step/types";
/**
 * @state
 */
export interface StrategyStoreState {
  // UUID of the strategy
  id: string;

  // Privacy setting of the strategy (Public/Private)
  isPublic: boolean;

  // Deposit token of the strategy (DBToken)
  depositToken: YCToken | null;

  // Network of the strategy (DBNetwork)
  network: YCNetwork | null;

  // Title of the strategy
  title: string | null;

  // Steps of the strategy (Tree)
  step: Step;

  // Seed step of the strategy (the base steps), (Tree)
  seedStep: Step;
}

/**
 * UX-related state of the configs experience
 */
export type configProgressStep = {
  // The page routeo the config i.e "/network"
  route: string;

  // The progress step object, including an image, a label, and a state (complete, incomplete, active)
  progressStep: {
    image: ImageSrc;
    label: string;
    state: "complete" | "not_complete" | "active";
  };

  // The condition of whether the user can continue at this step (i.e, for /token - () => !!state.token)
  condition: () => true | string;
};
export interface StrategyStoreConfigsUtilityState {
  // The strategy configs' routes state. I.e which one is completed or not and etc
  strategyConfigs: configProgressStep[];
}

/**
 * The state in JSON (What is persisted)
 */

export interface JSONStrategyStoreState {
  // UUID of the strategy
  id: string;

  // Privacy setting of the strategy (Public/Private)
  isPublic: boolean;

  // Deposit token of the strategy (DBToken)
  depositToken: DBToken | null;

  // Network of the strategy (DBNetwork)
  network: DBNetwork | null;

  // Title of the strategy
  title: string | null;

  // Steps of the strategy (Tree)
  step: JSONFrontendStep;

  // Seed step of the strategy (the base steps), (Tree)
  seedStep: JSONFrontendStep;

  // The configs stuff (for UX purposes)
  strategyConfigs: configProgressStep[];
}

/**
 * @methods
 */
export interface StrategyStoreActions {
  // Load a strategy store into the store
  setStrategy: (
    configs?: StrategyStoreState & StrategyStoreConfigsUtilityState
  ) => void;

  /**
   * Set states individually
   */

  // Set the strategy's privacy setting (true == Public, false == Private)
  setPrivacy: (privacy: boolean) => void;

  // Set the strategy's title
  setTitle: (title: string) => void;

  // set the strategy's deposit token
  setDepositToken: (depositToken: YCToken) => void;

  // Set the strategy's network
  setNetwork: (network: YCNetwork) => void;

  // Rehydrate the step's state
  rehydrateSteps: () => void;

  // Change some details about the above
  changeConfigRouteState: (
    index: number,
    newState: "complete" | "not_complete" | "active"
  ) => void;
}

export interface StrategyStore
  extends StrategyStoreActions,
    StrategyStoreState,
    StrategyStoreConfigsUtilityState {}
