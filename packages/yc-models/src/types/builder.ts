/**
 * Types for the strategy builder service that the frontend consumes
 */

import { JSONStep } from "./db.js";
import { address, bytes } from "./global.js";

type FalseValidationResponse = { status: false; reason: string };
type TrueValidationResponse = { status: true };
export type ValidationResponse =
  | FalseValidationResponse
  | TrueValidationResponse;

export type BuilderResponse =
  | FalseValidationResponse
  | (TrueValidationResponse & {
      deploymentCalldata: bytes;
    });

export type ApprovalPairs = address[][];

export type StepsToEncodedFunctions = Map<string, bytes>;

export type BuilderRequestBody = {
  seedSteps: JSONStep;
  treeSteps: JSONStep;
  vaultVisibility: boolean;
  depositTokenID: string;
  chainID: number;
};
