/**
 * Types for the strategy builder service
 */

import { BuilderRequestBody, JSONStep, StrategyClassificationRequestBody, address, bytes } from "@yc/yc-models";
import { Request } from "express";

export interface VaultCreationRequest extends Request {
  body: BuilderRequestBody;
}

export interface VaultClassificationRequest extends Request {
  body:  StrategyClassificationRequestBody
}
