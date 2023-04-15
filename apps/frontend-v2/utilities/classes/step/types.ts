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

export type StepState = "initial" | "complete" | ActionConfigs;

// The different types of action configs.
export enum ActionConfigs {
  STAKE = "STAKE",
  SWAP = "SWAP",
  LP = "LP",
  HARVEST = "HARVEST",
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
  [StepSizing.SMALL]: { width: 176, height: 78 },
  [StepSizing.MEDIUM]: { width: 327, height: 128 },
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
  type?: StepType
}

// An interface for all of the step data (which the class implements)
export interface IStep<T extends IStep<T>> extends IStepOnlyFE<T> {
  id?: string;
  protocol?: YCProtocol | null;
  inflows?: YCToken[];
  outflows?: YCToken[];
  action?: YCAction | null;
  function?: YCFunc | null;
  customArguments?: YCArgument[];
  children?: T[];
  parent?: T | null;
  percentage?: number;
}

export interface JSONStep {
  id: string;
  protocol?: string;
  inflows: string[];
  outflows: string[];
  action?: string;
  function?: string;
  customArguments?: any[];
  children: JSONStep[];
  percentage: number;
  size: StepSizing;
  dimensions: Dimensions;
  state: StepState;
}
