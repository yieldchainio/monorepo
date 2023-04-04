/**
 * Types for the step class
 */

import {
  YCAction,
  YCArgument,
  YCFunc,
  YCProtocol,
  YCToken,
} from "@yc/yc-models";

// The state of the step - whether you are choosing an action (INIT), configuring (Any action config, CONFIG), or if it is complete
export enum StepState {
  INIT,
  COMPLETE,
  CONFIG,
}

// The different types of action configs.
export enum ActionConfigs {
  STAKE,
  SWAP,
  LP,
  HARVEST,
}

// The different sizing for nodes
export enum StepSizing {
  SMALL,
  MEDIUM,
}

// Dimensions (Width, height)
export type Dimensions = { width: number; height: number };

// Mapping default dimensions of the step sizing
export const DefaultDimensions: { [key in StepSizing]: Dimensions } = {
  [StepSizing.SMALL]: { width: 126, height: 58 },
  [StepSizing.MEDIUM]: { width: 327, height: 128 },
};

// Position (x, y)
export type Position = { x: number; y: number };

// An interface for all of the step data (which the class implements
export interface IStep<T extends IStep<T>> {
  id: string;
  state: StepState;
  actionConfig: ActionConfigs | null;
  size: StepSizing;
  protocol: YCProtocol | null;
  inflows: YCToken[];
  outflows: YCToken[];
  action: YCAction | null;
  function: YCFunc | null;
  customArguments: YCArgument[];
  children: T[];
  parent: T | null;
}
