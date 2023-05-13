/**
 * Types for the strategy builder service
 */
import { BuilderRequestBody } from "@yc/yc-models";
import { Request } from "express";
export interface VaultCreationRequest extends Request {
    body: BuilderRequestBody;
}
