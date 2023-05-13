/**
 * Types for the strategy builder service
 */

import { BuilderRequestBody, JSONStep, address, bytes } from "@yc/yc-models";
import { Request } from "express";

export interface VaultCreationRequest extends Request {
  body: BuilderRequestBody;
}
