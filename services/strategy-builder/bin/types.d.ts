/**
 * Types for the strategy builder service
 */
import { BuilderRequestBody, StrategyClassificationRequestBody } from "@yc/yc-models";
import { Request } from "express";
export interface VaultCreationRequest extends Request {
    body: BuilderRequestBody;
}
export interface VaultClassificationRequest extends Request {
    body: StrategyClassificationRequestBody;
}
