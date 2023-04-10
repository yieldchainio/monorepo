/**
 * Types fo the strategy store
 */

import { DBNetwork, DBToken, YCNetwork, YCToken } from "@yc/yc-models";
import { Step } from "utilities/classes/step";
import { JSONStep } from "utilities/classes/step/types";
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
  step: Step | null;
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
  step: JSONStep | null;
}

/**
 * @methods
 */
export interface StrategyStoreActions {
  // Load a strategy store into the store
  setStrategy: (configs: StrategyStoreState) => void;

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
}

export interface StrategyStore
  extends StrategyStoreActions,
    StrategyStoreState {}
