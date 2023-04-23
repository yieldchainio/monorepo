/**
 * Types for the step class
 */

import {
  YCAction,
  YCArgument,
  YCFunc,
  YCProtocol,
  YCToken,
  YCClassifications,
  DBStep,
} from "@yc/yc-models";
import { ImageSrc } from "components/wrappers/types";

// The state of the step - whether you are choosing an action (INIT), configuring (Any action config, CONFIG), or if it is complete
export enum BaseStepStates {
  INITIAL = "initial",
  COMPLETE = "complete",
}

// the differnt types of steps.
export enum StepType {
  STEP = "step",
  TRIGGER = "trigger",
  CONDITION = "condition",
}

/**
 * Different states of a step.
 *
 * 1) Initial - an initial version of the step (i.e, usually to choose the initial config, like Choose Action, Choose Trigger, etc)
 * 2) Config - After choosing some initial action/whatever, u would usually have some configurations for them
 * 3) Complete - When a step's configuration is completed
 * 4) Empty - an empty step. This is usually refering to a component which adds a new child for the parent when they have none.
 */
export type StepState = "initial" | "complete" | "config" | "empty";

// The different types of action configs.
export enum ActionConfigs {
  STAKE = "STAKE",
  SWAP = "SWAP",
  LP = "LP",
  HARVEST = "HARVEST",
}

// The different types of trigger configs
export enum TriggerConfigs {
  AUTOMATION = "AUTOMATION",
}
// The different sizing for nodes
export enum StepSizing {
  SMALL = "small",
  MEDIUM = "medium",
}

// Dimensions (Width, height)
export type Dimensions = { width: number; height: number };

// Mapping default dimensions of the step sizing
export const DefaultDimensions: { [key in StepSizing]: Dimensions } = {
  [StepSizing.SMALL]: { width: 246, height: 56 },
  [StepSizing.MEDIUM]: { width: 327, height: 96 },
};

// Position (x, y)
export type Position = { x: number; y: number };

// // The interface for the config object passed to the step
// export interface IStepConfig {
//   id: string;
//   parentId: string;
//   protocol: string;
//   percentage: number;
//   inflows: string[];
//   outflows: string[];
//   action: string;
//   function: string;
//   customArgs: any[];
//   children: IStepConfig[];
//   state: StepState;
//   actionConfig: ActionConfigs | null;
//   size: StepSizing;
// }

// An interface for the props provided when construcing a Step from a DBStep
export interface DBStepConstructionProps<T extends IStep<T>> {
  step: DBStep;
  context: YCClassifications;
  iStepConfigs?: IStepOnlyFE<T>;
}

// An interface for the IStep propreties which are frontend-related
export interface IStepOnlyFE<T extends IStep<T>> {
  state?: StepState;
  actionConfig?: ActionConfigs | null;
  size?: StepSizing;
  type?: StepType;
}

// An interface for hte IStep propreties which are reguler step-related
export interface IStepReguler<T extends IStep<T>> {
  protocol?: YCProtocol | null;
  action?: YCAction | null;
  function?: YCFunc | null;
  unlockedFunctions?: YCFunc[];
  customArguments?: YCArgument[];
}

// An interface for the IStep propreties which are trigger step-related
export interface IStepTrigger<T extends IStep<T>> {
  triggerName?: string | null;
  triggerDescription?: string | null;
  triggerIcon?: ImageSrc;
  data?: any | null;
  triggerVisuals?: React.ReactNode;
  triggerConfig?: TriggerConfigs | null;
}

// An interface for all of the step data (which the class implements)
export interface IStep<T extends IStep<T>>
  extends IStepOnlyFE<T>,
    IStepReguler<T>,
    IStepTrigger<T> {
  id?: string;
  inflows?: YCToken[];
  outflows?: YCToken[];
  writeable?: boolean;
  tokenPercentages?:
    | Array<[string, TokenPercentage]>
    | Map<string, TokenPercentage>;

  children?: T[];
  percentage?: number;
}

export interface JSONStep {
  // ==GLOBAL== //
  id: string;
  inflows: string[];
  outflows: string[];
  children: JSONStep[];
  parent?: JSONStep | null;
  size: StepSizing;
  dimensions: Dimensions;
  type: StepType;
  state?: StepState;
  writeable?: boolean;
  tokenPercentages?: Array<[string, TokenPercentage]>;

  // ==REGULER== //
  protocol?: string;
  action?: string;
  function?: string;
  unlockedFunctions?: string[];
  customArguments?: any[];
  actionConfig?: ActionConfigs | null;

  // ==TRIGGER== //
  triggerName?: string | null;
  triggerDescription?: string | null;
  triggerIcon?: ImageSrc;
  data?: any | null;
  triggerVisuals?: React.ReactNode;
  triggerConfig?: TriggerConfigs | null;

  percentage: number;
}

/**
 * A flow with percentage share of parent's inflow, and a "dirty" field
 */
export type TokenPercentage = {
  percentage: number;
  dirty: boolean;
};
